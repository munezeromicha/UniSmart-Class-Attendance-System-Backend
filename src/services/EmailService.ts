import nodemailer from 'nodemailer';
import { UserRole } from '../models/User';

class EmailService {
  private static transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    tls: {
      rejectUnauthorized: false 
  }
  });

  static async sendInvitation(
    email: string, 
    role: UserRole, 
    token: string, 
    details: { school?: string; department?: string; class?: string }
  ) {
    try {

      let roleDetails = '';
      switch(role) {
        case UserRole.HOD:
          roleDetails = `
            <tr>
              <td style="padding: 10px;"><strong>School:</strong></td>
              <td style="padding: 10px;">${details.school || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px;"><strong>Department:</strong></td>
              <td style="padding: 10px;">${details.department || 'N/A'}</td>
            </tr>
          `;
          break;
        case UserRole.LECTURER:
          roleDetails = `
            <tr>
              <td style="padding: 10px;"><strong>Department:</strong></td>
              <td style="padding: 10px;">${details.department || 'N/A'}</td>
            </tr>
          `;
          break;
        case UserRole.CLASS_REP:
        case UserRole.STUDENT:
          roleDetails = `
            <tr>
              <td style="padding: 10px;"><strong>Department:</strong></td>
              <td style="padding: 10px;">${details.department || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 10px;"><strong>Class:</strong></td>
              <td style="padding: 10px;">${details.class || 'N/A'}</td>
            </tr>
          `;
          break;
      }

      const mailOptions = {
        from: `"UniSmart Admin" <${process.env.SMTP_USER}>`,
        to: email,
        subject: `UniSmart - Invitation to Join as ${role}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Welcome to UniSmart Class attendance</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; line-height: 1.6;">
              <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <!-- Header -->
                <div style="background-color: #003366; padding: 20px; text-align: center; border-radius: 5px 5px 0 0;">
                  <h1 style="color: #ffffff; margin: 0;">Welcome to UniSmart Class attendance</h1>
                </div>
                
                <!-- Main Content -->
                <div style="background-color: #ffffff; padding: 20px; border-left: 1px solid #ddd; border-right: 1px solid #ddd;">
                  <p style="margin-bottom: 20px;">Dear Future Team Member,</p>
                  
                  <p style="margin-bottom: 20px;">
                    You have been invited to join UniSmart as a <strong>${role}</strong>. We're excited to have you on board!
                  </p>

                  <!-- Role Details Table -->
                  <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #f9f9f9; border-radius: 5px;">
                    ${roleDetails}
                  </table>

                  <!-- Registration Token -->
                  <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center;">
                    <p style="margin: 0; font-weight: bold;">Your Registration Token:</p>
                    <h2 style="color: #003366; margin: 10px 0; letter-spacing: 2px;">${token}</h2>
                  </div>

                  <!-- Call to Action Button -->
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL}/register?token=${token}" 
                       style="background-color: #003366; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                      Complete Registration
                    </a>
                  </div>

                  <p style="color: #666666; font-size: 14px;">
                    Please note: This invitation will expire in 24 hours for security purposes.
                  </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; color: #666666;">
                  <p style="margin: 0;">This is an automated message from UniSmart. Please do not reply to this email.</p>
                  <p style="margin: 5px 0 0 0;">If you received this invitation by mistake, please ignore it.</p>
                </div>
              </div>
            </body>
          </html>
        `
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send invitation email');
    }
  }
}

export default EmailService;