import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { PendaftaranData } from '@/services/pendaftaranService';
import { UploadCloud } from 'lucide-react';

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
}

const Step5Berkas = ({ data, onNext, onPrev }: Props) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Partial<PendaftaranData>>({
    defaultValues: {
    }
  });

  const handleFileChange = (key: keyof PendaftaranData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue(key, file);
    }
  };

  const onSubmit = (formData: Partial<PendaftaranData>) => {
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
  <Card>
    <CardContent className="pt-6">
      <Label htmlFor={id} className="mb-2 block">{label}</Label>
      <Input 
        id={id} 
        type="file" 
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={onChange}
        className="cursor-pointer file:text-primary file:font-medium"
      />
    </CardContent>
  </Card>
);

export default Step5Berkas;