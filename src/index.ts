import { Context, Hono } from "hono";
import {
  LockUnlockForm,
  PasteTextForm,
  PasteURLForm,
  PasteFileForm,
  LoginForm,
  PastePageForm,
} from "./form_types";
import {
  ContentType,
  FileContent,
  TextContent,
  URLContent,
} from "./models/ClipboardItem";
import { logger } from "hono/logger";
import LockPage from "./pages/LockPage";
import LockedPage from "./pages/LockedPage";
import PastePage from "./pages/PastePage";
import z from "zod";
import { validator } from "hono/validator";
import EmptyClipboardPage from "./pages/EmptyClipboardPage";
import LoginPage from "./pages/LoginPage";
import { authenticate, getUserMiddleware, logout } from "./middleware/auth";
import { PageProps } from "./pages/page_props";
import PasteToRegisterPage from "./pages/PasteToRegisterPage";
import HistoryPage from "./pages/HistoryPage";
import {
  getAllRegisters,
  getStoredItem,
  getUnlockedUntil,
  isLocked,
  removeStoredItem,
  storeContent,
} from "./controller";

type Variables = {
  user?: string;
};

const app = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>();
export type ContextType = Context<{
  Bindings: CloudflareBindings;
  Variables: Variables;
}>;

function validateZod<T extends z.ZodTypeAny>(zodObject: T) {
  return validator("form", (value, c): z.infer<T> | Response => {
    const parsed = zodObject.safeParse(value);

    if (!parsed.success) {
      return c.text("Invalid form!", 401);
    }

    return parsed.data;
  });
}

function makePageProps(
  c: Context<{ Bindings: CloudflareBindings; Variables: Variables }>,
): PageProps {
  return {
    loggedIn: !!c.get("user"),
  };
}

app.use(logger());
app.use(getUserMiddleware);

app.use("/secure/*", async (c, next) => {
  if (!c.get("user")) {
    return c.redirect("/login");
  }
  return next();
});

app.use("/paste/*", async (c, next) => {
  if (!c.get("user") && (await isLocked(c.env.KV))) {
    return c.html(LockedPage({ pageProps: makePageProps(c) }));
  }

  await next();
});

app.get("/login", async (c) => {
  if (c.get("user")) {
    return c.redirect("/secure/lock");
  }

  return c.html(LoginPage({ pageProps: makePageProps(c) }));
});

app.post("/login", validateZod(LoginForm), async (c) => {
  const form = c.req.valid("form");

  if (form.username === c.env.USERNAME && form.password === c.env.PASSWORD) {
    await authenticate(c, form.username);

    return c.redirect("/secure/lock");
  } else {
    return c.html(
      LoginPage({
        pageProps: makePageProps(c),
        message: "Wrong username or password",
      }),
      401,
    );
  }
});

app.post("/logout", async (c) => {
  if (c.get("user")) {
    c.set("user", undefined);
    logout(c);
  }

  return c.redirect("/login");
});

app.get("/secure/lock", async (c) => {
  const unlockedUntil = await getUnlockedUntil(c.env.KV);
  const currentTime = Date.now();

  return c.html(
    LockPage({ unlockedUntil, currentTime, pageProps: makePageProps(c) }),
  );
});

app.post("/secure/lock", validateZod(LockUnlockForm), async (c) => {
  const form = c.req.valid("form");

  if (!form.unlock) {
    await c.env.KV.put("unlockUntil", "0");
    return c.redirect("/secure/lock");
  }

  const minutes = form.duration && form.duration > 0 ? form.duration : 5;
  const unlockUntil = Date.now() + minutes * 60 * 1000;
  await c.env.KV.put("unlockUntil", String(unlockUntil));
  return c.redirect("/secure/lock");
});

function returnToPaste(
  c: Context<{ Bindings: CloudflareBindings; Variables: Variables }>,
  register: string,
) {
  if (register === "") {
    return c.redirect(`/paste`);
  }
  return c.redirect(`/paste/${register}`);
}

app.get("/paste", async (c) => {
  const registers = await getAllRegisters(c.env.KV);

  const registerContent = await getStoredItem("", c.env.KV);

  return c.html(
    PastePage({
      usedRegisters: registers,
      pageProps: makePageProps(c),
      registerContent: registerContent ?? undefined,
    }),
  );
});

app.get("/paste/history", async (c) => {
  const register = "";
  const item = await getStoredItem(register, c.env.KV);

  return c.html(
    HistoryPage({
      register,
      registerItem: item ?? undefined,
      pageProps: makePageProps(c),
    }),
  );
});

app.get("/paste/:reg", async (c) => {
  const registerContent = await getStoredItem(c.req.param("reg"), c.env.KV);

  return c.html(
    PasteToRegisterPage({
      register: "/" + c.req.param("reg"),
      registerContent: registerContent ?? undefined,
      pageProps: makePageProps(c),
    }),
  );
});

app.get("/paste/history/:reg", async (c) => {
  const register = c.req.param("reg");
  const item = await getStoredItem(register, c.env.KV);

  return c.html(
    HistoryPage({
      register: "/" + register,
      registerItem: item ?? undefined,
      pageProps: makePageProps(c),
    }),
  );
});

app.post("/paste/remove/:reg?", async (c) => {
  const register = c.req.param("reg") ?? "";

  await removeStoredItem(register, c.env.KV, c.env.R2);

  return returnToPaste(c, register);
});

app.post("/paste/text/:reg?", validateZod(PasteTextForm), async (c) => {
  const form = c.req.valid("form");

  const content: TextContent = {
    type: ContentType.TEXT,
    text: form.text,
  };

  const register = c.req.param("reg") ?? "";
  await storeContent(register, content, c.env.KV);

  return returnToPaste(c, register);
});

app.post("/paste/url/:reg?", validateZod(PasteURLForm), async (c) => {
  const form = c.req.valid("form");

  const content: URLContent = {
    type: ContentType.URL,
    url: form.url,
  };

  const register = c.req.param("reg") ?? "";

  await storeContent(register, content, c.env.KV);

  return returnToPaste(c, register);
});

app.post("/paste/file/:reg?", validateZod(PasteFileForm), async (c) => {
  const form = c.req.valid("form");

  const file = form.file as File | undefined;
  if (!file) {
    return c.text("No file uploaded", 400);
  }

  const register = c.req.param("reg") ?? "";

  const key = `reg${register}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const data = await file.arrayBuffer();

  await c.env.R2.put(key, data, {
    httpMetadata: {
      contentType: file.type,
    },
  });

  const content: FileContent = {
    type: ContentType.FILE,
    bucket_key: key,
    file_name: file.name,
  };

  await storeContent(register, content, c.env.KV);

  return returnToPaste(c, register);
});

app.post("/paste/page", validateZod(PastePageForm), async (c) => {
  const form = c.req.valid("form");

  if (form.register.trim().length < 1) {
    return returnToPaste(c, "");
  }

  return returnToPaste(c, form.register);
});

async function getClipboardItem(
  register: string,
  c: Context<{ Bindings: CloudflareBindings; Variables: Variables }>,
) {
  const item = await getStoredItem(register, c.env.KV);
  if (!item) {
    return c.html(EmptyClipboardPage({ pageProps: makePageProps(c) }));
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
      headers.set(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(filename)}"`,
      );

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
}

app.get("/:register", async (c) => {
  const register = c.req.param("register");

  return getClipboardItem(register, c);
});

app.get("/", async (c) => {
  return getClipboardItem("", c);
});

export default app;
