import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserCheck, UserX, Clock, Search, Filter, ChevronDown } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { adminService } from '@/services/adminService';

const DashboardAdmin = () => {
  const stats = [
    { icon: Users, label: 'Total Pendaftar', value: 145, color: 'text-primary' },
    { icon: Clock, label: 'Pending', value: 23, color: 'text-warning' },
    { icon: UserCheck, label: 'Verified', value: 98, color: 'text-success' },
    { icon: UserX, label: 'Rejected', value: 12, color: 'text-destructive' },
  ];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected' | 'accepted'>('all');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [rows, setRows] = useState<any[]>([]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const fetchRows = async () => {
    try {
      setLoading(true);
      setError('');
      const { data, total: t } = await adminService.getPendaftarList({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchTerm || undefined,
        page,
        limit,
      });
      setRows(data || []);
      setTotal(t || 0);
    } catch (e: any) {
      setError(e?.message || 'Gagal memuat data pendaftar');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, page]);

  useEffect(() => {
    const id = setTimeout(() => {
      setPage(1);
      fetchRows();
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="section-padding">
        <div className="container-custom">
          <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
          
          <div className="grid md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 mt-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Cari nama/no pendaftaran/nisn/nik/email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-colors bg-background"
                />
              </div>

              <div className="relative min-w-[220px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="appearance-none w-full pl-10 pr-8 py-3 border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-ring bg-background text-foreground font-medium shadow-sm hover:border-ring transition-all cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">No. Pendaftaran</th>
                    <th className="px-4 py-3 text-left font-medium">Nama</th>
                    <th className="px-4 py-3 text-left font-medium">NISN</th>
                    <th className="px-4 py-3 text-left font-medium">NIK</th>
                    <th className="px-4 py-3 text-left font-medium">JK</th>
                    <th className="px-4 py-3 text-left font-medium">Tgl Lahir</th>
                    <th className="px-4 py-3 text-left font-medium">Agama</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">No HP</th>
                    <th className="px-4 py-3 text-left font-medium">Provinsi</th>
                    <th className="px-4 py-3 text-left font-medium">Kota</th>
                    <th className="px-4 py-3 text-left font-medium">Kecamatan</th>
                    <th className="px-4 py-3 text-left font-medium">Kelurahan</th>
                    <th className="px-4 py-3 text-left font-medium">Status</th>
                    <th className="px-4 py-3 text-left font-medium">Tanggal Daftar</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={15} className="px-4 py-6 text-center">Memuat data...</td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={15} className="px-4 py-6 text-center text-destructive">{error}</td>
                    </tr>
                  ) : rows.length === 0 ? (
                    <tr>
                      <td colSpan={15} className="px-4 py-6 text-center">Tidak ada data</td>
                    </tr>
                  ) : (
                    rows.map((r, idx) => (
                      <tr key={r.id || idx} className="border-t border-border">
                        <td className="px-4 py-3">{r.no_pendaftaran || '-'}</td>
                        <td className="px-4 py-3">{r.nama_lengkap || r.nama || '-'}</td>
                        <td className="px-4 py-3">{r.nisn || '-'}</td>
                        <td className="px-4 py-3">{r.nik || '-'}</td>
                        <td className="px-4 py-3">{r.jenis_kelamin || '-'}</td>
                        <td className="px-4 py-3">{r.tanggal_lahir || '-'}</td>
                        <td className="px-4 py-3">{r.agama || '-'}</td>
                        <td className="px-4 py-3">{r.email || '-'}</td>
                        <td className="px-4 py-3">{r.no_hp || '-'}</td>
                        <td className="px-4 py-3">{r.provinsi_nama || r.provinsi || '-'}</td>
                        <td className="px-4 py-3">{r.kota_nama || r.kabupaten || '-'}</td>
                        <td className="px-4 py-3">{r.kecamatan_nama || r.kecamatan || '-'}</td>
                        <td className="px-4 py-3">{r.kelurahan_nama || r.desa || '-'}</td>
                        <td className="px-4 py-3 capitalize">{r.status || '-'}</td>
                        <td className="px-4 py-3">{r.tanggal_daftar || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-border">
              <div className="text-sm text-muted-foreground">
                Menampilkan {(rows.length === 0 ? 0 : (page - 1) * limit + 1)}–{(page - 1) * limit + rows.length} dari {total}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || loading}
                  className={`px-3 py-2 rounded-md border text-sm ${page === 1 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                >
                  Prev
                </button>
                <span className="text-sm">{page} / {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || loading}
                  className={`px-3 py-2 rounded-md border text-sm ${page === totalPages || loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-accent'}`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardAdmin;
