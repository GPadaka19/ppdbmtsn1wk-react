# API Endpoints untuk Data Wilayah

Dokumentasi ini menjelaskan endpoint API yang diperlukan untuk mendukung dropdown wilayah (provinsi, kota, kecamatan, kelurahan) di frontend.

## Database Schema

Pastikan database PostgreSQL memiliki tabel berikut:

```sql
-- Tabel Provinsi
CREATE TABLE provinsi (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kode VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Kota/Kabupaten
CREATE TABLE kota (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kode VARCHAR(10) UNIQUE NOT NULL,
    provinsi_id INTEGER REFERENCES provinsi(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Kecamatan
CREATE TABLE kecamatan (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kode VARCHAR(10) UNIQUE NOT NULL,
    kota_id INTEGER REFERENCES kota(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Kelurahan/Desa
CREATE TABLE kelurahan (
    id SERIAL PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    kode VARCHAR(10) UNIQUE NOT NULL,
    kecamatan_id INTEGER REFERENCES kecamatan(id) ON DELETE CASCADE,
    kode_pos VARCHAR(5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index untuk performa
CREATE INDEX idx_kota_provinsi_id ON kota(provinsi_id);
CREATE INDEX idx_kecamatan_kota_id ON kecamatan(kota_id);
CREATE INDEX idx_kelurahan_kecamatan_id ON kelurahan(kecamatan_id);
```

## API Endpoints

### 1. Get All Provinsi
```
GET /api/wilayah/provinsi
```

**Response:**
```json
[
  {
    "id": 1,
    "nama": "DKI Jakarta",
    "kode": "31"
  },
  {
    "id": 2,
    "nama": "Jawa Barat",
    "kode": "32"
  }
]
```

### 2. Get Kota by Provinsi
```
GET /api/wilayah/kota?provinsi_id={provinsi_id}
```

**Parameters:**
- `provinsi_id` (required): ID provinsi

**Response:**
```json
[
  {
    "id": 1,
    "nama": "Jakarta Selatan",
    "kode": "3171",
    "provinsi_id": 1
  },
  {
    "id": 2,
    "nama": "Jakarta Pusat",
    "kode": "3172",
    "provinsi_id": 1
  }
]
```

### 3. Get Kecamatan by Kota
```
GET /api/wilayah/kecamatan?kota_id={kota_id}
```

**Parameters:**
- `kota_id` (required): ID kota

**Response:**
```json
[
  {
    "id": 1,
    "nama": "Kebayoran Baru",
    "kode": "317106",
    "kota_id": 1
  },
  {
    "id": 2,
    "nama": "Kebayoran Lama",
    "kode": "317107",
    "kota_id": 1
  }
]
```

### 4. Get Kelurahan by Kecamatan
```
GET /api/wilayah/kelurahan?kecamatan_id={kecamatan_id}
```

**Parameters:**
- `kecamatan_id` (required): ID kecamatan

**Response:**
```json
[
  {
    "id": 1,
    "nama": "Kramat Pela",
    "kode": "3171061001",
    "kecamatan_id": 1
  },
  {
    "id": 2,
    "nama": "Gandaria Selatan",
    "kode": "3171061002",
    "kecamatan_id": 1
  }
]
```

### 5. Get Kode Pos by Kelurahan
```
GET /api/wilayah/kode-pos?kelurahan_id={kelurahan_id}
```

**Parameters:**
- `kelurahan_id` (required): ID kelurahan

**Response:**
```json
{
  "kode_pos": "12110"
}
```

## Contoh Implementasi Backend (Node.js/Express)

```javascript
const express = require('express');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
  // Konfigurasi database PostgreSQL
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Get all provinsi
router.get('/provinsi', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nama, kode FROM provinsi ORDER BY nama');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching provinsi:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get kota by provinsi
router.get('/kota', async (req, res) => {
  try {
    const { provinsi_id } = req.query;
    if (!provinsi_id) {
      return res.status(400).json({ error: 'provinsi_id is required' });
    }
    
    const result = await pool.query(
      'SELECT id, nama, kode, provinsi_id FROM kota WHERE provinsi_id = $1 ORDER BY nama',
      [provinsi_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching kota:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get kecamatan by kota
router.get('/kecamatan', async (req, res) => {
  try {
    const { kota_id } = req.query;
    if (!kota_id) {
      return res.status(400).json({ error: 'kota_id is required' });
    }
    
    const result = await pool.query(
      'SELECT id, nama, kode, kota_id FROM kecamatan WHERE kota_id = $1 ORDER BY nama',
      [kota_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching kecamatan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get kelurahan by kecamatan
router.get('/kelurahan', async (req, res) => {
  try {
    const { kecamatan_id } = req.query;
    if (!kecamatan_id) {
      return res.status(400).json({ error: 'kecamatan_id is required' });
    }
    
    const result = await pool.query(
      'SELECT id, nama, kode, kecamatan_id FROM kelurahan WHERE kecamatan_id = $1 ORDER BY nama',
      [kecamatan_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching kelurahan:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get kode pos by kelurahan
router.get('/kode-pos', async (req, res) => {
  try {
    const { kelurahan_id } = req.query;
    if (!kelurahan_id) {
      return res.status(400).json({ error: 'kelurahan_id is required' });
    }
    
    const result = await pool.query(
      'SELECT kode_pos FROM kelurahan WHERE id = $1',
      [kelurahan_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kelurahan not found' });
    }
    
    res.json({ kode_pos: result.rows[0].kode_pos });
  } catch (error) {
    console.error('Error fetching kode pos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
```

## Data Sample

Untuk testing, Anda bisa menggunakan data sample berikut:

```sql
-- Insert sample data
INSERT INTO provinsi (nama, kode) VALUES 
('DKI Jakarta', '31'),
('Jawa Barat', '32'),
('Jawa Tengah', '33');

INSERT INTO kota (nama, kode, provinsi_id) VALUES 
('Jakarta Selatan', '3171', 1),
('Jakarta Pusat', '3172', 1),
('Bandung', '3273', 2);

INSERT INTO kecamatan (nama, kode, kota_id) VALUES 
('Kebayoran Baru', '317106', 1),
('Kebayoran Lama', '317107', 1),
('Coblong', '327301', 3);

INSERT INTO kelurahan (nama, kode, kecamatan_id, kode_pos) VALUES 
('Kramat Pela', '3171061001', 1, '12110'),
('Gandaria Selatan', '3171061002', 1, '12120'),
('Dago', '3273011001', 3, '40115');
```

## Error Handling

Semua endpoint harus menangani error dengan baik:

- **400 Bad Request**: Parameter yang diperlukan tidak ada atau tidak valid
- **404 Not Found**: Data tidak ditemukan
- **500 Internal Server Error**: Error server atau database

## Caching (Opsional)

Untuk performa yang lebih baik, pertimbangkan untuk menggunakan caching:

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // Cache 1 jam

// Contoh dengan caching
router.get('/provinsi', async (req, res) => {
  try {
    const cacheKey = 'provinsi_list';
    let provinsi = cache.get(cacheKey);
    
    if (!provinsi) {
      const result = await pool.query('SELECT id, nama, kode FROM provinsi ORDER BY nama');
      provinsi = result.rows;
      cache.set(cacheKey, provinsi);
    }
    
    res.json(provinsi);
  } catch (error) {
    console.error('Error fetching provinsi:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```
