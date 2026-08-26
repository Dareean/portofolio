import { NextResponse } from "next/server";
import { getCMSData } from "@/lib/cms";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "AI service key is not configured in server environment." },
      { status: 500 }
    );
  }

  try {
    const { messages = [] } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Invalid messages payload provided." },
        { status: 400 }
      );
    }

    // Retrieve latest CMS data from Supabase/Local to ground AI on reality
    const cmsData = await getCMSData();

    const techStackList = (cmsData.about.techStack || [])
      .map((t) => `${t.name} (${t.category})`)
      .join(", ");

    const communityList = (cmsData.about.communityRoles || [])
      .map((c) => `${c.role} at ${c.org}`)
      .join(", ");

    const projectsSummary = (cmsData.projects || [])
      .map(
        (p) =>
          `• Project: "${p.title}" (${p.category}, ${p.year})\n  - Technologies: ${p.technologies.join(", ")}\n  - Description: ${p.description}\n  - Live URL: ${p.link || "N/A"}`
      )
      .join("\n\n");

    const experiencesSummary = (cmsData.experiences || [])
      .map(
        (e) =>
          `• ${e.role} @ ${e.organization} (${e.dateStart} - ${e.dateEnd || "Present"}, Category: ${e.category})\n  - Details: ${e.description}\n  - Highlights: ${(e.highlights || []).join("; ")}`
      )
      .join("\n\n");

    const blogsSummary = (cmsData.blogs || [])
      .map(
        (b) =>
          `• Article: "${b.title}" (${b.category}, Date: ${b.date})\n  - Excerpt: ${b.excerpt}\n  - Tags: ${(b.tags || []).join(", ")}`
      )
      .join("\n\n");

    const systemPrompt = `You are "Dareean AI Copilot" — an intelligent, professional, and friendly AI assistant representing Dareean Ahmad Raffi on his personal web portfolio.

Your role is to assist tech recruiters, engineering managers, potential clients, and fellow developers who want to learn more about Dareean's skills, work ethics, projects, background, and availability.

==================================================
DAREEAN'S VERIFIED PORTFOLIO DATA (GROUND TRUTH):
==================================================
• Full Name: ${cmsData.about.fullName || "Dareean Ahmad Raffi"}
• Professional Role: ${cmsData.about.roleTag || "Full-Stack Developer & UI/UX Specialist"}
• Location: ${cmsData.about.locationText || "Palu, Central Sulawesi, Indonesia"} (Timezone: ${cmsData.about.timeZone || "WITA / GMT+8"})
• Primary Email: ${cmsData.site.email || "dareean.business@gmail.com"}
• GitHub: ${cmsData.site.github || "https://github.com/Dareean"}
• LinkedIn: ${cmsData.site.linkedin || "https://linkedin.com/in/dareean"}
• Instagram: ${cmsData.site.instagram || "https://instagram.com/dareean"}
• Status & Availability: ${cmsData.about.statusTag || "Open for Remote Full-time, Freelance, and High-impact Internships"}
• Philosophy: "${cmsData.about.philosophyHeading}" — ${cmsData.about.philosophyBio}
• Resume / CV URL: "${cmsData.about.resumeUrl || "/assets/CV-Rafi(English).pdf"}"

• Core Technical Skills:
  ${techStackList || "Next.js, TypeScript, React, Tailwind CSS, Node.js, Prisma ORM, QGIS, Spatial Data, Python, IoT / ESP32"}

• Leadership & Community Roles:
  ${communityList || "Mentor Lead at Programming Tadulako, PIC / Coordinator at I-Fest 2026"}

• Featured Software Projects:
${projectsSummary || "Projects details available in the Projects section."}

• Career & Leadership Milestones:
${experiencesSummary || "Milestones details available in the Journey section."}

• Recent Articles & Thought Leadership:
${blogsSummary || "Recent writings available in the Blog section."}

==================================================
BEHAVIOR & RESPONSE GUIDELINES:
==================================================
1. TONE & PERSONA:
   - Articulate, humble yet confident, warm, concise, and engineering-minded.
   - Always speak from the perspective of Dareean's authorized AI representative.
   - Keep answers punchy (usually 2-4 sentences or structured bullet points). Avoid fluff or overly long essays unless specifically requested.

2. LANGUAGE:
   - If the user asks in Indonesian, respond in natural, professional Bahasa Indonesia.
   - If the user asks in English, respond in polished, fluent English.

3. ACCURACY & HONESTY:
   - Rely ONLY on the verified data provided above.
   - If asked about a skill or technology not mentioned in Dareean's stack, be transparent (e.g. "Dareean specializes heavily in Next.js/TypeScript and modern web systems, though with his computer science foundations at Tadulako University, he learns new frameworks rapidly.").
   - When mentioning contact info, share his email: ${cmsData.site.email || "dareean.business@gmail.com"} and LinkedIn.

4. FORMATTING:
   - Use bolding for key achievements, metrics, or technologies.
   - Use short bullet points when listing projects or skills for maximum readability.`;

    // Fetch active Groq model list dynamically
    let activeModels: string[] = [];
    try {
      const modelsRes = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (modelsRes.ok) {
        const modelsJson = await modelsRes.json();
        if (Array.isArray(modelsJson.data) && modelsJson.data.length > 0) {
          activeModels = modelsJson.data.map((m: any) => m.id as string);
        }
      }
    } catch (e) {
      console.warn("Could not fetch Groq model list dynamically:", e);
    }

    if (activeModels.length === 0) {
      activeModels = ["openai/gpt-oss-20b", "openai/gpt-oss-120b", "qwen/qwen3.6-27b"];
    }

    // Clean user conversation history (keep last 8 messages for context window efficiency)
    const formattedMessages = messages.slice(-8).map((m: any) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: String(m.content || ""),
    }));

    let groqResponse: Response | null = null;
    let lastError = "";

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
              ...formattedMessages,
            ],
            temperature: 0.35,
            max_tokens: 600,
          }),
        });

        if (res.ok) {
          groqResponse = res;
          break;
        } else {
          lastError = await res.text();
        }
      } catch (e) {
        console.warn(`Groq request error for ${modelName}:`, e);
      }
    }

    if (!groqResponse || !groqResponse.ok) {
      console.error("Groq Recruiter AI error:", lastError);
      return NextResponse.json(
        { error: "Maaf, terjadi kendala saat memproses jawaban AI. Silakan coba sesaat lagi." },
        { status: 500 }
      );
    }

    const groqJson = await groqResponse.json();
    const reply = groqJson.choices?.[0]?.message?.content?.trim() || "";

    return NextResponse.json({
      success: true,
      reply,
    });
  } catch (error: any) {
    console.error("Recruiter AI Server Error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
