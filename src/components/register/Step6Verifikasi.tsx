import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
// HAPUS: import { useToast } from '@/hooks/use-toast';
// GANTI DENGAN:
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { PendaftaranData } from '@/services/pendaftaranService';

interface Props {
  data: Partial<PendaftaranData>; 
  onPrev: () => void;
  onSubmitSuccess: () => void; 
}

const Step6Verifikasi = ({ data, onPrev, onSubmitSuccess }: Props) => {
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!agreed) {
      // GANTI DENGAN SONNER:
      toast.warning("Peringatan", {
        description: "Harap setujui pernyataan terlebih dahulu.",
      });
      return;
    }
    
    setIsLoading(true);
    await onSubmitSuccess();
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-bold text-lg">Ringkasan Data</h3>
        
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-primary">Data Pribadi</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="grid grid-cols-2"><span className="text-muted-foreground">Nama Lengkap:</span><span className="font-medium">{data.nama_lengkap || '-'}</span></div>
              <div className="grid grid-cols-2"><span className="text-muted-foreground">NISN:</span><span className="font-medium">{data.nisn || '-'}</span></div>
              <div className="grid grid-cols-2"><span className="text-muted-foreground">NIK:</span><span className="font-medium">{data.nik || '-'}</span></div>
              <div className="grid grid-cols-2"><span className="text-muted-foreground">Tempat Lahir:</span><span className="font-medium">{data.tempat_lahir || '-'}</span></div>
              <div className="grid grid-cols-2"><span className="text-muted-foreground">Tanggal Lahir:</span><span className="font-medium">{data.tanggal_lahir || '-'}</span></div>
              <div className="grid grid-cols-2"><span className="text-muted-foreground">Jenis Kelamin:</span><span className="font-medium">{data.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-primary">Alamat</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Provinsi:</span><span className="font-medium">{data.provinsi || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Kabupaten:</span><span className="font-medium">{data.kabupaten || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Kecamatan:</span><span className="font-medium">{data.kecamatan || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Desa/Kel:</span><span className="font-medium">{data.desa || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Jalan:</span><span className="font-medium">{data.alamat || '-'}</span></div>
                </div>
            </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-primary">Berkas yang akan diupload</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
                <li>Pas Foto: {data.foto ? 'Terlampir (Siap Upload)' : <span className="text-red-500">Belum dipilih</span>}</li>
                <li>Akta: {data.akta ? 'Terlampir (Siap Upload)' : <span className="text-red-500">Belum dipilih</span>}</li>
                <li>Ijazah: {data.ijazah ? 'Terlampir (Siap Upload)' : <span className="text-red-500">Belum dipilih</span>}</li>
                <li>KK: {data.kk ? 'Terlampir (Siap Upload)' : <span className="text-red-500">Belum dipilih</span>}</li>
                <li>KTP Ortu: {data.ktp ? 'Terlampir (Siap Upload)' : <span className="text-red-500">Belum dipilih</span>}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-start gap-3 p-4 border border-border rounded-lg bg-muted/20">
        <Checkbox id="agree" checked={agreed} onCheckedChange={(checked) => setAgreed(checked as boolean)} />
        <label htmlFor="agree" className="text-sm cursor-pointer leading-relaxed">
          Saya menyatakan bahwa data yang saya isikan adalah benar dan dapat dipertanggungjawabkan. 
          Apabila dikemudian hari terbukti data yang saya isikan tidak benar, saya bersedia menerima sanksi 
          sesuai ketentuan yang berlaku.
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev} disabled={isLoading}>
          Kembali
        </Button>
        <Button 
          type="button" 
          onClick={handleSubmit} 
          className="btn-primary min-w-[150px]" 
          disabled={isLoading || !agreed}
        >
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Simpan Permanen
        </Button>
      </div>
    </div>
  );
};

export default Step6Verifikasi;