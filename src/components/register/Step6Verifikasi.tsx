import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { PendaftaranData, pendaftaranService, RegisterResponse } from '@/services/pendaftaranService';
import { pendaftaranStorage, clearAllDrafts } from '@/utils/pendaftaranStorage';

interface Props {
  data: Partial<PendaftaranData>;
  onPrev: () => void;
  onSubmitSuccess: (noPendaftaran: string) => void;
}

const Step6Verifikasi = ({ data, onPrev, onSubmitSuccess }: Props) => {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allData, setAllData] = useState<Partial<PendaftaranData>>({});

  useEffect(() => {
    // Ambil semua data (termasuk file) dari localStorage/state
    const storedData = pendaftaranStorage.getData();
    setAllData(storedData);
  }, []);

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!agreed) {
      toast.error('Harap setujui pernyataan terlebih dahulu');
      return;
    }

    setIsLoading(true);
    
    // Alur Baru: 2 Langkah (Register Teks -> Upload File)
    try {
      // 1. REQUEST PERTAMA: Register Data Teks
      // Kita pisahkan data File dari data Teks sebelum mengirim
      const { foto, akta, ijazah, kk, ktp, surat, ...textData } = allData;
      
      const registerResponse: RegisterResponse = await pendaftaranService.submitPendaftaran(textData as PendaftaranData);
      
      // Ambil ID siswa dari respons (ini WAJIB ada dari backend)
      const siswaId = registerResponse.id; 
      const noPendaftaran = registerResponse.no_pendaftaran;

      if (!siswaId) {
        throw new Error("Respons registrasi tidak mengembalikan 'id' siswa.");
      }

      // 2. REQUEST KEDUA: Upload Berkas (Gunakan siswaId)
      // Kumpulkan file yang ada
      const filesToUpload: Partial<PendaftaranData> = {
          foto: allData.foto,
          akta: allData.akta,
          ijazah: allData.ijazah,
          kk: allData.kk,
          ktp: allData.ktp,
          surat: allData.surat
      };

      // Cek apakah ada file yang akan diupload
      const hasFiles = Object.values(filesToUpload).some(file => file);

      if (hasFiles) {
        try {
          await pendaftaranService.uploadBerkas(siswaId, filesToUpload);
        } catch (uploadErr) {
          console.error("Gagal upload berkas:", uploadErr);
          // Pendaftaran berhasil, tapi upload gagal. Beri tahu user.
          toast.warning("Pendaftaran berhasil, namun beberapa berkas gagal diunggah. Silakan upload ulang di Dashboard Siswa.");
        }
      }
      
      // 3. Sukses Total
      clearAllDrafts(); // Hapus draf dari localStorage
      onSubmitSuccess(noPendaftaran); // Pindah ke halaman sukses

    } catch (error: any) {
      console.error("Gagal mendaftar:", error);
      toast.error('Gagal melakukan pendaftaran', {
        description: error.response?.data?.error || error.message || "Terjadi kesalahan server.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Sisa JSX (Review Data) tidak berubah ---
  // ... (Salin-tempel sisa JSX Anda dari file asli) ...
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Ringkasan Data</h3>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-primary">Data Pribadi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Nama Lengkap:</span>
                <span className="font-medium">{allData.nama_lengkap || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">NISN:</span>
                <span className="font-medium">{allData.nisn || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">NIK:</span>
                <span className="font-medium">{allData.nik || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Tempat Lahir:</span>
                <span className="font-medium">{allData.tempat_lahir || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Tanggal Lahir:</span>
                <span className="font-medium">{allData.tanggal_lahir || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Jenis Kelamin:</span>
                <span className="font-medium">{allData.jenis_kelamin === 'L' ? 'Laki-laki' : allData.jenis_kelamin === 'P' ? 'Perempuan' : '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-primary">Data Alamat</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Alamat:</span>
                <span className="font-medium">{allData.alamat || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">RT/RW:</span>
                <span className="font-medium">{allData.rt && allData.rw ? `${allData.rt}/${allData.rw}` : '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Provinsi:</span>
                <span className="font-medium">{allData.provinsi || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Kota/Kabupaten:</span>
                <span className="font-medium">{allData.kabupaten || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Kecamatan:</span>
                <span className="font-medium">{allData.kecamatan || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Kelurahan/Desa:</span>
                <span className="font-medium">{allData.desa || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Kode Pos:</span>
                <span className="font-medium">{allData.kode_pos || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">No HP:</span>
                <span className="font-medium">{allData.no_hp || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{allData.email || '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-primary">Data Asal Sekolah</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Nama Sekolah:</span>
                <span className="font-medium">{allData.asal_sekolah || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">NPSN:</span>
                <span className="font-medium">{allData.npsn_sekolah || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Tahun Lulus:</span>
                <span className="font-medium">{allData.tahun_lulus || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">No Ijazah:</span>
                <span className="font-medium">{allData.no_ijazah || '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-primary">Data Orang Tua</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Nama Ayah:</span>
                <span className="font-medium">{allData.nama_ayah || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Nama Ibu:</span>
                <span className="font-medium">{allData.nama_ibu || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Pekerjaan Ayah:</span>
                <span className="font-medium">{allData.pekerjaan_ayah || '-'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="text-muted-foreground">Pekerjaan Ibu:</span>
                <span className="font-medium">{allData.pekerjaan_ibu || '-'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-primary">Berkas Terpilih</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
                <li>Pas Foto: {allData.foto?.name || 'Tidak ada'}</li>
                <li>Akta Kelahiran: {allData.akta?.name || 'Tidak ada'}</li>
                <li>Ijazah / SKL: {allData.ijazah?.name || 'Tidak ada'}</li>
                <li>Kartu Keluarga: {allData.kk?.name || 'Tidak ada'}</li>
                <li>KTP Ortu: {allData.ktp?.name || 'Tidak ada'}</li>
                <li>Surat Pernyataan: {allData.surat?.name || 'Tidak ada'}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start gap-3 p-4 border border-border rounded-lg">
        <Checkbox id="agree" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
        <label htmlFor="agree" className="text-sm cursor-pointer leading-relaxed">
          Saya menyatakan bahwa data yang saya isikan adalah benar dan dapat dipertanggungjawabkan. 
          Apabila dikemudian hari terbukti data yang saya isikan tidak benar, saya bersedia menerima sanksi 
          sesuai ketentuan yang berlaku.
        </label>
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev} disabled={isLoading}>
          Kembali
        </Button>
        <Button type="button" onClick={(e) => handleSubmit(e)} className="btn-primary" disabled={isLoading || !agreed}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Pendaftaran
        </Button>
      </div>
    </div>
  );
};

export default Step6Verifikasi;