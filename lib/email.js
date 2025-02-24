import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: process.env.EMAIL_SERVER_PORT,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export async function sendVerificationEmail(to, token) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Verify your email",
    html: `
      <h1>Verify your email</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
    `,
  })
}

export async function sendPasswordResetEmail(to, token) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: "Reset your password",
    html: `
      <h1>Reset your password</h1>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 1 hour.</p>
    `,
  })
}

export async function sendInvitationEmail(to, tenantName, tenantCode, role) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: `Invitation to join ${tenantName}`,
    html: `
      <h1>You've been invited to join ${tenantName}</h1>
      <p>You have been invited to join ${tenantName} as a ${role}.</p>
      <p>To accept this invitation, please use the following tenant code when joining:</p>
      <h2>${tenantCode}</h2>
      <p>You can enter this code in the "Join Tenant" section of your dashboard.</p>
    `,
  })
}

