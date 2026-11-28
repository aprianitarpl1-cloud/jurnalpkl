
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [kode, setKode] = useState("");
  const [password, setPassword] = useState("");
  const [pesan, setPesan] = useState("");
  const [memuat, setMemuat] = useState(false);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (memuat) return;

    setPesan("");
    setMemuat(true);

    const daftarSiswa = [
      {
        id: 1,
        nama: "Aprianita",
        kelas: "XI RPL",
        kode: "S001",
        password: "123456",
      },
    ];

    const siswa = daftarSiswa.find(
      (item) =>
        item.kode === kode.trim() &&
        item.password === password
    );

    if (!siswa) {
      setPesan("Kode siswa atau password salah.");
      setMemuat(false);
      return;
    }

    try {
      sessionStorage.setItem(
        "siswa",
        JSON.stringify({
          id: siswa.id,
          nama: siswa.nama,
          kelas: siswa.kelas,
          kode: siswa.kode,
        })
      );

      router.replace("/jurnal");
    } catch {
      setPesan("Gagal menyimpan data login.");
      setMemuat(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
            📘
          </div>

          <h1 className="text-2xl font-bold text-blue-700">
            Login Jurnal PKL
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Silakan login untuk mengakses jurnal harian PKL.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="kode" className="mb-2 block text-sm font-semibold text-slate-700">
              Kode Siswa
            </label>

            <input
              id="kode"
              type="text"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="Masukkan kode siswa"
              required
              disabled={memuat}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              disabled={memuat}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {pesan && (
            <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {pesan}
            </p>
          )}

          <button
            type="submit"
            disabled={memuat}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {memuat ? "Memproses..." : "Login"}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-5 text-center">
          <p className="text-xs text-slate-400">
            © 2026 Jurnal PKL
          </p>
        </div>
      </div>
    </main>
  );
}
