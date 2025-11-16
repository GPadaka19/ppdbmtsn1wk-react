import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PendaftaranData } from '@/services/pendaftaranService';
import { UploadCloud, FileCheck, AlertCircle } from 'lucide-react';
import { toast } from 'sonner'; // Pastikan import ini ada

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
}

// Konstanta Ukuran Maksimal (2MB dalam bytes)
const MAX_FILE_SIZE = 2 * 1024 * 1024; 

const Step5Berkas = ({ data, onNext, onPrev }: Props) => {
  const { handleSubmit, setValue, watch } = useForm<Partial<PendaftaranData>>({
    defaultValues: data
  });
  
  // (Opsional) Untuk melihat file apa saja yang sudah masuk (buat validasi UI jika perlu)
  // const values = watch(); 

  const handleFileChange = (key: keyof PendaftaranData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      // --- VALIDASI UKURAN ---
      if (file.size > MAX_FILE_SIZE) {
        // 1. Beri notifikasi error
        toast.error("File Terlalu Besar", {
          description: `File "${file.name}" melebihi batas 2MB. Harap kompres file Anda.`
        });

        // 2. Reset input agar terlihat kosong kembali
        e.target.value = ''; 
        
        // 3. Hapus value di form state (jika sebelumnya ada)
        setValue(key, undefined); 
        
        return; // Berhenti di sini, jangan lanjut simpan
      }
      // -----------------------

      setValue(key, file);
      toast.success("File dipilih", {
        description: `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`
      });
    }
  };

  const onSubmit = (formData: Partial<PendaftaranData>) => {
    // Validasi akhir sebelum next (opsional, pastikan file wajib ada)
    // Contoh: if (!formData.foto) { toast.error("Foto wajib diupload"); return; }
    
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex gap-3">
          <div className="p-2 bg-blue-100 rounded-full h-fit">
            <UploadCloud className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900">Petunjuk Upload</h4>
            <p className="text-sm text-blue-700 mt-1">
              Format yang diperbolehkan: JPG, PNG, atau PDF. <br/>
              Maksimal ukuran file: 2MB per dokumen.
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FileItem label="Pas Foto (3x4)" id="foto" onChange={handleFileChange('foto')} />
        <FileItem label="Akta Kelahiran" id="akta" onChange={handleFileChange('akta')} />
        <FileItem label="Ijazah / SKL" id="ijazah" onChange={handleFileChange('ijazah')} />
        <FileItem label="Kartu Keluarga" id="kk" onChange={handleFileChange('kk')} />
        <FileItem label="KTP Orang Tua (Ayah/Ibu)" id="ktp" onChange={handleFileChange('ktp')} />
        <FileItem label="Surat Pernyataan" id="surat" onChange={handleFileChange('surat')} />
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>Kembali</Button>
        <Button type="submit" className="btn-primary">Lanjut ke Verifikasi</Button>
      </div>
    </form>
  );
};

const FileItem = ({ label, id, onChange }: { label: string, id: string, onChange: any }) => (
  <Card className="hover:border-primary/50 transition-colors">
    <CardContent className="pt-6">
      <Label htmlFor={id} className="mb-2 block font-medium text-sm text-muted-foreground">{label}</Label>
      <Input 
        id={id} 
        type="file" 
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={onChange}
        className="cursor-pointer file:text-primary file:font-medium file:bg-primary/10 file:rounded-md file:px-2 file:mr-2 hover:file:bg-primary/20 transition-all"
      />
    </CardContent>
  </Card>
);

export default Step5Berkas;