import { ClipboardContent, ClipboardItem } from "./models/ClipboardItem";

export async function getUnlockedUntil(kv: KVNamespace) {
  return parseInt((await kv.get("unlockUntil")) ?? "0");
}

export async function isLocked(kv: KVNamespace) {
  return Date.now() > (await getUnlockedUntil(kv));
}

export async function getStoredItem(register: string, kv: KVNamespace) {
  const item = await kv.get(`reg${register}`);
  if (!item) {
    return null;
  }

  const parsed = ClipboardItem.safeParse(JSON.parse(item));
  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

export async function storeContent(register: string, content: ClipboardContent, kv: KVNamespace) {
  const existingItem = await getStoredItem(register, kv);

  const newItem: ClipboardItem = {
    content,
    history: existingItem ? [existingItem.content, ...(existingItem.history ?? [])] : [],
  };

  await kv.put(`reg${register}`, JSON.stringify(newItem));
}

export async function removeStoredItem(register: string, kv: KVNamespace, r2: R2Bucket) {
  const existingItem = await getStoredItem(register, kv);

  const allContent = existingItem ? [existingItem.content, ...(existingItem.history ?? [])] : [];

  for (const content of allContent) {
    if (content.type === "file") {
      await r2.delete(content.bucket_key);
    }
  }

  await kv.delete(`reg${register}`);
}

export async function getAllRegisters(kv: KVNamespace) {
  const list = await kv.list({ prefix: "reg" });

  const registers: string[] = [];
  for (const key of list.keys) {
    const register = key.name.substring(3); // remove "reg" prefix
    registers.push(register);
  }

  return registers;
}