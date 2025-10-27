import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { wilayahService, Provinsi, Kota, Kecamatan, Kelurahan } from '@/services/wilayahService';

interface WilayahDropdownProps {
  onProvinsiChange?: (provinsi: Provinsi | null) => void;
  onKotaChange?: (kota: Kota | null) => void;
  onKecamatanChange?: (kecamatan: Kecamatan | null) => void;
  onKelurahanChange?: (kelurahan: Kelurahan | null) => void;
  onKodePosChange?: (kodePos: string) => void;
  defaultValues?: {
    provinsi?: string;
    kota?: string;
    kecamatan?: string;
    kelurahan?: string;
  };
  disabled?: boolean;
  // Error messages
  errorProvinsi?: string;
  errorKota?: string;
  errorKecamatan?: string;
  errorKelurahan?: string;
}

const WilayahDropdown: React.FC<WilayahDropdownProps> = ({
  onProvinsiChange,
  onKotaChange,
  onKecamatanChange,
  onKelurahanChange,
  onKodePosChange,
  defaultValues,
  disabled = false,
  errorProvinsi,
  errorKota,
  errorKecamatan,
  errorKelurahan
}) => {
  const [provinsiList, setProvinsiList] = useState<Provinsi[]>([]);
  const [kotaList, setKotaList] = useState<Kota[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [kelurahanList, setKelurahanList] = useState<Kelurahan[]>([]);

  const [selectedProvinsi, setSelectedProvinsi] = useState<string>('');
  const [selectedKota, setSelectedKota] = useState<string>('');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('');
  const [selectedKelurahan, setSelectedKelurahan] = useState<string>('');

  const [loading, setLoading] = useState({
    provinsi: false,
    kota: false,
    kecamatan: false,
    kelurahan: false
  });

  // Load provinsi on mount
  useEffect(() => {
    loadProvinsi();
  }, []);

  // Load kota when provinsi changes
  useEffect(() => {
    if (selectedProvinsi) {
      loadKota(selectedProvinsi);
    } else {
      setKotaList([]);
      setKecamatanList([]);
      setKelurahanList([]);
      setSelectedKota('');
      setSelectedKecamatan('');
      setSelectedKelurahan('');
    }
  }, [selectedProvinsi]);

  // Load kecamatan when kota changes
  useEffect(() => {
    if (selectedKota) {
      loadKecamatan(selectedKota);
    } else {
      setKecamatanList([]);
      setKelurahanList([]);
      setSelectedKecamatan('');
      setSelectedKelurahan('');
    }
  }, [selectedKota]);

  // Load kelurahan when kecamatan changes
  useEffect(() => {
    if (selectedKecamatan) {
      loadKelurahan(selectedKecamatan);
    } else {
      setKelurahanList([]);
      setSelectedKelurahan('');
    }
  }, [selectedKecamatan]);

  // Note: Kode pos functionality removed as endpoint is not available

  const loadProvinsi = async () => {
    setLoading(prev => ({ ...prev, provinsi: true }));
    try {
      const data = await wilayahService.getProvinsi();
      setProvinsiList(data);
    } catch (error) {
      console.error('Error loading provinsi:', error);
    } finally {
      setLoading(prev => ({ ...prev, provinsi: false }));
    }
  };

  const loadKota = async (provinsiId: string) => {
    setLoading(prev => ({ ...prev, kota: true }));
    try {
      const data = await wilayahService.getKota(parseInt(provinsiId));
      setKotaList(data);
    } catch (error) {
      console.error('Error loading kota:', error);
    } finally {
      setLoading(prev => ({ ...prev, kota: false }));
    }
  };

  const loadKecamatan = async (kotaId: string) => {
    setLoading(prev => ({ ...prev, kecamatan: true }));
    try {
      const data = await wilayahService.getKecamatan(parseInt(kotaId));
      setKecamatanList(data);
    } catch (error) {
      console.error('Error loading kecamatan:', error);
    } finally {
      setLoading(prev => ({ ...prev, kecamatan: false }));
    }
  };

  const loadKelurahan = async (kecamatanId: string) => {
    setLoading(prev => ({ ...prev, kelurahan: true }));
    try {
      const data = await wilayahService.getKelurahan(parseInt(kecamatanId));
      setKelurahanList(data);
    } catch (error) {
      console.error('Error loading kelurahan:', error);
    } finally {
      setLoading(prev => ({ ...prev, kelurahan: false }));
    }
  };

  const loadKodePos = async (kelurahanId: string) => {
    // Kode pos functionality not available in current API
    // This function is kept for future implementation
    try {
      // const data = await wilayahService.getKodePos(parseInt(kelurahanId));
      // onKodePosChange?.(data.kode_pos);
    } catch (error) {
      console.error('Error loading kode pos:', error);
    }
  };

  const handleProvinsiChange = (value: string) => {
    setSelectedProvinsi(value);
    const provinsi = provinsiList.find(p => p.id.toString() === value);
    onProvinsiChange?.(provinsi || null);
    
    // Reset dependent selections
    setSelectedKota('');
    setSelectedKecamatan('');
    setSelectedKelurahan('');
    onKotaChange?.(null);
    onKecamatanChange?.(null);
    onKelurahanChange?.(null);
  };

  const handleKotaChange = (value: string) => {
    setSelectedKota(value);
    const kota = kotaList.find(k => k.id.toString() === value);
    onKotaChange?.(kota || null);
    
    // Reset dependent selections
    setSelectedKecamatan('');
    setSelectedKelurahan('');
    onKecamatanChange?.(null);
    onKelurahanChange?.(null);
  };

  const handleKecamatanChange = (value: string) => {
    setSelectedKecamatan(value);
    const kecamatan = kecamatanList.find(k => k.id.toString() === value);
    onKecamatanChange?.(kecamatan || null);
    
    // Reset dependent selections
    setSelectedKelurahan('');
    onKelurahanChange?.(null);
  };

  const handleKelurahanChange = (value: string) => {
    setSelectedKelurahan(value);
    const kelurahan = kelurahanList.find(k => k.id.toString() === value);
    onKelurahanChange?.(kelurahan || null);
  };

  return (
    <div className="space-y-4">
      {/* Provinsi */}
      <div>
        <Label htmlFor="provinsi">Provinsi *</Label>
        <Select
          value={selectedProvinsi}
          onValueChange={handleProvinsiChange}
          disabled={disabled || loading.provinsi}
        >
          <SelectTrigger>
            <SelectValue placeholder={loading.provinsi ? "Memuat..." : "Pilih Provinsi"} />
          </SelectTrigger>
          <SelectContent>
            {provinsiList.map((provinsi) => (
              <SelectItem key={provinsi.id} value={provinsi.id.toString()}>
                {provinsi.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorProvinsi && <p className="text-sm text-destructive mt-1">{errorProvinsi}</p>}
      </div>

      {/* Kota/Kabupaten */}
      <div>
        <Label htmlFor="kota">Kota/Kabupaten *</Label>
        <Select
          value={selectedKota}
          onValueChange={handleKotaChange}
          disabled={disabled || !selectedProvinsi || loading.kota}
        >
          <SelectTrigger>
            <SelectValue placeholder={loading.kota ? "Memuat..." : "Pilih Kota/Kabupaten"} />
          </SelectTrigger>
          <SelectContent>
            {kotaList.map((kota) => (
              <SelectItem key={kota.id} value={kota.id.toString()}>
                {kota.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorKota && <p className="text-sm text-destructive mt-1">{errorKota}</p>}
      </div>

      {/* Kecamatan */}
      <div>
        <Label htmlFor="kecamatan">Kecamatan *</Label>
        <Select
          value={selectedKecamatan}
          onValueChange={handleKecamatanChange}
          disabled={disabled || !selectedKota || loading.kecamatan}
        >
          <SelectTrigger>
            <SelectValue placeholder={loading.kecamatan ? "Memuat..." : "Pilih Kecamatan"} />
          </SelectTrigger>
          <SelectContent>
            {kecamatanList.map((kecamatan) => (
              <SelectItem key={kecamatan.id} value={kecamatan.id.toString()}>
                {kecamatan.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorKecamatan && <p className="text-sm text-destructive mt-1">{errorKecamatan}</p>}
      </div>

      {/* Kelurahan/Desa */}
      <div>
        <Label htmlFor="kelurahan">Kelurahan/Desa *</Label>
        <Select
          value={selectedKelurahan}
          onValueChange={handleKelurahanChange}
          disabled={disabled || !selectedKecamatan || loading.kelurahan}
        >
          <SelectTrigger>
            <SelectValue placeholder={loading.kelurahan ? "Memuat..." : "Pilih Kelurahan/Desa"} />
          </SelectTrigger>
          <SelectContent>
            {kelurahanList.map((kelurahan) => (
              <SelectItem key={kelurahan.id} value={kelurahan.id.toString()}>
                {kelurahan.nama}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errorKelurahan && <p className="text-sm text-destructive mt-1">{errorKelurahan}</p>}
      </div>
    </div>
  );
};

export default WilayahDropdown;
