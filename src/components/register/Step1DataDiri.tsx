import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PendaftaranData } from '@/services/pendaftaranService';

const schema = z.object({
  nisn: z.string().min(10, 'NISN harus 10 digit').max(10, 'NISN harus 10 digit'),
  nik: z.string().min(16, 'NIK harus 16 digit').max(16, 'NIK harus 16 digit'),
  nama_lengkap: z.string().min(3, 'Nama minimal 3 karakter'),
  tempat_lahir: z.string().min(2, 'Tempat lahir minimal 2 karakter'),
  tanggal_lahir: z.string().min(1, 'Tanggal lahir wajib diisi'),
  jenis_kelamin: z.enum(['L', 'P'], { required_error: 'Jenis kelamin wajib dipilih' }),
  agama: z.string().min(1, 'Agama wajib dipilih'),
  anak_ke: z.coerce.number().min(1, 'Anak ke minimal 1'),
  jumlah_saudara: z.coerce.number().min(0, 'Jumlah saudara minimal 0'),
});

type FormData = z.infer<typeof schema>;

interface Props {
  data: Partial<PendaftaranData>;
  onNext: (data: Partial<PendaftaranData>) => void;
  onPrev: () => void;
}

const Step1DataDiri = ({ data, onNext }: Props) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: data as FormData,
  });

  const onSubmit = (formData: FormData) => {
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nisn">NISN *</Label>
          <Input id="nisn" {...register('nisn')} placeholder="1234567890" />
          {errors.nisn && <p className="text-sm text-destructive mt-1">{errors.nisn.message}</p>}
        </div>
        <div>
          <Label htmlFor="nik">NIK *</Label>
          <Input id="nik" {...register('nik')} placeholder="3201234567890123" />
          {errors.nik && <p className="text-sm text-destructive mt-1">{errors.nik.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="nama_lengkap">Nama Lengkap *</Label>
        <Input id="nama_lengkap" {...register('nama_lengkap')} />
        {errors.nama_lengkap && <p className="text-sm text-destructive mt-1">{errors.nama_lengkap.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tempat_lahir">Tempat Lahir *</Label>
          <Input id="tempat_lahir" {...register('tempat_lahir')} />
          {errors.tempat_lahir && <p className="text-sm text-destructive mt-1">{errors.tempat_lahir.message}</p>}
        </div>
        <div>
          <Label htmlFor="tanggal_lahir">Tanggal Lahir *</Label>
          <Input id="tanggal_lahir" type="date" {...register('tanggal_lahir')} />
          {errors.tanggal_lahir && <p className="text-sm text-destructive mt-1">{errors.tanggal_lahir.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="jenis_kelamin">Jenis Kelamin *</Label>
          <Select onValueChange={(value) => setValue('jenis_kelamin', value as 'L' | 'P')} defaultValue={data.jenis_kelamin}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="L">Laki-laki</SelectItem>
              <SelectItem value="P">Perempuan</SelectItem>
            </SelectContent>
          </Select>
          {errors.jenis_kelamin && <p className="text-sm text-destructive mt-1">{errors.jenis_kelamin.message}</p>}
        </div>
        <div>
          <Label htmlFor="agama">Agama *</Label>
          <Select onValueChange={(value) => setValue('agama', value)} defaultValue={data.agama}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Islam">Islam</SelectItem>
              <SelectItem value="Kristen">Kristen</SelectItem>
              <SelectItem value="Katolik">Katolik</SelectItem>
              <SelectItem value="Hindu">Hindu</SelectItem>
              <SelectItem value="Buddha">Buddha</SelectItem>
              <SelectItem value="Konghucu">Konghucu</SelectItem>
            </SelectContent>
          </Select>
          {errors.agama && <p className="text-sm text-destructive mt-1">{errors.agama.message}</p>}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="anak_ke">Anak Ke- *</Label>
          <Input id="anak_ke" type="number" {...register('anak_ke')} />
          {errors.anak_ke && <p className="text-sm text-destructive mt-1">{errors.anak_ke.message}</p>}
        </div>
        <div>
          <Label htmlFor="jumlah_saudara">Jumlah Saudara *</Label>
          <Input id="jumlah_saudara" type="number" {...register('jumlah_saudara')} />
          {errors.jumlah_saudara && <p className="text-sm text-destructive mt-1">{errors.jumlah_saudara.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="btn-primary">Selanjutnya</Button>
      </div>
    </form>
  );
};

export default Step1DataDiri;
