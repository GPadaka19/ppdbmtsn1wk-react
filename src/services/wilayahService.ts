import { wilayahApi } from '@/lib/api';

export interface Provinsi {
  id: number;
  nama: string;
}

export interface Kota {
  id: number;
  nama: string;
}

export interface Kecamatan {
  id: number;
  nama: string;
}

export interface Kelurahan {
  id: number;
  nama: string;
}

export const wilayahService = {
  // Mendapatkan semua provinsi
  async getProvinsi(): Promise<Provinsi[]> {
    try {
      const response = await wilayahApi.get('/wilayah/provinsi');
      return response.data;
    } catch (error) {
      console.error('Error fetching provinsi:', error);
      throw error;
    }
  },

  // Mendapatkan kota berdasarkan provinsi
  async getKota(provinsiId: number): Promise<Kota[]> {
    try {
      const response = await wilayahApi.get(`/wilayah/kota?provinsi_id=${provinsiId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching kota:', error);
      throw error;
    }
  },

  // Mendapatkan kecamatan berdasarkan kota
  async getKecamatan(kotaId: number): Promise<Kecamatan[]> {
    try {
      const response = await wilayahApi.get(`/wilayah/kecamatan?kota_id=${kotaId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching kecamatan:', error);
      throw error;
    }
  },

  // Mendapatkan kelurahan berdasarkan kecamatan
  async getKelurahan(kecamatanId: number): Promise<Kelurahan[]> {
    try {
      const response = await wilayahApi.get(`/wilayah/kelurahan?kecamatan_id=${kecamatanId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching kelurahan:', error);
      throw error;
    }
  }

  // Note: getKodePos endpoint not available in current API
  // async getKodePos(kelurahanId: number): Promise<{ kode_pos: string }> {
  //   try {
  //     const response = await wilayahApi.get(`/wilayah/kode-pos?kelurahan_id=${kelurahanId}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error('Error fetching kode pos:', error);
  //     throw error;
  //   }
  // }
};
