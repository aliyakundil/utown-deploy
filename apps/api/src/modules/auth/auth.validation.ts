import type { RegisterDto, LoginDto } from "./auth.types.js";

export function validateRegister(data: RegisterDto) {
  const name = data.name.trim();
  const phone = data.phone.trim();
  const password = data.password?.trim();
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{9,}$/;
  
  if (!name) {
    throw new Error("Name is required");
  }
  
  if (name.length < 2) {
    throw new Error("Name must contain at least 2 characters");
  }
  
  if (!phone) {
    throw new Error("Phone is required");
  }
  
  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number format");
  }
  
  if (!data.password?.trim()) {
    throw new Error("Password is required")
  }
  
  if (!passwordRegex.test(data.password)) {
    throw new Error(
      "Password must contain at least 9 characters, one uppercase letter and one digit"
    );
  }

  return { name, phone, password };
}

export function validateLogin(data: LoginDto) {
  const phone = data.phone.trim();
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  const password = data.password?.trim();
  
  if (!phone) {
    throw new Error("Invalid phone number")
  }

  if (!phoneRegex.test(phone)) {
    throw new Error("Invalid phone number format");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  return { phone, password };
}