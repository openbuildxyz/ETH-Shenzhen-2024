import { Telegram } from "@prisma/client";
import { JWTVerifyResult, SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const expiredTime = 24 * 60 * 60 * 1000;
const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY!;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24 hours from now")
    .sign(key);
}

export async function decrypt(input: string) {
  const { payload } = (await jwtVerify(input, key, {
    algorithms: ["HS256"],
  })) as JWTVerifyResult<{ user: Telegram; expires: Date }>;
  return payload;
}

export async function login(user: Telegram) {
  // Create the session
  const expires = new Date(Date.now() + expiredTime);
  const session = await encrypt({ user, expires });
  // Save the session in a cookie
  cookies().set("session", session, { expires, httpOnly: true });
}

export async function logout() {
  // Destroy the session
  cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
  const session = cookies().get("session")?.value;
  if (!session) return null;
  const parsed = await decrypt(session);
  // Check if the session has expired
  if (new Date(parsed.expires) < new Date()) {
    return null;
  }
  return parsed;
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get("session")?.value;
  if (!session) return;

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session);
  const res = NextResponse.next();
  if (new Date(parsed.expires) < new Date()) {
    parsed.expires = new Date(Date.now() + expiredTime);
    res.cookies.set({
      name: "session",
      value: await encrypt(parsed),
      httpOnly: true,
      expires: parsed.expires,
    });
  }
  return res;
}
