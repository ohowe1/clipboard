import { Context } from "hono";
import { getCookie, setCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import { sign, verify } from "hono/jwt";
import { ContextType } from "..";

const AUTH_COOKIE_NAME = "auth";
const ALG = "HS256"

export async function authenticate(c: ContextType, username: string) {
  // Token expires in 1 year
  const token = await sign({ username: username, iss: c.env.JWT_ISSUER, aud: c.env.JWT_ISSUER, iat: Math.floor(Date.now() / 1000), exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 365) }, c.env.JWT_SECRET, ALG);

  setCookie(c, AUTH_COOKIE_NAME, token, { httpOnly: true, secure: true, expires: new Date(Date.now() + 60 * 60 * 24 * 365 * 1000) });
}

export function logout(c: ContextType) {
  setCookie(c, AUTH_COOKIE_NAME, "", { httpOnly: true, secure: true, maxAge: 0 });
}

export const getUserMiddleware = createMiddleware(async (c, next) => {
  const cookie = getCookie(c, AUTH_COOKIE_NAME);
  if (!cookie) {
    await next();
    return;
  }

  const verified = await verify(cookie, c.env.JWT_SECRET, {
    alg: ALG,
    iss: c.env.JWT_ISSUER,
    aud: c.env.JWT_ISSUER
  });

  if (!verified) {
    await next();
    return;
  }

  c.set("user", verified.username);
  await next();
});
