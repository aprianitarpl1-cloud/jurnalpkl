
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";
import { getSiswaSession, logoutSiswa } from "@/lib/auth";

export type Siswa = {
  id: number;
  nama: string;
  kelas: string;
  tempat_pkl: string;
  pembimbing: string;
};

export type Jurnal = {
  id: number;
  siswa_id: number;
  tanggal: string;
  kegiatan: string;
  durasi_jam: number;
  kompetensi: string;
};

// Mengambil data siswa dan jurnal
export async function ambilDataJurnalSiswa() {
  const siswaId = await getSiswaSession();

  if (!siswaId) {
    return { status: "belum-login" as const };
  }

  const { data: siswa, error: errorSiswa } = await supabaseAdmin
    .from("siswa")
    .select("id, nama, kelas, tempat_pkl, pembimbing")
    .eq("id", siswaId)
    .maybeSingle();

  if (errorSiswa) {
    throw new Error(errorSiswa.message);
  }

  if (!siswa) {
    throw new Error("Data siswa tidak ditemukan.");
  }

  const { data: jurnal, error: errorJurnal } = await supabaseAdmin
    .from("jurnal")
    .select("id, siswa_id, tanggal, kegiatan, durasi_jam, kompetensi")
    .eq("siswa_id", siswaId)
    .order("tanggal", { ascending: false });

  if (errorJurnal) {
    throw new Error(errorJurnal.message);
  }

  return {
    status: "berhasil" as const,
    siswa: siswa as Siswa,
    daftarJurnal: (jurnal || []) as Jurnal[],
  };
}

// Menyimpan jurnal baru
export async function simpanJurnalBaru(input: {
  tanggal: string;
  kegiatan: string;
  durasi_jam: number;
  kompetensi: string;
}) {
  const siswaId = await getSiswaSession();

  if (!siswaId) {
    return {
      success: false as const,
      status: "belum-login" as const,
      message: "Silakan login terlebih dahulu.",
    };
  }

  if (
    !input.tanggal ||
    !input.kegiatan.trim() ||
    !input.kompetensi.trim() ||
    !Number.isInteger(input.durasi_jam) ||
    input.durasi_jam < 1 ||
    input.durasi_jam > 10
  ) {
    return {
      success: false as const,
      status: "gagal" as const,
      message: "Data jurnal tidak valid. Periksa kembali isian kamu.",
    };
  }

  const { error } = await supabaseAdmin
    .from("jurnal")
    .insert({
      siswa_id: siswaId,
      tanggal: input.tanggal,
      kegiatan: input.kegiatan.trim(),
      durasi_jam: input.durasi_jam,
      kompetensi: input.kompetensi.trim(),
      status: "diajukan",
    });

  if (error) {
    console.error("Gagal menyimpan jurnal:", error);

    return {
      success: false as const,
      status: "gagal" as const,
      message: error.message,
    };
  }

  return {
    success: true as const,
    message: "Jurnal berhasil disimpan.",
  };
}

// Logout siswa
export async function keluarDariJurnal() {
  await logoutSiswa();
}
