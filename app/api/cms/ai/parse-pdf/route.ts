import { NextResponse } from "next/server";
import { isServerAuthenticated } from "@/lib/auth";
import { PortfolioCMSData, getCMSData } from "@/lib/cms";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";
import { extractText } from "unpdf";

export async function POST(req: Request) {
  // Verify authentication
  const isAuth = await isServerAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "GROQ_API_KEY is not configured in .env.local" },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawText = (formData.get("rawText") as string) || "";
    const useExistingDoc = formData.get("useExistingDoc") === "true";

    let extractedText = rawText;

    if (file && file.size > 0) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (file.name.toLowerCase().endsWith(".docx")) {
        try {
          const zip = new AdmZip(buffer);
          const xml = zip.readAsText("word/document.xml");
          extractedText = xml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        } catch (docxErr) {
          console.error("DOCX parse error:", docxErr);
          extractedText = buffer.toString("utf-8");
        }
      } else if (file.name.toLowerCase().endsWith(".pdf")) {
        try {
          const pdfResult = await extractText(new Uint8Array(buffer));
          extractedText = Array.isArray(pdfResult.text) ? pdfResult.text.join("\n") : String(pdfResult.text || "");
        } catch (pdfErr) {
          console.error("PDF parse error:", pdfErr);
          extractedText = buffer.toString("utf-8");
        }
      } else {
        extractedText = buffer.toString("utf-8");
      }
    } else if (useExistingDoc) {
      // Read text from public/documents/resume.docx
      const docxPath = path.join(process.cwd(), "public", "documents", "resume.docx");
      if (fs.existsSync(docxPath)) {
        try {
          const zip = new AdmZip(docxPath);
          const xml = zip.readAsText("word/document.xml");
          extractedText = xml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        } catch (e) {
          console.error("Existing docx read error:", e);
        }
      }
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return NextResponse.json(
        { error: "Tidak dapat membaca teks dari dokumen. Pastikan file PDF/DOCX memiliki teks yang dapat dibaca." },
        { status: 400 }
      );
    }

    // Load current CMS data
    const currentCMS = await getCMSData();

    const systemPrompt = `You are an elite Resume-to-CMS Sync Engineer and AI Data Integrator.
Your goal is to parse a candidate's CV document (PDF/DOCX/text) and compare it against their current portfolio CMS database.

Identify:
1. Any NEW projects mentioned in the CV that do NOT exist in the CMS (or have outdated descriptions).
2. Any NEW work/organization experiences or milestones mentioned in the CV that are missing or outdated in the CMS.
3. Any NEW tech stack skills present in the CV that are not in the current CMS tech stack.
4. Any updated profile bio, headline, role tag, or contact info.

================================================================================
CRITICAL LANGUAGE REGULATION (MANDATORY BAHASA INDONESIA):
- ALL content output destined for CMS synchronization (including project descriptions, milestone descriptions, display titles, summary points, and bio narratives) MUST BE IN BAHASA INDONESIA.
- IF THE SOURCE CV IS IN ENGLISH: You MUST translate and adapt all descriptions, responsibilities, and achievements into fluent, high-impact, professional Bahasa Indonesia (e.g. "Develop a state-transition-based application architecture..." -> "Mengembangkan arsitektur aplikasi berbasis transisi status untuk meminimalkan risiko kesalahan input data...").
- IF THE SOURCE CV IS ALREADY IN BAHASA INDONESIA: Keep it in Bahasa Indonesia without altering the original meaning.
- Industry technical terms (e.g. Full Stack Developer, Frontend, UI/UX, React, Next.js, Laravel, Blade, Livewire, TypeScript, B2B, Code Review, Lead Designer) MUST remain in standard professional terminology.
================================================================================

You MUST respond strictly with a valid JSON object matching this schema:
{
  "analysisSummary": "Ringkasan analisis perbandingan dalam 3-4 poin bahasa Indonesia yang jelas dan padat",
  "newProjects": [
    {
      "id": 1787600001,
      "title": "Judul Proyek",
      "slug": "project-slug",
      "category": "Web Platform | Mobile App | Open Source | UI/UX",
      "year": 2026,
      "image": "/assets/greengnsulteng_web.png",
      "link": "https://...",
      "featured": false,
      "description": "Deskripsi proyek dalam Bahasa Indonesia dengan pencapaian STAR dan metrik",
      "technologies": ["React", "TypeScript"],
      "metrics": [{"label": "Dampak", "value": "+40%"}]
    }
  ],
  "newExperiences": [
    {
      "id": 1787600002,
      "title": "Judul Milestone / Posisi",
      "role": "Nama Peran (misal: Lead Full Stack Developer)",
      "organization": "Perusahaan / Organisasi",
      "dateStart": "2026-01",
      "dateEnd": "",
      "description": "Deskripsi tanggung jawab dan pencapaian dalam Bahasa Indonesia",
      "highlights": ["Kepemimpinan", "Frontend"],
      "category": "work | community | award | committee | volunteer | education"
    }
  ],
  "newSkills": [
    {
      "name": "Nama Skill",
      "category": "Framework | Language | Database | Styling | Tool | Design"
    }
  ],
  "profileUpdates": {
    "roleTag": "Undergraduate Informatics Engineering · Full Stack Developer",
    "philosophyBio": "Bio profil terbaru dalam Bahasa Indonesia",
    "locationText": "Palu, Sulawesi Tengah, Indonesia"
  }
}

Important Rules:
- Return ONLY the JSON object, without backticks, markdown fences, or conversational text.
- Assign unique numeric IDs to each item in newProjects and newExperiences.
- Compare strictly against current CMS data to avoid duplicate projects or skills.`;

    const userPrompt = `CURRENT CMS DATABASE:
${JSON.stringify(
  {
    projects: currentCMS.projects.map((p) => ({ title: p.title, year: p.year, tech: p.technologies })),
    experiences: currentCMS.experiences.map((e) => ({ role: e.role, org: e.organization, date: e.dateStart })),
    skills: currentCMS.about.techStack.map((s) => s.name),
    bio: currentCMS.about.philosophyBio,
  },
  null,
  2
)}

EXTRACTED CV DOCUMENT TEXT:
"""${extractedText.slice(0, 5000)}"""`;

    // Dynamically fetch active model IDs from Groq API /models endpoint
    let activeModels: string[] = [];
    try {
      const modelsRes = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (modelsRes.ok) {
        const modelsJson = await modelsRes.json();
        if (Array.isArray(modelsJson.data) && modelsJson.data.length > 0) {
          activeModels = modelsJson.data.map((m: any) => m.id as string);
          console.log("Dynamically fetched Groq active models:", activeModels);
        }
      }
    } catch (e) {
      console.warn("Could not fetch Groq model list dynamically:", e);
    }

    if (activeModels.length === 0) {
      activeModels = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "qwen/qwen3.6-27b"];
    }

    let groqResponse: Response | null = null;
    let lastError = "";
    let connectedModel = "";

    for (const modelName of activeModels) {
      try {
        const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens: 3500,
          }),
        });

        if (res.ok) {
          groqResponse = res;
          connectedModel = modelName;
          console.log(`✅ Successfully connected to Groq model: ${modelName}`);
          break;
        } else {
          lastError = await res.text();
          console.warn(`Groq model ${modelName} failed (${res.status}): ${lastError}`);
        }
      } catch (e) {
        console.warn(`Groq fetch error for ${modelName}:`, e);
      }
    }

    if (!groqResponse || !groqResponse.ok) {
      console.error("Groq diff error:", lastError);
      return NextResponse.json({ error: `Groq error: ${lastError}` }, { status: 500 });
    }

    const groqJson = await groqResponse.json();
    const content = groqJson.choices?.[0]?.message?.content || "";
    let parsedDiff;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedDiff = JSON.parse(jsonMatch[0]);
      } else {
        parsedDiff = JSON.parse(content);
      }
    } catch {
      return NextResponse.json({ error: "Gagal memproses respons AI sebagai JSON" }, { status: 500 });
    }

    // Assign fallback IDs if missing
    if (parsedDiff.newProjects) {
      parsedDiff.newProjects = parsedDiff.newProjects.map((p: any, idx: number) => ({
        ...p,
        id: p.id || Date.now() + idx,
        slug: p.slug || `project-${Date.now()}-${idx}`,
        category: p.category || "Web Platform",
        year: p.year || 2026,
        image: p.image || "/assets/greengnsulteng_web.png",
        link: p.link || "https://example.com",
        featured: Boolean(p.featured),
        technologies: Array.isArray(p.technologies) ? p.technologies : ["React", "TypeScript"],
        metrics: Array.isArray(p.metrics) ? p.metrics : [{ label: "Dampak", value: "+30%" }],
      }));
    }

    if (parsedDiff.newExperiences) {
      parsedDiff.newExperiences = parsedDiff.newExperiences.map((e: any, idx: number) => ({
        ...e,
        id: e.id || Date.now() + 100 + idx,
        title: e.title || e.role || "Milestone",
        role: e.role || "Role Title",
        organization: e.organization || "Organization",
        dateStart: e.dateStart || "2026-01",
        dateEnd: e.dateEnd || "",
        description: e.description || "",
        highlights: Array.isArray(e.highlights) ? e.highlights : ["Leadership"],
        category: e.category || "work",
      }));
    }

    return NextResponse.json({
      success: true,
      diff: parsedDiff,
      extractedSnippet: extractedText.slice(0, 300) + "...",
    });
  } catch (err) {
    console.error("PDF Parsing Error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error processing PDF document" },
      { status: 500 }
    );
  }
}
