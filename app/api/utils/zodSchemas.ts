import { conformZodMessage } from "@conform-to/zod";
import { z } from "zod";

export const siteSchema = z.object({
  name: z.string().min(5).max(35),
  subdirectory: z.string().min(5).max(50),
  description: z.string().min(5).max(200),
});

export const postSchema = z.object({
  title: z.string().min(5).max(80),
  slug: z.string().min(5).max(200),
  smallDescription: z.string().min(20).max(200),
  image: z.string().min(1),
  articleContent: z.string().min(20),
});

export function siteValidationSchema(options?: {
  isSubdirectoryUnique: () => Promise<boolean>;
}) {
  return z.object({
    name: z.string().min(5).max(35),
    subdirectory: z
      .string()
      .min(5)
      .max(50)
      .regex(
        /^[a-z0-9-]+$/,
        "Subdirectory can only contain lowercase letters, numbers and dashes"
      )
      .transform((value) => value.toLowerCase())
      .pipe(
        z.string().superRefine((email, ctx) => {
          if (typeof options?.isSubdirectoryUnique !== "function") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: conformZodMessage.VALIDATION_UNDEFINED,
              fatal: true,
            });
            return;
          }
          return options?.isSubdirectoryUnique().then((isUnique) => {
            if (!isUnique) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message:
                  "Subdirectory already exists. Please use an unique subdirectory.",
                fatal: true,
              });
            }
          });
        })
      ),
    description: z.string().min(5).max(200),
  });
}
