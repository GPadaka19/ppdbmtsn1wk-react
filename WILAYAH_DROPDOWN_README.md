# Sistem Dropdown Wilayah Indonesia

Sistem ini menyediakan dropdown cascade untuk memilih provinsi, kota/kabupaten, kecamatan, dan kelurahan/desa di Indonesia dengan integrasi database PostgreSQL.

## Fitur

- ✅ Dropdown cascade (provinsi → kota → kecamatan → kelurahan)
- ✅ Auto-populate kode pos berdasarkan kelurahan
- ✅ Loading state untuk setiap dropdown
- ✅ Validasi form terintegrasi
- ✅ TypeScript support
- ✅ Responsive design
- ✅ Error handling

## Komponen yang Dibuat

### 1. `wilayahService.ts`
Service untuk mengakses data wilayah dari API backend.

```typescript
import { wilayahService } from '@/services/wilayahService';

// Mendapatkan semua provinsi
const provinsi = await wilayahService.getProvinsi();

// Mendapatkan kota berdasarkan provinsi
const kota = await wilayahService.getKota(provinsiId);

// Mendapatkan kecamatan berdasarkan kota
const kecamatan = await wilayahService.getKecamatan(kotaId);

// Mendapatkan kelurahan berdasarkan kecamatan
const kelurahan = await wilayahService.getKelurahan(kecamatanId);

// Mendapatkan kode pos berdasarkan kelurahan
const kodePos = await wilayahService.getKodePos(kelurahanId);
```

### 2. `WilayahDropdown` Component
Komponen utama untuk dropdown wilayah.

```tsx
import WilayahDropdown from '@/components/ui/wilayah-dropdown';

<WilayahDropdown
  onProvinsiChange={(provinsi) => console.log('Provinsi:', provinsi)}
  onKotaChange={(kota) => console.log('Kota:', kota)}
  onKecamatanChange={(kecamatan) => console.log('Kecamatan:', kecamatan)}
  onKelurahanChange={(kelurahan) => console.log('Kelurahan:', kelurahan)}
  onKodePosChange={(kodePos) => console.log('Kode Pos:', kodePos)}
  defaultValues={{
    provinsi: 'DKI Jakarta',
    kota: 'Jakarta Selatan'
  }}
  disabled={false}
/>
```

### 3. Integrasi dengan Form
Sudah terintegrasi dengan form registrasi `Step2Alamat.tsx`.

## Setup Backend

### 1. Database Schema
Buat tabel di PostgreSQL sesuai dengan schema di `API_WILAYAH_ENDPOINTS.md`.

### 2. API Endpoints
Implementasikan endpoint API sesuai dokumentasi:

- `GET /api/wilayah/provinsi` - Mendapatkan semua provinsi
- `GET /api/wilayah/kota?provinsi_id={id}` - Mendapatkan kota berdasarkan provinsi
- `GET /api/wilayah/kecamatan?kota_id={id}` - Mendapatkan kecamatan berdasarkan kota
- `GET /api/wilayah/kelurahan?kecamatan_id={id}` - Mendapatkan kelurahan berdasarkan kecamatan
- `GET /api/wilayah/kode-pos?kelurahan_id={id}` - Mendapatkan kode pos berdasarkan kelurahan

### 3. Environment Variables
Pastikan environment variable `VITE_API_URL` sudah diset di file `.env`:

```env
VITE_API_URL=http://localhost:8080/api
```

## Cara Penggunaan

### 1. Import Komponen
```tsx
import WilayahDropdown from '@/components/ui/wilayah-dropdown';
import { Provinsi, Kota, Kecamatan, Kelurahan } from '@/services/wilayahService';
```

### 2. Setup State Management
```tsx
const [selectedProvinsi, setSelectedProvinsi] = useState<Provinsi | null>(null);
const [selectedKota, setSelectedKota] = useState<Kota | null>(null);
const [selectedKecamatan, setSelectedKecamatan] = useState<Kecamatan | null>(null);
const [selectedKelurahan, setSelectedKelurahan] = useState<Kelurahan | null>(null);
const [kodePos, setKodePos] = useState<string>('');
```

