import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
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
      toast.warning("Peringatan", {
        description: "Harap setujui pernyataan terlebih dahulu.",
      });
      return;
    }
    
    setIsLoading(true);
    await onSubmitSuccess();
    setIsLoading(false);
  };

  const renderFile = (file: any) => {
    if (file && file instanceof File) {
      return (
        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-2 py-1 rounded border border-green-200 w-fit">
            <FileText className="w-3 h-3" />
            <span className="font-medium truncate max-w-[200px]">{file.name}</span>
            <span className="text-xs text-green-600">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
        </div>
      );
    }
    return <span className="text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Belum dipilih</span>;
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
                <h4 className="font-semibold mb-3 text-primary">Asal Sekolah</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Nama Sekolah:</span><span className="font-medium">{data.asal_sekolah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">NPSN:</span><span className="font-medium">{data.npsn_sekolah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Alamat Sekolah:</span><span className="font-medium">{data.alamat_sekolah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Tahun Lulus:</span><span className="font-medium">{data.tahun_lulus || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">No. Ijazah:</span><span className="font-medium">{data.no_ijazah || '-'}</span></div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardContent className="p-4">
                <h4 className="font-semibold mb-3 text-primary">Data Orang Tua</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Nama Ayah:</span><span className="font-medium">{data.nama_ayah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">NIK Ayah:</span><span className="font-medium">{data.nik_ayah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Pekerjaan Ayah:</span><span className="font-medium">{data.pekerjaan_ayah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Penghasilan Ayah:</span><span className="font-medium">{data.penghasilan_ayah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Pendidikan Ayah:</span><span className="font-medium">{data.pendidikan_ayah || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">No. HP Ayah:</span><span className="font-medium">{data.no_hp_ayah || '-'}</span></div>
                    
                    <div className="grid grid-cols-2 md:col-span-2 my-2 border-t border-dashed"></div>

                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Nama Ibu:</span><span className="font-medium">{data.nama_ibu || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">NIK Ibu:</span><span className="font-medium">{data.nik_ibu || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Pekerjaan Ibu:</span><span className="font-medium">{data.pekerjaan_ibu || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Penghasilan Ibu:</span><span className="font-medium">{data.penghasilan_ibu || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">Pendidikan Ibu:</span><span className="font-medium">{data.pendidikan_ibu || '-'}</span></div>
                    <div className="grid grid-cols-2"><span className="text-muted-foreground">No. HP Ibu:</span><span className="font-medium">{data.no_hp_ibu || '-'}</span></div>
                </div>
            </CardContent>
        </Card>

        {/* 5. BERKAS (MODIFIED: Show Filename) */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3 text-primary">Berkas yang akan diupload</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
                <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground w-32">Pas Foto:</span> 
                    {renderFile(data.foto)}
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground w-32">Akta Kelahiran:</span> 
                    {renderFile(data.akta)}
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground w-32">Ijazah/SKL:</span> 
                    {renderFile(data.ijazah)}
                </div>
                <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-muted-foreground w-32">Kartu Keluarga:</span> 
                    {renderFile(data.kk)}
                </div>
                <div className="flex items-center justify-between pt-2">
                    <span className="text-muted-foreground w-32">KTP Orang Tua:</span> 
                    {renderFile(data.ktp)}
                </div>
            </div>
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