
type DataJurnal = {
  tanggal: string;
  kegiatan: string;
  kompetensi: string;
  durasi_jam: number;
};

export function validasiJurnal(data: DataJurnal) {
  if (!data.tanggal) {
    return {
      valid: false,
      pesan: "Tanggal harus diisi.",
    };
  }

  if (
    !data.kegiatan ||
    data.kegiatan.trim().length < 30 ||
    data.kegiatan.trim().length > 500
  ) {
    return {
      valid: false,
      pesan: "Kegiatan harus 30 sampai 500 karakter.",
    };
  }

  if (
    !data.kompetensi ||
    data.kompetensi.trim().length < 3 ||
    data.kompetensi.trim().length > 60
  ) {
    return {
      valid: false,
      pesan: "Kompetensi harus 3 sampai 60 karakter.",
    };
  }

  if (
    !Number.isInteger(data.durasi_jam) ||
    data.durasi_jam < 1 ||
    data.durasi_jam > 10
  ) {
    return {
      valid: false,
      pesan: "Durasi harus antara 1 sampai 10 jam.",
    };
  }

  return {
    valid: true,
    pesan: "",
  };
}
