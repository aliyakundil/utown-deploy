import type { RegisterDto, LoginDto, VerifyCodeDto, ForgotPasswordDto, ResetPasswordDto, ChangePasswordDto } from "./auth.types.js";

const phoneRegex = /^\+?[0-9]{10,15}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;

export function validateRegister(data: RegisterDto) {
  const name = data.name?.trim();
  const phone = data.phone?.trim();
  const password = data.password?.trim();

  if (!phone) {
    throw new Error("Phone is required");
  }
  
  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number format");
  }
  
  if (!password) {
    throw new Error("Password is required")
  }
  
  if (!passwordRegex.test(password)) {
    throw new Error(
      "Password must contain at least 9 characters, one uppercase letter and one digit"
    );
  }

  return { name, phone, password };
}

export function validateLogin(data: LoginDto) {
  const phone = data.phone?.trim();
  const password = data.password?.trim();

  if (!phone) {
    throw new Error("Phone is required");
  }

  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number format");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  return { phone, password };
}

export function validateVerificationCode(
  data: VerifyCodeDto
) {
  const phone = data.phone?.trim();
  const code = data.code?.trim();

  if (!phone) {
    throw new Error("Phone is required");
  }

  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number format");
  }

  if (!code) {
    throw new Error("Verification code is required");
  }

  if (!/^\d{4}$/.test(code)) {
    throw new Error("Invalid verification code");
  }

  return {
    phone,
    code,
  };
}

export function validateForgotPassword(data: ForgotPasswordDto) {
  const phone = data.phone?.trim();

  if (!phone) {
    throw new Error("Phone is required");
  }

  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number format");
  }

  return { phone };
}

export function validateResetPassword(data: ResetPasswordDto) {
  const phone = data.phone?.trim();
  const code = data.code?.trim();
  const newPassword = data.newPassword?.trim();

  if (!phone) {
    throw new Error("Phone is required");
  }

  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number format");
  }

  if (!code) {
    throw new Error("Verification code is required");
  }

  if (!/^\d{4}$/.test(code)) {
    throw new Error("Invalid verification code");
  }

  if (!newPassword) {
    throw new Error("Password is required");
  }

  if (!passwordRegex.test(newPassword)) {
    throw new Error(
      "Password must contain at least 9 characters, one uppercase letter and one digit"
    );
  }

  return { phone, code, newPassword };
}

export function validateChangePassword(data: ChangePasswordDto) {
  const newPassword = data.newPassword?.trim();

  if (!newPassword) {
    throw new Error("Password is required");
  }

  if (!passwordRegex.test(newPassword)) {
    throw new Error(
      "Password must contain at least 9 characters, one uppercase letter and one digit"
    );
  }

  return { newPassword };
}
