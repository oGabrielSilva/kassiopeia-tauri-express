import nodemailer from 'nodemailer';

export class EmailService {
  private static instance: EmailService;

  private readonly transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  private constructor() {}

  public async send(
    to: string,
    subject: string,
    { html, text }: { html: string; text: string },
    from: string = 'noreply@kassiopeia.dev'
  ) {
    const info = await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });

    return info;
  }

  public static get service() {
    if (!EmailService.instance) EmailService.instance = new EmailService();

    return EmailService.instance;
  }
}
