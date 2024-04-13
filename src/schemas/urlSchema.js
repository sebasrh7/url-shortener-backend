import { z } from "zod";

export const urlSchema = z.object({
  originalUrl: z.string().regex(/^(ftp|http|https):\/\/[^ "]+$/, {
    message: "Invalid URL format",
  }),
});
