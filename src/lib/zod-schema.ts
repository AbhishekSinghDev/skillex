import z4 from "zod/v4";

export const LoginSchema = z4.object({
  email: z4.email("Invalid email address"),
});

export const OTPVerificationSchema = z4.object({
  otp: z4
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
