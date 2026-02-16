import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Subject line mapping
    const subjectMap: Record<string, string> = {
      collaboration: "Project Collaboration",
      freelance: "Freelance Work",
      job: "Job Opportunity",
      general: "General Inquiry",
      other: "Other",
    };

    const emailSubject = `[Portfolio Contact] ${subjectMap[subject] || subject} - from ${name}`;

    // Send email
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL || "dmardin@gmail.com",
      replyTo: email,
      subject: emailSubject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Message</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
          <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb;">
            <tr>
              <td align="center" style="padding: 40px 20px;">
                <!-- Main Container -->
                <table role="presentation" style="width: 100%; max-width: 600px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07); overflow: hidden;">
                  
                  <!-- Header with Logo -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 32px 40px;">
                      <table role="presentation" style="width: 100%; border-collapse: collapse;">
                        <tr>
                          <td style="width: 60px; vertical-align: middle;">
                            <!-- Text-based Logo (Email-safe) -->
                            <table role="presentation" style="width: 48px; height: 48px; background: linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%); border-radius: 12px; box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);">
                              <tr>
                                <td align="center" style="vertical-align: middle; padding: 0;">
                                  <span style="color: #1a1a1a; font-size: 26px; font-weight: 700; font-family: Georgia, 'Times New Roman', serif; line-height: 1; display: block;">D</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td align="right" style="vertical-align: middle;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 600; letter-spacing: -0.5px;">New Message</h1>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Content -->
                  <tr>
                    <td style="padding: 40px;">
                      <!-- Greeting -->
                      <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.6;">
                        Dear Dareean,
                      </p>
                      <p style="margin: 0 0 32px 0; color: #6b7280; font-size: 15px; line-height: 1.6;">
                        You have received a new message from your portfolio contact form:
                      </p>

                      <!-- Sender Info Card -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9fafb; border-radius: 12px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 24px;">
                            <table role="presentation" style="width: 100%;">
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <span style="display: block; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">From</span>
                                  <span style="display: block; color: #1f2937; font-size: 16px; font-weight: 600;">${name}</span>
                                </td>
                              </tr>
                              <tr>
                                <td style="padding-bottom: 12px;">
                                  <span style="display: block; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Email</span>
                                  <a href="mailto:${email}" style="display: block; color: #3b82f6; font-size: 15px; text-decoration: none;">${email}</a>
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  <span style="display: block; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Subject</span>
                                  <span style="display: inline-block; background-color: #dbeafe; color: #1e40af; padding: 6px 12px; border-radius: 6px; font-size: 13px; font-weight: 500;">${subjectMap[subject] || subject}</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Message Card -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff; border: 2px solid #e5e7eb; border-radius: 12px; margin-bottom: 24px;">
                        <tr>
                          <td style="padding: 24px; border-left: 4px solid #3b82f6;">
                            <span style="display: block; color: #9ca3af; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;">Message</span>
                            <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
                          </td>
                        </tr>
                      </table>

                      <!-- Reply Button -->
                      <table role="presentation" style="width: 100%; margin-bottom: 24px;">
                        <tr>
                          <td align="center">
                            <a href="mailto:${email}?subject=Re: ${encodeURIComponent(subjectMap[subject] || subject)}" 
                               style="display: inline-block; background-color: #1a1a1a; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">
                              Reply to ${name}
                            </a>
                          </td>
                        </tr>
                      </table>

                      <!-- Closing -->
                      <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                        Best regards,<br/>
                        <strong style="color: #374151;">Your Portfolio System</strong>
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color: #f9fafb; padding: 24px 40px; border-top: 1px solid #e5e7eb;">
                      <table role="presentation" style="width: 100%;">
                        <tr>
                          <td align="center">
                            <p style="margin: 0 0 8px 0; color: #9ca3af; font-size: 12px;">
                              This message was sent from your portfolio contact form
                            </p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                              © ${new Date().getFullYear()} Dareean Portfolio. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
