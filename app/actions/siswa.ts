
"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_COOKIE = "admin_session";
const SESSION_SECRET = process.env.SESSION_SECRET;

// Memeriksa sesi admin
async function adminSudahLogin(): Promise<boolean> {
  if (!SESSION_SECRET) return false;

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(ADMIN_COOKIE)?.value;

    if (!token) return false;

    const [payload, signature] = token.split(".");

    if (!payload || !signature) return false;

    const expected = createHmac("sha256", SESSION_SECRET)
      .update(payload)
      .digest("base64url");

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expected);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return false;
    }

    const data = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8")
    );

    return (
      data.role === "admin" &&
      Number.isSafeInteger(data.exp) &&
      data.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}

// Membuat kode siswa secara acak
function buatKodeSiswa(): string {
  return "PKL-" + randomBytes(4).toString("hex").toUpperCase();
}

// Menampilkan semua siswa (khusus admin)
export async function ambilDaftarSiswa() {
  try {
    if (!(await adminSudahLogin())) {
      return {
        success: false,
        message: "Akses ditolak. Silakan login sebagai admin.",
        data: [],
      };
    }

    const { data, error } = await supabaseAdmin
      .from("siswa")
      .select("id, nama, kelas, tempat_pkl, pembimbing")
      .order("id", { ascending: true });

    if (error) {
      return {
        success: false,
        message: "Gagal mengambil data siswa.",
        data: [],
      };
    }

    return {
      success: true,
      message: "Data siswa berhasil diambil.",
      data,
    };
  } catch {
    return {
      success: false,
      message: "Terjadi kesalahan pada server.",
      data: [],
    };
  }
}

// Menambahkan siswa baru (khusus admin)
export async function tambahSiswa(data: {
  nama: string;
  kelas: string;
  tempat_pkl: string;
  pembimbing: string;
}) {
  try {
    if (!(await adminSudahLogin())) {
      return {
        success: false,
        message: "Akses ditolak. Silakan login sebagai admin.",
      };
    }

    const nama = data.nama?.trim();
    const kelas = data.kelas?.trim();
    const tempatPKL = data.tempat_pkl?.trim();
    const pembimbing = data.pembimbing?.trim();

    if (!nama || nama.length < 3 || nama.length > 40) {
      return {
        success: false,
        message: "Nama harus terdiri dari 3–40 karakter.",
      };
    }

    if (!kelas || !tempatPKL || !pembimbing) {
      return {
        success: false,
        message: "Semua data siswa wajib diisi.",
      };
    }

    // Membuat kode unik secara otomatis
    let kode = "";
    let berhasil = false;

    for (let i = 0; i < 5; i++) {
      kode = buatKodeSiswa();

      const { data: kodeAda, error: cekError } =
        await supabaseAdmin
          .from("siswa")
          .select("id")
          .eq("kode", kode)
          .maybeSingle();

      if (cekError) {
        return {
          success: false,
          message: "Gagal memeriksa kode siswa.",
        };
      }

      if (!kodeAda) {
        berhasil = true;
        break;
      }
    }

    if (!berhasil) {
      return {
        success: false,
        message: "Gagal membuat kode siswa. Silakan coba lagi.",
      };
    }

    const { data: siswa, error } = await supabaseAdmin
      .from("siswa")
      .insert({
        nama,
        kelas,
        tempat_pkl: tempatPKL,
        pembimbing,
        kode,
      })
      .select("id, nama, kelas, tempat_pkl, pembimbing, kode")
      .single();

    if (error) {
      return {
        success: false,
        message: "Gagal menambahkan siswa.",
      };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/siswa");

    return {
      success: true,
      message: "Siswa berhasil ditambahkan.",
      data: siswa,
    };
  } catch {
    return {
      success: false,
      message: "Terjadi kesalahan pada server.",
    };
  }
}

// Menghapus siswa jika belum memiliki jurnal
export async function hapusSiswa(id: number) {
  try {
    if (!(await adminSudahLogin())) {
      return {
        success: false,
        message: "Akses ditolak. Silakan login sebagai admin.",
      };
    }

    if (!Number.isSafeInteger(id) || id <= 0) {
      return {
        success: false,
        message: "ID siswa tidak valid.",
      };
    }

    // Periksa apakah siswa sudah memiliki jurnal
    const { data: jurnal, error: cekError } =
      await supabaseAdmin
        .from("jurnal")
        .select("id")
        .eq("siswa_id", id)
        .limit(1);

    if (cekError) {
      return {
        success: false,
        message: "Gagal memeriksa jurnal siswa.",
      };
    }

    if (jurnal && jurnal.length > 0) {
      return {
        success: false,
        message: "Siswa yang sudah memiliki jurnal tidak bisa dihapus.",
      };
    }

    const { data: siswa, error } = await supabaseAdmin
      .from("siswa")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error || !siswa) {
      return {
        success: false,
        message: "Gagal menghapus siswa atau siswa tidak ditemukan.",
      };
    }

    revalidatePath("/admin");
    revalidatePath("/admin/siswa");

    return {
      success: true,
      message: "Siswa berhasil dihapus.",
    };
  } catch {
    return {
      success: false,
      message: "Terjadi kesalahan pada server.",
    };
  }
}
