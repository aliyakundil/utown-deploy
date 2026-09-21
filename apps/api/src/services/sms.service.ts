export function sendVerificationCode(
  phone: string,
  code: string
) {
  console.log(`
=========================================
📨 SMS SENT

Phone:
${phone}

Verification code:
${code}

Expires in 5 minutes
=========================================
`);
}