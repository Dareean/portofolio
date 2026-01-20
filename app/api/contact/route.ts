import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Subject line mapping
    const subjectMap: Record<string, string> = {
      collaboration: 'Project Collaboration',
      freelance: 'Freelance Work',
      job: 'Job Opportunity',
      general: 'General Inquiry',
      other: 'Other',
    };

    const emailSubject = `[Portfolio Contact] ${subjectMap[subject] || subject} - from ${name}`;

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL || 'dmardin@gmail.com',
      replyTo: email,
      subject: emailSubject,
      html: `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1a1a1a; margin-bottom: 24px;">New Contact Form Submission</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <p style="margin: 0 0 12px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 0 0 12px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 0;"><strong>Subject:</strong> ${subjectMap[subject] || subject}</p>
          </div>
          
          <div style="background: #fafafa; padding: 20px; border-radius: 12px; border-left: 4px solid #3b82f6;">
            <h3 style="margin: 0 0 12px 0; color: #374151;">Message:</h3>
            <p style="margin: 0; color: #4b5563; white-space: pre-wrap;">${message}</p>
          </div>
          
          <p style="margin-top: 24px; font-size: 14px; color: #9ca3af;">
            This message was sent from your portfolio contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
