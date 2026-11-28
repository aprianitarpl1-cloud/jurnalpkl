
import "server-only";

import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET;

type SessionData = {
  siswaId?: number;
  role?: string;
  exp: number;
};

// Membuat tanda tangan sesi
function tandaTangan(payload: string): string {
  if (!SESSION_SECRET) {
    throw new Error("SESSION_SECRET belum diatur.");
  }

  return createHmac("sha256", SESSION_SECRET)
    .update(payload)
    .digest("base64url");
}

// Memeriksa keaslian dan masa berlaku sesi
function verifikasiToken(token: string): SessionData | null {
  if (!SESSION_SECRET) return null;

  try {
    const [payload, signature] = token.split(".");

    if (!payload || !signature) return null;

    const expected = tandaTangan(payload);

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return null;
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    if (
      !Number.isSafeInteger(data.exp) ||
      data.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return data as SessionData;
  } catch {
    return null;
  }
}

// Mengambil sesi siswa
export async function getSiswaSession(): Promise<number | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("siswa_session")?.value;

    if (!token) return null;

    const session = verifikasiToken(token);

    if (
      !session ||
      !Number.isSafeInteger(session.siswaId) ||
      !session.siswaId ||
      session.siswaId <= 0
    ) {
      return null;
    }

    return session.siswaId;
  } catch {
    return null;
  }
}

// Memeriksa apakah siswa sudah login
export async function wajibLoginSiswa(): Promise<number> {
  const siswaId = await getSiswaSession();

  if (!siswaId) {
    throw new Error("Silakan login sebagai siswa terlebih dahulu.");
  }

  return siswaId;
}

// Mengambil sesi admin
export async function getAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) return false;

    const session = verifikasiToken(token);

    return session?.role === "admin";
  } catch {
    return false;
  }
}

// Memeriksa apakah admin sudah login
export async function wajibLoginAdmin(): Promise<void> {
  const adminLogin = await getAdminSession();

  if (!adminLogin) {
    throw new Error("Silakan login sebagai admin terlebih dahulu.");
  }
}

// Logout siswa
export async function logoutSiswa(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("siswa_session");
}

// Logout admin
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
