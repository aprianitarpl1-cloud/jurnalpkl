
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div>
            <h1 className="text-xl font-bold text-blue-700">
              Jurnal PKL
            </h1>
            <p className="text-xs text-slate-500">
              Praktik Kerja Lapangan
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/masuk"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Masuk Siswa
            </Link>

            <Link
              href="/login"
              className="rounded-lg border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Login Admin
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-10 md:grid-cols-2">
        <div>
          <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
            Aplikasi Pencatatan Kegiatan PKL
          </span>

          <h2 className="mt-5 text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl">
            Catat Kegiatan PKL
            <span className="block text-blue-600">
              Lebih Mudah!
            </span>
          </h2>

          <p className="mt-4 max-w-lg leading-7 text-slate-600">
            Aplikasi Jurnal PKL membantu siswa mencatat kegiatan
            harian, mengelola laporan praktik kerja, dan memantau
            hasil pemeriksaan jurnal dari pembimbing.
          </p>

          <p className="mt-3 text-sm text-slate-500">
            Silakan pilih menu masuk di bagian atas untuk menggunakan
            aplikasi.
          </p>
        </div>

        {/* Ilustrasi Jurnal */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-7 shadow-xl">
          <div className="rounded-2xl bg-white p-5 text-slate-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Jurnal Harian
                </p>
                <h3 className="mt-1 text-xl font-bold">
                  Kegiatan PKL
                </h3>
              </div>

              <div className="rounded-xl bg-blue-100 p-3 text-2xl">
                📝
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="font-semibold">Catatan Kegiatan</p>
              <p className="mt-1 text-sm text-slate-500">
                Simpan aktivitas Praktik Kerja Lapangan setiap hari.
              </p>
            </div>

            <div className="mt-3 rounded-xl bg-green-50 p-4">
              <p className="font-semibold text-green-700">
                ✓ Jurnal Tersimpan
              </p>
              <p className="mt-1 text-sm text-green-600">
                Kegiatan berhasil dicatat.
              </p>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl border p-4">
              <span className="text-sm font-semibold">
                Status Jurnal
              </span>
              <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                Menunggu
              </span>
            </div>
          </div>

          <p className="mt-4 text-center text-sm text-blue-100">
            Praktis, rapi, dan mudah digunakan.
          </p>
        </div>
      </section>

      {/* Fitur Aplikasi */}
      <section className="bg-white px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Fitur Aplikasi
            </h2>
            <p className="mt-2 text-slate-500">
              Memudahkan siswa mengelola kegiatan PKL.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📝
              </div>
              <h3 className="mt-3 font-bold">
                Catat Kegiatan
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Simpan kegiatan PKL setiap hari dengan mudah.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-2xl">
                📚
              </div>
              <h3 className="mt-3 font-bold">
                Kelola Jurnal
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Lihat dan perbarui catatan kegiatan yang sudah dibuat.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-2xl">
                📊
              </div>
              <h3 className="mt-3 font-bold">
                Pantau Status
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Lihat hasil pemeriksaan jurnal dari pembimbing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 px-5 py-4 text-center">
        <p className="text-sm text-slate-500">
          © 2026 Jurnal PKL. Aplikasi Praktik Kerja Lapangan.
        </p>
      </footer>
    </main>
  );
}
