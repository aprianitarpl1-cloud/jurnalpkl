
import { NextRequest, NextResponse } from "next/server";
import {
  createHmac,
  scryptSync,
  timingSafeEqual,
} from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: NextRequest) {
  try {
    // Memeriksa SESSION_SECRET
    const secret = process.env.SESSION_SECRET;

    if (!secret) {
      return NextResponse.json(
        { message: "SESSION_SECRET belum diatur." },
        { status: 500 }
      );
    }

    // Mengambil data dari form login
    const body = await request.json();

    const kode = String(body.kode || "").trim();
    const password = String(body.password || "");

    if (!kode || !password) {
      return NextResponse.json(
        { message: "Kode siswa dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Mengambil data siswa dari Supabase
    const { data: siswa, error } = await supabaseAdmin
      .from("siswa")
      .select("id, kode, password_hash")
      .eq("kode", kode)
      .maybeSingle();

    if (error) {
      console.error("Database error:", error);

      return NextResponse.json(
        {
          message:
            "Gagal mengambil data siswa: " + error.message,
        },
        { status: 500 }
      );
    }

    // Memeriksa keberadaan siswa
    if (!siswa || !siswa.password_hash) {
      return NextResponse.json(
        { message: "Kode siswa atau password salah." },
        { status: 401 }
      );
    }

    // Memeriksa format password hash
    const [salt, storedHash] = siswa.password_hash.split(":");

    if (
      !salt ||
      !storedHash ||
      !/^[a-f0-9]{32}$/i.test(salt) ||
      !/^[a-f0-9]{128}$/i.test(storedHash)
    ) {
      return NextResponse.json(
        { message: "Format password siswa tidak valid." },
        { status: 500 }
      );
    }

    // Mengubah password menjadi hash
    const passwordHash = scryptSync(password, salt, 64);
    const savedHash = Buffer.from(storedHash, "hex");

    // Mencocokkan password
    if (
      passwordHash.length !== savedHash.length ||
      !timingSafeEqual(passwordHash, savedHash)
    ) {
      return NextResponse.json(
        { message: "Kode siswa atau password salah." },
        { status: 401 }
      );
    }

    // Membuat sesi login siswa
    const exp = Math.floor(Date.now() / 1000) + 86400;

    const payload = Buffer.from(
      JSON.stringify({
        siswaId: siswa.id,
        exp,
      })
    ).toString("base64url");

    const signature = createHmac("sha256", secret)
      .update(payload)
      .digest("base64url");

    const token = `${payload}.${signature}`;

    // Menyimpan sesi ke cookie
    const response = NextResponse.json({
      success: true,
      message: "Login berhasil.",
    });

    response.cookies.set("siswa_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400,
    });

    return response;
  } catch (error) {
    console.error("Kesalahan API login:", error);

    return NextResponse.json(
      { message: "Terjadi kesalahan pada server." },
      { status: 500 }
    );
  }
}
