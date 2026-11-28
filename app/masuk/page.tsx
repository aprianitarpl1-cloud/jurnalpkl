
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MasukPage() {
  const router = useRouter();

  const [kode, setKode] = useState("");
  const [password, setPassword] = useState("");
  const [pesan, setPesan] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleMasuk(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setPesan("");

    try {
      const response = await fetch("/api/masuk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kode, password }),
      });

      const hasil = await response.json();

      if (!response.ok) {
        setPesan(hasil.message || "Login gagal.");
        return;
      }

      router.replace("/jurnal");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);
      setPesan("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <div className="mb-4 text-5xl">📘</div>

          <h1 className="text-2xl font-bold text-blue-700">
            Jurnal PKL
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Masuk menggunakan kode siswa dan password untuk mengakses jurnal PKL.
          </p>
        </div>

        <form onSubmit={handleMasuk} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Kode Siswa
            </label>

            <input
              type="text"
              value={kode}
              onChange={(e) => setKode(e.target.value)}
              placeholder="Masukkan kode siswa"
              required
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              disabled={loading}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          {pesan && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {pesan}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="mt-8 border-t pt-5 text-center text-xs text-slate-400">
          © 2026 Jurnal PKL
        </div>
      </div>
    </main>
  );
}
