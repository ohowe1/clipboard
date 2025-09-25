import { Hono } from "hono";
import { LockUnlockForm, PasteTextForm, PasteURLForm, PasteFileForm } from "./form_types";
import {
  ClipboardItem,
  ContentType,
  FileContent,
  TextContent,
  URLContent,
} from "./models/ClipboardItem";
import { logger } from "hono/logger";
import { basicAuth } from "hono/basic-auth";
import LockPage from "./pages/LockPage";
import LockedPage from "./pages/LockedPage";
import PastePage from "./pages/PastePage";
import z from "zod";
import { validator } from "hono/validator";
import EmptyClipboardPage from "./pages/EmptyClipboardPage";

const app = new Hono<{ Bindings: CloudflareBindings }>();

async function getUnlockedUntil(kv: KVNamespace) {
  return parseInt((await kv.get("unlockUntil")) ?? "0");
}

async function isLocked(kv: KVNamespace) {
  return Date.now() > (await getUnlockedUntil(kv));
}

async function getStoredItem(kv: KVNamespace) {
  const item = await kv.get("reg0");
  if (!item) {
    return null;
  }

  const parsed = ClipboardItem.safeParse(JSON.parse(item));
  if (!parsed.success) {
    return null;
  }

  return parsed.data;
}

function validateZod<T extends z.ZodTypeAny>(zodObject: T) {
  return validator('form', (value, c): z.infer<T> | Response => {
    const parsed = zodObject.safeParse(value);

    if (!parsed.success) {
      return c.text('Invalid form!', 401);
    }

    return parsed.data;
  });
}

app.use(logger());
app.use(
  "/secure/*",
  basicAuth({
    verifyUser(username, password, c) {
      console.log('sad:')
      return username === c.env.USERNAME && password === c.env.PASSWORD;
    },
  })
);

app.use("/paste/*", async (c, next) => {
  if (await isLocked(c.env.KV)) {
    return c.html(LockedPage());
  }
  await next();
});

app.get("/secure/lock", async (c) => {
  const unlockedUntil = await getUnlockedUntil(c.env.KV);
  const currentTime = Date.now();

  return c.html(LockPage({ unlockedUntil, currentTime }));
});

app.post("/secure/lock", validateZod(LockUnlockForm), async (c) => {
  const form = c.req.valid('form');
  
  console.log(form)

  if (!form.unlock) {
    await c.env.KV.put("unlockUntil", "0");
    return c.redirect("/secure/lock");
  }

  const minutes = form.duration && form.duration > 0 ? form.duration : 5;
  const unlockUntil = Date.now() + minutes * 60 * 1000;
  await c.env.KV.put("unlockUntil", String(unlockUntil));
  return c.redirect("/secure/lock");
});

app.get("/paste", async (c) => {
  return c.html(PastePage());
});

app.post("/paste/remove", async (c) => {
  await c.env.KV.delete("reg0");

  return c.redirect('/paste')
});

app.post("/paste/text", validateZod(PasteTextForm), async (c) => {
  const form = c.req.valid('form');

  const clipboardItem: ClipboardItem = {
    content: {
      type: ContentType.TEXT,
      text: form.text
    }
  };

  await c.env.KV.put("reg0", JSON.stringify(clipboardItem));

  return c.redirect('/paste')
});

app.post("/paste/url", validateZod(PasteURLForm), async (c) => {
  const form = c.req.valid('form');

  const clipboardItem: ClipboardItem = {
    content: {
      type: ContentType.URL,
      url: form.url
    }
  };

  await c.env.KV.put("reg0", JSON.stringify(clipboardItem));

  return c.redirect('/paste')
});

app.post("/paste/file", validateZod(PasteFileForm), async (c) => {
  const form = c.req.valid('form');

  const file = form.file as File | undefined;
  if (!file) {
    return c.text("No file uploaded", 400);
  }

  const key = "reg0";

  const data = await file.arrayBuffer();

  await c.env.R2.put(key, data, {
    httpMetadata: {
      contentType: file.type,
    },
  });

  const clipboardItem: ClipboardItem = {
    content: {
      type: ContentType.FILE,
      bucket_key: key,
      file_name: file.name,
    },
  };

  await c.env.KV.put("reg0", JSON.stringify(clipboardItem));

  return c.redirect('/paste')
});

app.get("/", async (c) => {
  const item = await getStoredItem(c.env.KV);
  if (!item) {
    return c.html(EmptyClipboardPage());
  }

  switch (item.content.type) {
    case ContentType.FILE: {
      const fileContent = item.content as FileContent;

      const key = fileContent.bucket_key;
      const object = await c.env.R2.get(key);
      if (!object) {
        return c.text("File not found", 404);
      }

      const filename = fileContent.file_name;

      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set("Content-Disposition", `attachment; filename="${encodeURIComponent(filename)}"`);

      return new Response(object.body, { status: 200, headers });
    }
    case ContentType.TEXT: {
      const textContent = item.content as TextContent;

      return c.text(textContent.text);
    }
    case ContentType.URL: {
      const urlContent = item.content as URLContent;

      return c.redirect(urlContent.url);
    }
  }

  console.error("Unknown content type:", item.content);
  return c.json({ success: false, error: "Unknown content type" }, 500);
});

export default app;
