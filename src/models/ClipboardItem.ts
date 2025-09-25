import z from "zod";

export const ContentType = {
  FILE: "file",
  TEXT: "text",
  URL: "url",
} as const

export const FileContent = z.object({
  type: z.enum([ContentType.FILE]),
  bucket_key: z.string(),
  file_name: z.string(),
});
export type FileContent = z.infer<typeof FileContent>;

export const TextContent = z.object({
  type: z.enum([ContentType.TEXT]),
  text: z.string(),
});
export type TextContent = z.infer<typeof TextContent>;

export const URLContent = z.object({
  type: z.enum([ContentType.URL]),
  url: z.url(),
});
export type URLContent = z.infer<typeof URLContent>;

export const ClipboardContent = z.discriminatedUnion("type", [
  FileContent,
  TextContent,
  URLContent,
]);
export type ClipboardContent = z.infer<typeof ClipboardContent>;

export const ClipboardItem = z.object({
  content: ClipboardContent,
});
export type ClipboardItem = z.infer<typeof ClipboardItem>;
