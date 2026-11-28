
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Siswa = {
  id: number;
  nama: string;
  kelas: string;
  tempat_pkl: string;
  pembimbing: string;
};

export default function SiswaPage() {
  const [daftarSiswa, setDaftarSiswa] = useState<Siswa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function ambilSiswa() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("siswa")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      setError(error.message);
      setDaftarSiswa([]);
    } else {
      setDaftarSiswa(data as Siswa[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    ambilSiswa();
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Data Siswa
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Daftar siswa yang mengikuti kegiatan PKL.
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
          >
            Kembali ke Admin
          </Link>
        </div>

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">Total Siswa</p>
            <p className="mt-2 text-3xl font-bold text-blue-600">
              {daftarSiswa.length}
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b p-5">
            <h2 className="font-semibold text-slate-800">
              Daftar Siswa PKL
            </h2>
          </div>

          {loading ? (
            <p className="p-6 text-center text-slate-500">
              Memuat data siswa...
            </p>
          ) : error ? (
            <div className="p-6 text-center text-red-600">
              Gagal mengambil data: {error}
              <button
                onClick={ambilSiswa}
                className="ml-2 text-blue-600 underline"
              >
                Coba lagi
              </button>
            </div>
          ) : daftarSiswa.length === 0 ? (
            <p className="p-6 text-center text-slate-500">
              Belum ada data siswa.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100 text-slate-600">
                  <tr>
                    <th className="px-5 py-4">No</th>
                    <th className="px-5 py-4">Nama</th>
                    <th className="px-5 py-4">Kelas</th>
                    <th className="px-5 py-4">Tempat PKL</th>
                    <th className="px-5 py-4">Pembimbing</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {daftarSiswa.map((siswa, index) => (
                    <tr key={siswa.id} className="hover:bg-slate-50">
                      <td className="px-5 py-4">{index + 1}</td>
                      <td className="px-5 py-4 font-medium text-slate-800">
                        {siswa.nama}
                      </td>
                      <td className="px-5 py-4">{siswa.kelas}</td>
                      <td className="px-5 py-4">{siswa.tempat_pkl}</td>
                      <td className="px-5 py-4">{siswa.pembimbing}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
