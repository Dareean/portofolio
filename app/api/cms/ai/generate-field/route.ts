import { NextResponse } from "next/server";
import { isServerAuthenticated } from "@/lib/auth";

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
      action = "generate_description",
      fieldType = "general",
      currentValue = "",
      context = {},
      language = "id",
    }: {
      action:
        | "generate_description"
        | "generate_caption"
        | "generate_title"
        | "generate_article"
        | "generate_tags"
        | "expand"
        | "polish"
        | "translate";
      fieldType:
        | "project_description"
        | "project_title"
        | "article_title"
        | "article_caption"
        | "article_content"
        | "article_tags"
        | "experience_description"
        | "experience_tags"
        | "bio"
        | "general";
      currentValue?: string;
      context?: {
        title?: string;
        category?: string;
        technologies?: string[] | string;
        role?: string;
        organization?: string;
        year?: string | number;
        description?: string;
        excerpt?: string;
        content?: string;
        tags?: string[] | string;
        [key: string]: any;
      };
      language?: "id" | "en";
    } = body;

    const langName = language === "en" ? "English" : "Bahasa Indonesia";

    let systemPrompt = `You are an elite Copilot AI Content Creator & Executive Copywriter for software engineer portfolios and personal tech blogs.
Your job is to generate concise, compelling, high-impact text in ${langName}.
Keep industry standard technical terms in English (e.g. Full Stack, Next.js, UI/UX, REST API, Database, Dashboard).`;

    let userPrompt = "";

    if (action === "generate_article" || (action === "generate_description" && fieldType === "article_content")) {
      systemPrompt += `\nTask: Write an engaging, well-structured personal narrative and tech article in Markdown format in ${langName}.
Structure the story cleanly with:
- An engaging opening paragraph setting the context and background.
- 2-3 narrative sections highlighting key milestones, technical solutions, and cross-team collaboration. Use subheadings (###).
- A structured '### Pembelajaran Utama' (or '### Key Takeaways' in English) section with numbered insights.
- A motivating closing sentence.
Do NOT add conversational preamble, meta text, or wrapper quotes—return ONLY the markdown article body.`;
      userPrompt = `Article Context:
- Topic / Title: ${context.title || "Refleksi & Pengalaman"}
- Category: ${context.category || "General"}
- Excerpt / Summary: ${context.excerpt || ""}
- Tags: ${Array.isArray(context.tags) ? context.tags.join(", ") : context.tags || ""}
${currentValue ? `- Current Draft / Notes:\n"""${currentValue}"""` : ""}

Generate the full markdown story in ${langName}.`;
    } else if (action === "expand") {
      systemPrompt += `\nTask: Expand and enrich the existing article draft in Markdown format in ${langName}. Add deeper storytelling, specific challenges overcome, metrics/impact (e.g. percentages or milestones), and structured key takeaways. Return ONLY the expanded markdown content without preamble or wrapper quotes.`;
      userPrompt = `Article Context:
- Title: ${context.title || ""}
- Category: ${context.category || ""}
- Current Draft to Expand:
"""${currentValue || context.excerpt || ""}"""

Expand this draft into a rich, structured story with headings and key learnings.`;
    } else if (action === "generate_tags" || fieldType === "article_tags" || fieldType === "experience_tags") {
      systemPrompt += `\nTask: Generate 3 to 6 concise, highly relevant professional skills, technologies, or key highlight tags separated by commas (e.g. "Customer Support, B2B Sales, Telecommunication, Data Analysis, Leadership").
Return ONLY the comma-separated tag list. Do NOT include hashtags (#), bullets, wrapper quotes, or numbering.`;
      userPrompt = `Content Context:
- Role / Subject: ${context.role || context.title || "Experience"}
- Organization / Company: ${context.organization || ""}
- Category: ${context.category || ""}
- Description / Responsibilities: ${context.description || currentValue || context.excerpt || ""}
${currentValue ? `- Current Tags: "${currentValue}"` : ""}

Generate 3-6 relevant, professional comma-separated tags and skills.`;
    } else if (action === "generate_description") {
      const subjectTitle =
        context.title ||
        (context.role
          ? `${context.role} di ${context.organization || "Perusahaan/Organisasi"}`
          : "Pengalaman Kerja / Proyek");
      const roleOrg = context.role
        ? `${context.role} @ ${context.organization || ""}`
        : context.organization || "";

      systemPrompt += `\nTask: Write a high-impact, executive professional description highlighting key responsibilities, achievements, and technical impact. Do NOT add preamble or wrapper quotes—return ONLY the final raw text.`;
      userPrompt = `Field Context:
- Target Field Type: ${fieldType}
- Role / Position: ${context.role || subjectTitle}
- Organization / Company: ${context.organization || "N/A"}
- Display Title / Subject: ${context.title || subjectTitle}
- Category: ${context.category || "General"}
- Tech Stack / Skills: ${Array.isArray(context.technologies) ? context.technologies.join(", ") : context.technologies || ""}
${
  currentValue
    ? `- Current Draft / User Notes: "${currentValue}"`
    : `- Note: The description field is currently empty. Generate a detailed, professional description and key responsibilities for the role "${context.role || subjectTitle}" at "${context.organization || "Perusahaan/Organisasi"}" in ${langName}.`
}

Generate a high-impact professional description (2-4 concise sentences or bullet points highlighting key responsibilities, workflows, and achievements) in ${langName}.`;
    } else if (action === "generate_caption") {
      systemPrompt += `\nTask: Write a crisp, catchy 1-2 sentence caption or summary (max 25-35 words). Perfect for card excerpts or feed preview captions. Do NOT add preamble or quotes—return ONLY the raw caption text.`;
      userPrompt = `Field Context:
- Target Field Type: ${fieldType}
- Title: ${context.title || "Project/Article"}
- Category: ${context.category || ""}
- Content / Full Story: ${context.content || currentValue || ""}
${currentValue && !context.content ? `- Draft notes: "${currentValue}"` : ""}

Write a punchy, engaging 1-2 sentence excerpt/caption in ${langName}.`;
    } else if (action === "generate_title") {
      systemPrompt += `\nTask: Create 3 punchy, professional, and memorable title options for a project or article. Do NOT add conversational fluff—return ONLY 3 options separated by newlines, formatted like:
Option 1: [Title 1]
Option 2: [Title 2]
Option 3: [Title 3]`;
      userPrompt = `Field Context:
- Category: ${context.category || "Engineering"}
- Content Context: ${context.content || context.excerpt || context.description || ""}
${currentValue ? `- Current Title or Notes: "${currentValue}"` : ""}

Generate 3 high-impact title options in ${langName}.`;
    } else if (action === "polish") {
      systemPrompt += `\nTask: Refine and polish the user's draft text. Fix typos, enhance vocabulary, make active action verbs stronger, and preserve Markdown formatting if present. Return ONLY the polished text without quotes or preamble.`;
      userPrompt = `Text to polish into executive ${langName}:
"""${currentValue || context.title || ""}"""`;
    } else if (action === "translate") {
      const targetLang = language === "en" ? "English" : "Bahasa Indonesia";
      systemPrompt += `\nTask: Translate the input text into professional ${targetLang}. Preserve technical terms and Markdown formatting. Return ONLY the translated text.`;
      userPrompt = `Text to translate:
"""${currentValue}"""`;
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
            temperature: 0.4,
            max_tokens: action === "generate_article" || action === "expand" ? 1500 : 800,
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
      console.error("Groq API Field Error:", lastError);
      return NextResponse.json(
        { error: `AI Service Error: ${lastError}` },
        { status: 500 }
      );
    }

    const groqJson = await groqResponse.json();
    let result = groqJson.choices?.[0]?.message?.content?.trim() || "";

    // Clean wrapping quotes if present
    if (result.startsWith('"') && result.endsWith('"')) {
      result = result.slice(1, -1);
    }

    return NextResponse.json({
      success: true,
      result,
      action,
    });
  } catch (error) {
    console.error("Error in AI Field Generation:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal AI processing error" },
      { status: 500 }
    );
  }
}
