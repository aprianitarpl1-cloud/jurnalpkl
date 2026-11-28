
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type Jurnal = {
  id: number;
  siswaId: number;
  tanggal: string;
  jamMulai: string;
  jamSelesai: string;
  kegiatan: string;
  hasil: string;
  dibuat: string;
};

export default function UbahJurnalPage() {
  const router = useRouter();
  const params = useParams();

  const [memuat, setMemuat] = useState(true);
  const [tanggal, setTanggal] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");
  const [kegiatan, setKegiatan] = useState("");
  const [hasil, setHasil] = useState("");
  const [pesan, setPesan] = useState("");

  const id = Number(params.id);

  useEffect(() => {
    const dataSiswa = sessionStorage.getItem("siswa");

    if (!dataSiswa) {
      router.replace("/masuk");
      return;
    }

    try {
      const siswa = JSON.parse(dataSiswa);
      const daftarJurnal: Jurnal[] = JSON.parse(
        sessionStorage.getItem("jurnal") || "[]"
      );

      const jurnal = daftarJurnal.find(
        (item) => item.id === id && item.siswaId === siswa.id
      );

      if (!jurnal) {
        router.replace("/jurnal");
        return;
      }

      setTanggal(jurnal.tanggal);
      setJamMulai(jurnal.jamMulai);
      setJamSelesai(jurnal.jamSelesai);
      setKegiatan(jurnal.kegiatan);
      setHasil(jurnal.hasil);
    } catch {
      router.replace("/masuk");
    } finally {
      setMemuat(false);
    }
  }, [id, router]);

  function handleSimpan(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (jamSelesai <= jamMulai) {
      setPesan("Jam selesai harus lebih besar dari jam mulai.");
      return;
    }

    try {
      const dataSiswa = sessionStorage.getItem("siswa");

      if (!dataSiswa) {
        router.replace("/masuk");
        return;
      }

      const siswa = JSON.parse(dataSiswa);

      const daftarJurnal: Jurnal[] = JSON.parse(
        sessionStorage.getItem("jurnal") || "[]"
      );

      const index = daftarJurnal.findIndex(
        (item) => item.id === id && item.siswaId === siswa.id
      );

      if (index === -1) {
        setPesan("Jurnal tidak ditemukan.");
        return;
      }

      daftarJurnal[index] = {
        ...daftarJurnal[index],
        tanggal,
        jamMulai,
        jamSelesai,
        kegiatan,
        hasil,
      };

      sessionStorage.setItem(
        "jurnal",
        JSON.stringify(daftarJurnal)
      );

      router.push("/jurnal");
    } catch {
      setPesan("Gagal menyimpan perubahan jurnal.");
    }
  }

  if (memuat) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Memuat jurnal...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-blue-700">
              Jurnal PKL
            </h1>
            <p className="text-xs text-slate-500">
              Jurnal Harian Praktik Kerja Lapangan
            </p>
          </div>

          <Link
            href="/jurnal"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Kembali
          </Link>
        </div>
      </nav>

      {/* Konten */}
      <div className="mx-auto max-w-3xl px-6 py-10">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Ubah Jurnal Harian
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Perbarui catatan kegiatan Praktik Kerja Lapangan kamu.
          </p>
        </div>

        <form
          onSubmit={handleSimpan}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
        >

          {/* Tanggal */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Tanggal Kegiatan
            </label>

            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Jam */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Jam Mulai
              </label>

              <input
                type="time"
                value={jamMulai}
                onChange={(e) => setJamMulai(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Jam Selesai
              </label>

              <input
                type="time"
                value={jamSelesai}
                onChange={(e) => setJamSelesai(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Kegiatan */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Kegiatan PKL
            </label>

            <textarea
              value={kegiatan}
              onChange={(e) => setKegiatan(e.target.value)}
              required
              rows={5}
              placeholder="Tuliskan kegiatan PKL..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Hasil */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Hasil Kegiatan
            </label>

            <textarea
              value={hasil}
              onChange={(e) => setHasil(e.target.value)}
              required
              rows={4}
              placeholder="Tuliskan hasil kegiatan..."
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
            />
          </div>

          {/* Pesan */}
          {pesan && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {pesan}
            </div>
          )}

          {/* Tombol */}
          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
            <Link
              href="/jurnal"
              className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Batal
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white px-6 py-5 text-center">
        <p className="text-xs text-slate-500">
          © 2026 Jurnal PKL. Aplikasi Jurnal Harian Praktik Kerja Lapangan.
        </p>
      </footer>

    </main>
  );
}
