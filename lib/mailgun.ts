import formData from 'form-data';
import Mailgun from 'mailgun.js';

const mailgun = new Mailgun(formData);

const getMailgunClient = () => {
  const apiKey = process.env.MAILGUN_API_KEY;
  const domain = process.env.MAILGUN_DOMAIN;

  if (!apiKey || !domain) {
    throw new Error('MAILGUN_API_KEY and MAILGUN_DOMAIN must be set in environment variables');
  }

  return mailgun.client({
    username: 'api',
    key: apiKey,
  });
};

export const sendEmail = async (to: string, subject: string, html: string) => {
  try {
    const client = getMailgunClient();
    const domain = process.env.MAILGUN_DOMAIN!;
    
    const response = await client.messages.create(domain, {
      from: process.env.MAILGUN_FROM_EMAIL || 'noreply@truck-monitor.com',
      to: [to],
      subject,
      html,
    });

    return { success: true, messageId: response.id };
  } catch (error) {
    console.error('Mailgun error:', error);
    throw new Error('Failed to send email');
  }
};
