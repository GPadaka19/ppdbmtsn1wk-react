# Arsitektur Sistem Dropdown Wilayah

## Diagram Arsitektur

```mermaid
graph TB
    subgraph "Frontend (React + TypeScript)"
        A[Step2Alamat Form] --> B[WilayahDropdown Component]
        B --> C[wilayahService]
        C --> D[API Client (Axios)]
    end
    
    subgraph "Backend API"
        D --> E[Express.js Router]
        E --> F[Provinsi Controller]
        E --> G[Kota Controller]
        E --> H[Kecamatan Controller]
        E --> I[Kelurahan Controller]
        E --> J[Kode Pos Controller]
    end
    
    subgraph "Database (PostgreSQL)"
        F --> K[provinsi table]
        G --> L[kota table]
        H --> M[kecamatan table]
        I --> N[kelurahan table]
        J --> N
    end
    
    subgraph "Data Flow"
        O[User selects Provinsi] --> P[Load Kota by provinsi_id]
        P --> Q[User selects Kota]
        Q --> R[Load Kecamatan by kota_id]
        R --> S[User selects Kecamatan]
        S --> T[Load Kelurahan by kecamatan_id]
        T --> U[User selects Kelurahan]
        U --> V[Auto-fill Kode Pos]
    end
```

## Komponen Utama

### 1. Frontend Components

#### `WilayahDropdown.tsx`
- **Fungsi**: Komponen utama dropdown cascade
- **Props**: 
  - `onProvinsiChange`: Callback saat provinsi berubah
  - `onKotaChange`: Callback saat kota berubah
  - `onKecamatanChange`: Callback saat kecamatan berubah
  - `onKelurahanChange`: Callback saat kelurahan berubah
  - `onKodePosChange`: Callback saat kode pos berubah
- **State Management**: Mengelola loading state dan data dropdown

#### `wilayahService.ts`
- **Fungsi**: Service layer untuk komunikasi dengan API
- **Methods**:
  - `getProvinsi()`: Ambil semua provinsi
  - `getKota(provinsiId)`: Ambil kota berdasarkan provinsi
  - `getKecamatan(kotaId)`: Ambil kecamatan berdasarkan kota
  - `getKelurahan(kecamatanId)`: Ambil kelurahan berdasarkan kecamatan
  - `getKodePos(kelurahanId)`: Ambil kode pos berdasarkan kelurahan

### 2. Backend API

#### Endpoints
- `GET /api/wilayah/provinsi` - Daftar provinsi
- `GET /api/wilayah/kota?provinsi_id={id}` - Daftar kota
- `GET /api/wilayah/kecamatan?kota_id={id}` - Daftar kecamatan
- `GET /api/wilayah/kelurahan?kecamatan_id={id}` - Daftar kelurahan
- `GET /api/wilayah/kode-pos?kelurahan_id={id}` - Kode pos

### 3. Database Schema

#### Tabel `provinsi`
```sql
id (SERIAL PRIMARY KEY)
nama (VARCHAR(100))
kode (VARCHAR(10))
```

#### Tabel `kota`
```sql
id (SERIAL PRIMARY KEY)
nama (VARCHAR(100))
kode (VARCHAR(10))
provinsi_id (INTEGER REFERENCES provinsi(id))
```

#### Tabel `kecamatan`
```sql
id (SERIAL PRIMARY KEY)
nama (VARCHAR(100))
kode (VARCHAR(10))
kota_id (INTEGER REFERENCES kota(id))
```

#### Tabel `kelurahan`
```sql
id (SERIAL PRIMARY KEY)
nama (VARCHAR(100))
kode (VARCHAR(10))
kecamatan_id (INTEGER REFERENCES kecamatan(id))
kode_pos (VARCHAR(5))
```

## Flow Data

### 1. Inisialisasi
1. Component mount
2. Load provinsi dari API
3. Tampilkan dropdown provinsi

### 2. Cascade Selection
1. User pilih provinsi
2. Load kota berdasarkan provinsi_id
3. Reset dropdown kota, kecamatan, kelurahan
4. User pilih kota
5. Load kecamatan berdasarkan kota_id
6. Reset dropdown kecamatan, kelurahan
7. User pilih kecamatan
8. Load kelurahan berdasarkan kecamatan_id
9. Reset dropdown kelurahan
10. User pilih kelurahan
11. Auto-fill kode pos

### 3. Error Handling
- Network error: Log error, tampilkan pesan
- Empty data: Tampilkan dropdown kosong
- Loading state: Tampilkan "Memuat..."

## Keunggulan Arsitektur

### 1. Separation of Concerns
- **UI Layer**: WilayahDropdown component
- **Service Layer**: wilayahService
- **API Layer**: Backend endpoints
- **Data Layer**: PostgreSQL database

### 2. Reusability
- Komponen dapat digunakan di form lain
- Service dapat digunakan di komponen lain
- API dapat digunakan oleh aplikasi lain

### 3. Maintainability
- Kode terstruktur dan mudah dipahami
- Error handling terpusat
- Type safety dengan TypeScript

### 4. Performance
- Lazy loading data
- Caching di backend (opsional)
- Minimal re-render dengan proper state management

### 5. User Experience
- Loading state yang jelas
- Cascade selection yang smooth
- Auto-fill kode pos
- Responsive design

## Security Considerations

### 1. Input Validation
- Validasi semua parameter di backend
- Sanitasi input untuk mencegah XSS
- Rate limiting untuk mencegah abuse

### 2. Database Security
- Prepared statements untuk mencegah SQL injection
- Proper indexing untuk performa
- Access control yang ketat

### 3. API Security
- CORS configuration
- Authentication jika diperlukan
- Request validation

## Monitoring & Logging

### 1. Frontend
- Console logging untuk debugging
- Error boundaries untuk error handling
- Performance monitoring

### 2. Backend
- Request/response logging
- Error logging dengan stack trace
- Performance metrics
- Database query monitoring

## Deployment Considerations

### 1. Frontend
- Build optimization
- CDN untuk static assets
- Environment variables untuk API URL

### 2. Backend
- Database connection pooling
- Load balancing
- Health checks
- Graceful shutdown

### 3. Database
- Backup strategy
- Replication untuk high availability
- Monitoring dan alerting
