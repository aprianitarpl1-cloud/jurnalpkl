
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

type Jurnal = {
  id: number;
  siswa_id: number;
  tanggal: string;
  kegiatan: string;
  durasi_jam: number;
  kompetensi: string;
};

export default function AdminPage() {
  const [siswa, setSiswa] = useState<Siswa[]>([]);
  const [jurnal, setJurnal] = useState<Jurnal[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [pesan, setPesan] = useState("");
  const [tab, setTab] = useState<"siswa" | "jurnal">("siswa");

  async function ambilData() {
    setMemuat(true);
    setPesan("");

    const [hasilSiswa, hasilJurnal] = await Promise.all([
      supabase.from("siswa").select("*").order("id", { ascending: true }),
      supabase.from("jurnal").select("*").order("tanggal", { ascending: false }),
    ]);

    if (hasilSiswa.error || hasilJurnal.error) {
      setPesan(
        hasilSiswa.error?.message ||
        hasilJurnal.error?.message ||
        "Gagal mengambil data."
      );
    } else {
      setSiswa(hasilSiswa.data || []);
      setJurnal(hasilJurnal.data || []);
    }

    setMemuat(false);
  }

  useEffect(() => {
    ambilData();
  }, []);

  async function hapusJurnal(id: number) {
    const yakin = window.confirm(
      "Apakah kamu yakin ingin menghapus jurnal ini?"
    );

    if (!yakin) return;

    const { error } = await supabase
      .from("jurnal")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Gagal menghapus jurnal: " + error.message);
      return;
    }

    setJurnal((data) => data.filter((item) => item.id !== id));
    alert("Jurnal berhasil dihapus.");
  }

  function namaSiswa(id: number) {
    return siswa.find((item) => item.id === id)?.nama || "Siswa tidak ditemukan";
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* Navbar */}
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-blue-700">
              Admin Jurnal PKL
            </h1>
            <p className="text-xs text-slate-500">
              Panel pengelolaan data Praktik Kerja Lapangan
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={ambilData}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              ↻ Refresh
            </button>

            <Link
              href="/masuk"
              className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
            >
              Keluar
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Judul */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800">
            Dashboard Admin
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Pantau dan kelola seluruh data siswa dan jurnal PKL.
          </p>
        </div>

        {/* Statistik */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl bg-blue-600 p-6 text-white shadow-sm">
            <p className="text-sm text-blue-100">Total Siswa</p>
            <h3 className="mt-2 text-3xl font-bold">
              {siswa.length}
            </h3>
            <p className="mt-2 text-sm text-blue-100">
              Siswa terdaftar
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-600 p-6 text-white shadow-sm">
            <p className="text-sm text-emerald-100">Total Jurnal</p>
            <h3 className="mt-2 text-3xl font-bold">
              {jurnal.length}
            </h3>
            <p className="mt-2 text-sm text-emerald-100">
              Jurnal kegiatan PKL
            </p>
          </div>
        </div>

        {/* Tab */}
        <div className="mt-10 flex gap-3 border-b border-slate-200">
          <button
            onClick={() => setTab("siswa")}
            className={`border-b-2 px-5 py-3 text-sm font-semibold ${
              tab === "siswa"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500"
            }`}
          >
            Data Siswa
          </button>

          <button
            onClick={() => setTab("jurnal")}
            className={`border-b-2 px-5 py-3 text-sm font-semibold ${
              tab === "jurnal"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500"
            }`}
          >
            Data Jurnal
          </button>
        </div>

        {/* Pesan */}
        {pesan && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {pesan}
          </div>
        )}

        {/* Loading */}
        {memuat ? (
          <div className="py-16 text-center text-slate-500">
            Memuat data...
          </div>
        ) : (
          <>
            {/* Tabel Siswa */}
            {tab === "siswa" && (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="p-4">No</th>
                      <th className="p-4">Nama</th>
                      <th className="p-4">Kelas</th>
                      <th className="p-4">Tempat PKL</th>
                      <th className="p-4">Pembimbing</th>
                    </tr>
                  </thead>

                  <tbody>
                    {siswa.map((item, index) => (
                      <tr key={item.id} className="border-t border-slate-100">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 font-medium text-slate-800">
                          {item.nama}
                        </td>
                        <td className="p-4">{item.kelas}</td>
                        <td className="p-4">{item.tempat_pkl}</td>
                        <td className="p-4">{item.pembimbing}</td>
                      </tr>
                    ))}

                    {siswa.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          Belum ada data siswa.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Tabel Jurnal */}
            {tab === "jurnal" && (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 text-slate-600">
                    <tr>
                      <th className="p-4">No</th>
                      <th className="p-4">Nama Siswa</th>
                      <th className="p-4">Tanggal</th>
                      <th className="p-4">Kegiatan</th>
                      <th className="p-4">Durasi</th>
                      <th className="p-4">Kompetensi</th>
                      <th className="p-4">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {jurnal.map((item, index) => (
                      <tr key={item.id} className="border-t border-slate-100">
                        <td className="p-4">{index + 1}</td>
                        <td className="p-4 font-medium text-slate-800">
                          {namaSiswa(item.siswa_id)}
                        </td>
                        <td className="p-4">{item.tanggal}</td>
                        <td className="p-4">{item.kegiatan}</td>
                        <td className="p-4">{item.durasi_jam} jam</td>
                        <td className="p-4">{item.kompetensi}</td>
                        <td className="p-4">
                          <button
                            onClick={() => hapusJurnal(item.id)}
                            className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}

                    {jurnal.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          Belum ada jurnal.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

      </div>

      {/* Footer */}
      <footer className="mt-12 border-t border-slate-200 bg-white px-6 py-5 text-center">
        <p className="text-xs text-slate-500">
          © 2026 Jurnal PKL. Panel Administrator.
        </p>
      </footer>

    </main>
  );
}
