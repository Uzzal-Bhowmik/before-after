import { z } from "zod";

export const customerProfileSchema = z.object({
  name: z.string().optional(),
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Invalid email address" }),
  phoneNumber: z.string().optional(),
});

// Create service post
export const customerCreatePostSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(1, { message: "Title is required" }),
  category: z.string({ required_error: "Category is required" }),
  subcategory: z.string({ required_error: "Subcategory is required" }),
  isFree: z.preprocess(
    (val) => (val === "free" ? true : false),
    z.boolean({ required_error: "Service cost type is required" }),
  ),
  description: z
    .string({ required_error: "Description is required" })
    .min(100, { message: "Description must be at least 100 characters long" }),
  images: z.union([
    z.array(z.instanceof(File)).optional(),
    z
      .array(
        z.object({
          url: z.string().url("Invalid URL format"),
        }),
      )
      .optional(),
  ]),
  consultationType: z.string({
    required_error: "Service cost type is required",
  }),
});

// create transformation post
export const shareTransformationSchema = z.object({
  category: z.string({ required_error: "Category is required" }),
  subcategory: z.string({ required_error: "Subcategory is required" }),
  serviceProvider: z
    .string({ required_error: "Service provider is required" })
    .min(1, { message: "Service provider is required" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(100, { message: "Description must be at least 100 characters long" }),
  summary: z
    .string({ required_error: "Summary/Title is required" })
    .min(1, { message: "Summary/Title is required" }),
  beforeStory: z.array(z.instanceof(File), {
    message: "Before transformation image is required!",
  }),
  afterStory: z.array(z.instanceof(File), {
    message: "After transformation image is required!",
  }),
});

// edit transformation post
export const editTransformationSchema = z.object({
  category: z.string({ required_error: "Category is required" }),
  subcategory: z.string({ required_error: "Subcategory is required" }),
  description: z
    .string({ required_error: "Description is required" })
    .min(100, { message: "Description must be at least 100 characters long" }),
  summary: z
    .string({ required_error: "Summary/Title is required" })
    .min(1, { message: "Summary/Title is required" }),
  beforeStory: z.array(z.object({ url: z.string().url("Invalid URL format") })),

  afterStory: z.array(z.object({ url: z.string().url("Invalid URL format") })),
});
