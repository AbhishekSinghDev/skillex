import {
  courseCategoryEnum,
  courseLevelEnum,
  statusEnum,
} from "@/server/db/schema";
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

export const CourseCreationSchema = z4.object({
  title: z4
    .string()
    .min(2, "Title must be at least 2 characters long")
    .max(100, "Title must be at most 100 characters long"),
  description: z4
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description must be at most 1000 characters long"),
  smallDescription: z4
    .string()
    .min(10, "Small description must be at least 10 characters long")
    .max(200, "Small description must be at most 200 characters long"),
  fileKey: z4.string().nonempty("File key is required"),
  duration: z4.coerce
    .number()
    .min(1, "Duration must be at least 1 minute")
    .max(1440, "Duration must be at most 1440 minutes (24 hours)")
    .nonnegative(),
  price: z4.coerce.number().min(0, "Price must be at least 0").nonnegative(),
  level: z4.enum(courseLevelEnum.enumValues, "Invalid course level"),
  category: z4.enum(courseCategoryEnum.enumValues, "Invalid course category"),
  status: z4.enum(statusEnum.enumValues, "Invalid course status"),
});

export const FileUploadSchema = z4.object({
  fileName: z4.string().min(1, "File name is required"),
  contentType: z4.string().min(1, "Content type is required"),
  fileSize: z4.coerce
    .number()
    .min(0, "File size must be at least 0")
    .nonnegative(),
  isImage: z4.boolean(),
});
