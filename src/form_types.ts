import z from "zod";

export const LoginForm = z.object({
  username: z.string(),
  password: z.string(),
});
export type LoginForm = z.infer<typeof LoginForm>;

export const PastePageForm = z.object({
  register: z.string().min(1),
});
export type PastePageForm = z.infer<typeof PastePageForm>;

export const PasteTextForm = z.object({
  text: z.string()
});
export type PasteTextForm = z.infer<typeof PasteTextForm>;

export const PasteURLForm = z.object({
  url: z.url()
});
export type PasteURLForm = z.infer<typeof PasteURLForm>;

export const PasteFileForm = z.object({
  file: z.instanceof(File)
});
export type PasteFileForm = z.infer<typeof PasteFileForm>;

export const LockUnlockForm = z.object({
  unlock: z.stringbool(),
  duration: z.coerce.number().min(1).optional(), // in minutes
});
export type LockUnlockForm = z.infer<typeof LockUnlockForm>;
