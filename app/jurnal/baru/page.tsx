
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { simpanJurnalBaru } from "@/app/actions/jurnal";

export default function JurnalBaruPage() {
  const router = useRouter();

  const [tanggal, setTanggal] = useState("");
  const [durasi, setDurasi] = useState("5");
  const [kegiatan, setKegiatan] = useState("");
  const [kompetensi, setKompetensi] = useState("");
  const [memuat, setMemuat] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);
  const [pesan, setPesan] = useState("");

  useEffect(() => {
    const hariIni = new Date();
    const tahun = hariIni.getFullYear();
    const bulan = String(hariIni.getMonth() + 1).padStart(2, "0");
    const hari = String(hariIni.getDate()).padStart(2, "0");

    setTanggal(`${tahun}-${bulan}-${hari}`);
    setMemuat(false);
  }, []);

  async function handleSimpan(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setPesan("");

    if (!tanggal || !kegiatan.trim() || !kompetensi.trim()) {
      setPesan("Semua kolom wajib diisi.");
      return;
    }

    const durasiJam = Number(durasi);

    if (!Number.isInteger(durasiJam) || durasiJam < 1 || durasiJam > 10) {
      setPesan("Durasi harus antara 1 sampai 10 jam.");
      return;
    }

    setMenyimpan(true);

    try {
      const hasil = await simpanJurnalBaru({
        tanggal,
        kegiatan: kegiatan.trim(),
        durasi_jam: durasiJam,
        kompetensi: kompetensi.trim(),
      });

      if (!hasil.success) {
        if (hasil.status === "belum-login") {
          router.replace("/masuk");
          return;
        }

        setPesan(hasil.message);
        return;
      }

      router.push("/jurnal");
      router.refresh();
    } catch (error) {
      console.error("Gagal menyimpan jurnal:", error);
      setPesan("Terjadi kesalahan saat menyimpan jurnal.");
    } finally {
      setMenyimpan(false);
    }
  }

  if (memuat) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Memuat halaman...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">

        <Link
          href="/jurnal"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Kembali ke Jurnal
        </Link>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <h1 className="text-2xl font-bold text-slate-800">
            Tambah Jurnal Harian
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Catat kegiatan yang kamu lakukan selama Praktik Kerja Lapangan.
          </p>

          {pesan && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {pesan}
            </div>
          )}

          <form onSubmit={handleSimpan} className="mt-6 space-y-5">

            {/* Tanggal */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Tanggal Kegiatan
              </label>

              <input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Durasi */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Durasi Kegiatan (Jam)
              </label>

              <input
                type="number"
                min="1"
                max="10"
                value={durasi}
                onChange={(e) => setDurasi(e.target.value)}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Kegiatan */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Kegiatan PKL
              </label>

              <textarea
                value={kegiatan}
                onChange={(e) => setKegiatan(e.target.value)}
                required
                minLength={30}
                maxLength={500}
                rows={4}
                placeholder="Tuliskan kegiatan yang kamu lakukan..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-slate-400">
                Minimal 30 dan maksimal 500 karakter.
              </p>
            </div>

            {/* Kompetensi */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Kompetensi
              </label>

              <input
                type="text"
                value={kompetensi}
                onChange={(e) => setKompetensi(e.target.value)}
                required
                minLength={3}
                maxLength={60}
                placeholder="Contoh: JavaScript, HTML dan CSS"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Tombol */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row">

              <Link
                href="/jurnal"
                className="rounded-lg border border-slate-300 px-5 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50 sm:flex-1"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={menyimpan}
                className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
              >
                {menyimpan ? "Menyimpan..." : "Simpan Jurnal"}
              </button>

            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
