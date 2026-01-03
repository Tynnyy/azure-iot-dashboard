import { z } from "zod";

export const registerSensorSchema = z.object({
  sensorName: z.string()
    .min(3, "Sensor name must be at least 3 characters")
    .max(255, "Sensor name must be less than 255 characters"),
  sensorType: z.string()
    .min(3, "Sensor type must be at least 3 characters"),
  locationName: z.string()
    .min(2, "Location name must be at least 2 characters"),
});

export const submitDataSchema = z.object({
  value: z.number()
    .finite("Value must be a finite number")
    .or(z.string().transform((val) => parseFloat(val))),
});

export const loginSchema = z.object({
  email: z.string()
    .email("Invalid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
});

export const signupSchema = z.object({
  email: z.string()
    .email("Invalid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
