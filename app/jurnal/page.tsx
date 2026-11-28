
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import {
  ambilDataJurnalSiswa,
  keluarDariJurnal,
  type Siswa,
  type Jurnal,
} from "../actions/jurnal";

export default function JurnalPage() {
  const router = useRouter();

  const [siswa, setSiswa] = useState<Siswa | null>(null);
  const [daftarJurnal, setDaftarJurnal] = useState<Jurnal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sedangKeluar, setSedangKeluar] = useState(false);

  useEffect(() => {
    let aktif = true;

    async function muatData() {
      try {
        const hasil = await ambilDataJurnalSiswa();

        if (!aktif) return;

        if (hasil.status === "belum-login") {
          router.replace("/masuk");
          return;
        }

        setSiswa(hasil.siswa);
        setDaftarJurnal(hasil.daftarJurnal);
      } catch (err) {
        console.error("Kesalahan memuat jurnal:", err);

        if (aktif) {
          setError(
            err instanceof Error
              ? err.message
              : "Gagal memuat data jurnal."
          );
        }
      } finally {
        if (aktif) setLoading(false);
      }
    }

    muatData();

    return () => {
      aktif = false;
    };
  }, [router]);

  async function keluar() {
    try {
      setSedangKeluar(true);
      await keluarDariJurnal();
      sessionStorage.removeItem("siswa");
      router.replace("/masuk");
    } catch (err) {
      console.error("Gagal keluar:", err);
      setError("Gagal keluar dari akun.");
      setSedangKeluar(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-500">Memuat data jurnal...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <header className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-blue-700">
              Jurnal PKL
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Catatan kegiatan Praktik Kerja Lapangan
            </p>
          </div>

          <button
            onClick={keluar}
            disabled={sedangKeluar}
            className="rounded-lg bg-red-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sedangKeluar ? "Keluar..." : "Keluar"}
          </button>
        </header>

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-600">
            {error}
          </div>
        ) : (
          <>
            {/* Informasi Siswa */}
            {siswa && (
              <section className="mb-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-5 flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-blue-600" />
                  <h2 className="font-bold text-slate-800">
                    Informasi Siswa
                  </h2>
                </div>

                <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                  <div className="border-b border-slate-100 pb-3 sm:border-b-0">
                    <p className="mb-1 text-sm text-slate-500">
                      Nama
                    </p>
                    <p className="font-semibold text-slate-800">
                      {siswa.nama}
                    </p>
                  </div>

                  <div className="border-b border-slate-100 pb-3 sm:border-b-0">
                    <p className="mb-1 text-sm text-slate-500">
                      Kelas
                    </p>
                    <p className="font-semibold text-slate-800">
                      {siswa.kelas}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-sm text-slate-500">
                      Tempat PKL
                    </p>
                    <p className="font-semibold text-slate-800">
                      {siswa.tempat_pkl}
                    </p>
                  </div>

                  <div>
                    <p className="mb-1 text-sm text-slate-500">
                      Pembimbing
                    </p>
                    <p className="font-semibold text-slate-800">
                      {siswa.pembimbing}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Jurnal Harian */}
            <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-1 rounded-full bg-blue-600" />
                    <h2 className="text-lg font-bold text-slate-800">
                      Jurnal Harian
                    </h2>
                  </div>

                  <p className="ml-4 mt-1 text-sm text-slate-500">
                    Total {daftarJurnal.length} catatan kegiatan
                  </p>
                </div>

                <Link
                  href="/jurnal/baru"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow active:scale-95"
                >
                  + Tambah Jurnal
                </Link>
              </div>

              {daftarJurnal.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <p className="font-medium text-slate-600">
                    Belum ada catatan jurnal.
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Silakan tambahkan kegiatan PKL pertamamu.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-100 text-slate-700">
                      <tr>
                        <th className="whitespace-nowrap px-4 py-3 font-semibold">
                          No
                        </th>
                        <th className="whitespace-nowrap px-4 py-3 font-semibold">
                          Tanggal
                        </th>
                        <th className="min-w-64 px-4 py-3 font-semibold">
                          Kegiatan
                        </th>
                        <th className="whitespace-nowrap px-4 py-3 font-semibold">
                          Durasi
                        </th>
                        <th className="whitespace-nowrap px-4 py-3 font-semibold">
                          Kompetensi
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {daftarJurnal.map((jurnal, index) => (
                        <tr
                          key={jurnal.id}
                          className="transition-colors hover:bg-blue-50/60"
                        >
                          <td className="px-4 py-4 font-medium text-slate-600">
                            {index + 1}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                            {new Date(
                              jurnal.tanggal + "T00:00:00"
                            ).toLocaleDateString("id-ID")}
                          </td>

                          <td className="px-4 py-4 leading-relaxed text-slate-700">
                            {jurnal.kegiatan}
                          </td>

                          <td className="whitespace-nowrap px-4 py-4 text-slate-700">
                            {jurnal.durasi_jam} jam
                          </td>

                          <td className="px-4 py-4">
                            <span className="inline-block rounded-md bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                              {jurnal.kompetensi}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}
