import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(
  email: string,
  code: string
) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "UTOWN password reset code",
    text: `Your password reset code is ${code}. It expires in 5 minutes.`,
    html: `<p>Your password reset code is <strong>${code}</strong>.</p><p>It expires in 5 minutes.</p>`,
  });
}