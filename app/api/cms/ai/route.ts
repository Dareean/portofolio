import { NextResponse } from "next/server";
import { isServerAuthenticated } from "@/lib/auth";
import { PortfolioCMSData } from "@/lib/cms";

// Official baseline template from public/documents/resume.docx
const OFFICIAL_DOCS_TEMPLATE_STRUCTURE = `
OFFICIAL DAREEN AHMAD RAFFI RESUME TEMPLATE STRUCTURE (public/documents/resume.docx):
1. HEADER:
   - Full Name: DAREEAN AHMAD RAFFI MARDIN
   - Subtitle: UNDERGRADUATE INFORMATICS ENGINEERING
   - Location: Central Sulawesi, Palu, Indonesia
   - Contacts: dmardin@gmail.com | +62-853-4072-5481 | github.com/Dareean
2. PROFESSIONAL SUMMARY:
   - Concise 3-4 sentence paragraph highlighting core frontend & fullstack strengths, UI/UX foundation, event leadership (I-Fest), and high-performance web development.
3. TECHNICAL PROJECTS (Format: Title – Subtitle | Role | Year -> Company/Org | Duration -> STAR Achievement Bullets -> Technologies Used)
4. LEADERSHIP & ORGANIZATIONAL EXPERIENCE (Format: Organization/Event -> Role | Duration -> Impact Bullets)
5. PROFESSIONAL WORK EXPERIENCE (Format: Company | Role Title -> Location/Division | Duration -> Quantified Contribution Bullets)
6. EDUCATION:
   - Degree: Teknik Informatika | Bachelor (GPA: 3.8/4.0)
   - University: Tadulako University (2024 – Present)
7. SKILLS (Strict Categories):
   - Core: React, Next.js, TypeScript, JavaScript (ES6+), PHP, Laravel, Livewire.
   - Styling & UI: Tailwind CSS, Framer Motion, GSAP, Figma, Responsive UI/UX.
   - Tools & Cloud: Git, GitHub, MySQL, Supabase, Vercel, Linux Basics.
   - Soft Skills: Event Management, Public Communication, Team Leadership, Problem Solving.
`;

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
    const body = await req.json();
    const {
      action = "generate_cv",
      language = "en",
      customTemplate = "",
      jobDescription = "",
      portfolioData,
      contentToTranslate = "",
    }: {
      action: "generate_cv" | "translate" | "analyze_portfolio" | "tailor_job";
      language: "en" | "id";
      customTemplate?: string;
      jobDescription?: string;
      portfolioData?: PortfolioCMSData;
      contentToTranslate?: string;
    } = body;

    const langName = language === "id" ? "Bahasa Indonesia" : "English";

    // Build context from portfolio data if available
    let profileContext = "";
    if (portfolioData) {
      profileContext = `
CANDIDATE INFORMATION:
- Name: ${portfolioData.about.fullName || "Dareean Ahmad Raffi Mardin"}
- Title / Role: ${portfolioData.about.roleTag || "Undergraduate Informatics Engineering · Full Stack Developer"}
- Location: ${portfolioData.about.locationText || "Palu, Central Sulawesi, Indonesia"}
- Contact Email: ${portfolioData.site.email || "dmardin@gmail.com"}
- GitHub: ${portfolioData.site.github || "https://github.com/Dareean"}
- LinkedIn: ${portfolioData.site.linkedin || "https://linkedin.com/in/dareean"}
- Education: Bachelor of Informatics Engineering, Tadulako University (GPA: 3.8/4.0, 2024 - Present)
- Bio / Philosophy: ${portfolioData.about.philosophyBio}

TECH STACK / SKILLS:
${portfolioData.about.techStack.map((t) => `- ${t.name} (${t.category})`).join("\n")}

WORK & LEADERSHIP EXPERIENCES:
${portfolioData.experiences
  .map(
    (e) =>
      `• ${e.role} at ${e.organization} (${e.dateStart} - ${e.dateEnd || "Present"}) [${e.category.toUpperCase()}]: ${e.description}`
  )
  .join("\n")}

FEATURED PROJECTS & ACHIEVEMENTS:
${portfolioData.projects
  .map(
    (p) =>
      `• ${p.title} (${p.year}) [${p.category}]: ${p.description}\n  Technologies: ${p.technologies.join(", ")}\n  Link: ${p.link}`
  )
  .join("\n")}
`;
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (action === "generate_cv") {
      systemPrompt = `You are an elite Executive Career Consultant, ATS Resume Specialist, and Technical Recruiter.
Your goal is to generate an ultra-clean, high-impact, ATS-compliant Curriculum Vitae (CV) in ${langName}.

Strict Structural Reference (Adopted from public/documents/resume.docx):
${OFFICIAL_DOCS_TEMPLATE_STRUCTURE}

Formatting Rules:
- Output in clean, structured Markdown (Header with contact links, bold headers, clear bullet points).
- For each Technical Project & Experience, provide strong STAR-formula bullets (quantified metrics, clear technical action verbs like Engineered, Architected, Accelerated, Integrated).
- Education section must explicitly include: Teknik Informatika | Bachelor (GPA: 3.8/4.0), Tadulako University (2024 – Present).
- Skills section must be organized into: Core, Styling & UI, Tools & Cloud, and Soft Skills.
- Target Output Language: Strictly in ${langName}.
${customTemplate ? `\nAdditional user guidelines:\n"""${customTemplate}"""\n` : ""}`;

      userPrompt = `Please generate Dareean's complete ATS Curriculum Vitae in ${langName} adhering to the official resume.docx template structure:\n\n${profileContext}`;
    } else if (action === "tailor_job") {
      systemPrompt = `You are an AI Job Compatibility Analyst & Resume Tailoring Strategist.
Your task is to analyze the candidate's portfolio against a target job vacancy in ${langName}, adhering to the official structure of public/documents/resume.docx.

Output Structure:
1. 🎯 **Match Score & Executive Fit** (Estimated % fit score, matched key skills, and strategy).
2. 📄 **Tailored ATS Resume (Markdown)** (Strictly structured based on public/documents/resume.docx format, customized specifically to highlight matching technologies and projects for this job).
3. 💡 **Interview & Cover Letter Talking Points** (3-4 high-impact talking points for Dareean).

Target Language: Strictly in ${langName}.`;

      userPrompt = `TARGET JOB VACANCY / DESCRIPTION:\n"""${jobDescription}"""\n\nCANDIDATE PORTFOLIO & RESUME CONTEXT:\n${profileContext}`;
    } else if (action === "analyze_portfolio") {
      systemPrompt = `You are a Senior Principal Engineer and Portfolio Reviewer.
Analyze the candidate's portfolio content and provide actionable, high-value improvements in ${langName}.

Provide:
1. 🔥 **Headline & Bio Polish** (3 alternative punchy headlines and refined bio variations).
2. 🚀 **Project Bullet Improvements** (Rewrite 3 project descriptions with stronger metrics & STAR format).
3. 📊 **Skill Gap & Modernization Recommendations** (What emerging 2026 technologies to add).

Language Requirement: Strictly output in ${langName}.`;

      userPrompt = `Review and optimize the following portfolio content:\n${profileContext}`;
    } else if (action === "translate") {
      systemPrompt = `You are a professional Technical Document Translator and Resume Localization Expert.
Translate the following CV / document into flawless, native, and professional ${langName}.
Preserve Markdown formatting, technical terms, dates, and structure exactly.`;

      userPrompt = `Please translate the following text into professional ${langName}:\n\n"""${contentToTranslate}"""`;
    }

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
            temperature: 0.3,
            max_tokens: 3500,
          }),
        });

        if (res.ok) {
          groqResponse = res;
          break;
        } else {
          lastError = await res.text();
        }
      } catch (e) {
        console.warn(`Groq fetch error for ${modelName}:`, e);
      }
    }

    if (!groqResponse || !groqResponse.ok) {
      console.error("Groq API Error:", lastError);
      return NextResponse.json(
        { error: `Groq API error: ${lastError}` },
        { status: 500 }
      );
    }

    const groqJson = await groqResponse.json();
    const result = groqJson.choices?.[0]?.message?.content || "No output generated.";
    const usage = groqJson.usage || {};

    return NextResponse.json({
      success: true,
      result,
      modelUsed: groqJson.model || "Groq GPT-OSS 120B",
      usage,
    });
  } catch (error) {
    console.error("Error in AI Route:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal AI processing error" },
      { status: 500 }
    );
  }
}