### 3. Handler Functions
```tsx
const handleProvinsiChange = (provinsi: Provinsi | null) => {
  setSelectedProvinsi(provinsi);
  // Reset dependent selections
  setSelectedKota(null);
  setSelectedKecamatan(null);
  setSelectedKelurahan(null);
  setKodePos('');
};

const handleKotaChange = (kota: Kota | null) => {
  setSelectedKota(kota);
  // Reset dependent selections
  setSelectedKecamatan(null);
  setSelectedKelurahan(null);
  setKodePos('');
};

const handleKecamatanChange = (kecamatan: Kecamatan | null) => {
  setSelectedKecamatan(kecamatan);
  // Reset dependent selections
  setSelectedKelurahan(null);
  setKodePos('');
};

const handleKelurahanChange = (kelurahan: Kelurahan | null) => {
  setSelectedKelurahan(kelurahan);
};

const handleKodePosChange = (kodePos: string) => {
  setKodePos(kodePos);
};
```

### 4. Render Komponen
```tsx
<WilayahDropdown
  onProvinsiChange={handleProvinsiChange}
  onKotaChange={handleKotaChange}
  onKecamatanChange={handleKecamatanChange}
  onKelurahanChange={handleKelurahanChange}
  onKodePosChange={handleKodePosChange}
/>
```

## Testing

### 1. Komponen Test
Gunakan komponen `WilayahTest` untuk testing:

```tsx
import WilayahTest from '@/components/ui/wilayah-test';

// Di halaman testing
<WilayahTest />
```

### 2. Manual Testing
1. Buka halaman yang menggunakan dropdown wilayah
2. Pilih provinsi → dropdown kota akan terisi
3. Pilih kota → dropdown kecamatan akan terisi
4. Pilih kecamatan → dropdown kelurahan akan terisi
5. Pilih kelurahan → kode pos akan terisi otomatis

## Error Handling

Sistem ini menangani error dengan cara:

1. **Network Error**: Menampilkan pesan error di console
2. **Empty Data**: Dropdown akan kosong jika tidak ada data
3. **Loading State**: Menampilkan "Memuat..." saat loading
4. **Disabled State**: Dropdown akan disabled jika parent belum dipilih

## Styling

Komponen menggunakan Tailwind CSS dan shadcn/ui components. Pastikan:

1. Tailwind CSS sudah dikonfigurasi
2. shadcn/ui components sudah terinstall
3. CSS variables untuk theme sudah diset

## Troubleshooting

### 1. Dropdown tidak terisi
- Periksa koneksi ke API backend
- Pastikan endpoint API sudah benar
- Cek console untuk error messages

### 2. Loading state tidak hilang
- Periksa response API
- Pastikan data format sesuai dengan interface

### 3. Kode pos tidak terisi
- Pastikan tabel kelurahan memiliki kolom kode_pos
- Cek endpoint `/api/wilayah/kode-pos`

### 4. Styling tidak sesuai
- Pastikan Tailwind CSS sudah terinstall
- Cek import shadcn/ui components

## Data Sample

Untuk testing, gunakan data sample yang tersedia di `API_WILAYAH_ENDPOINTS.md` atau import data dari sumber resmi seperti:

- Data dari Kemendagri
- Data dari BPS
- Data dari OpenSID

## Performance Tips

1. **Caching**: Implementasikan caching di backend untuk data yang jarang berubah
2. **Lazy Loading**: Data dimuat hanya saat diperlukan
3. **Debouncing**: Untuk search functionality (jika ada)
4. **Pagination**: Untuk data yang sangat besar

## Security

1. **Input Validation**: Validasi semua input di backend
2. **SQL Injection**: Gunakan prepared statements
3. **Rate Limiting**: Implementasikan rate limiting untuk API
4. **CORS**: Konfigurasi CORS dengan benar

## Future Enhancements

1. **Search Functionality**: Tambahkan pencarian di dropdown
2. **Multi-select**: Support untuk multiple selection
3. **Geolocation**: Auto-detect lokasi user
4. **Offline Support**: Cache data untuk offline usage
5. **Internationalization**: Support untuk bahasa lain
