import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// 1. Impor ikon baru untuk menu
import { Menu, X, User, LogOut, ShieldUser, UserCog, LayoutDashboard } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { authService } from '@/services/authService';
// 2. Impor komponen DropdownMenu dari Shadcn/ui
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isAuth = authService.isAuthenticated();
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const publicLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Informasi', path: '/informasi' },
    { name: 'Pengumuman', path: '/pengumuman' },
    { name: 'Kontak', path: '/kontak' },
    { name: 'FAQ', path: '/faq' },
  ];

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const isActive = (path: string) => location.pathname === path;

  const RoleIcon = () => {
    const role = user?.role;
    const className = "w-4 h-4"; // Ukuran ikon di tombol trigger

    if (role === 'superadmin') {
      return <ShieldUser className={className} />;
    }
    if (role === 'admin') {
      return <UserCog className={className} />;
    }
    return <User className={className} />;
  };

  const dashboardPath = (user?.role === 'admin' || user?.role === 'superadmin')
    ? '/admin/dashboard'
    : '/siswa/dashboard';
  
  // (Asumsi) Path baru untuk manajemen admin
  const manageAdminPath = "/admin/users"; 

  return (
    <nav className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="https://lulusku.kemusukkidul.com/img/kemenag.png" alt="Logo KEMENAG" />
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              <img src="https://mtsn1waykanan.com/img/mtsn1logo.png" alt="Logo MTsN 1 Way Kanan" />
            </div>
            <div className="hidden sm:block">
              <div className="text-foreground font-bold text-lg">MTsN 1 Way Kanan</div>
              <div className="text-foreground text-xs">PPDB 2025/2026</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-2">
            {isAuth ? (
              <>
                {/* --- 3. INI ADALAH DROPDOWN BARU (DESKTOP) --- */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    {/* Ini adalah tombol yang Anda lihat, sekarang menjadi pemicu */}
                    <Button variant="ghost" size="sm" className="gap-2">
                      <RoleIcon />
                      {user?.nama || 'Menu'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to={dashboardPath}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    
                    {/* Tampilkan link ini HANYA jika superadmin */}
                    {user?.role === 'superadmin' && (
                      <DropdownMenuItem asChild>
                        <Link to={manageAdminPath}>
                          <UserCog className="mr-2 h-4 w-4" />
                          <span>Manage Admin</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Keluar</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Tombol Logout lama dihapus dari sini karena sudah masuk dropdown */}
              </>
            ) : (
              <>
                {/* ... (Tombol Login/Register tidak berubah) ... */}
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Masuk
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="btn-primary">
                    Daftar
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-accent"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border">
            {publicLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-md text-sm font-medium ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-accent'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              {isAuth ? (
                <>
                  {/* Tombol Dashboard (Mobile) */}
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsOpen(false)}
                  >
                    <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                      <RoleIcon />
                      {user?.nama || 'Dashboard'}
                    </Button>
                  </Link>
                  
                  {/* --- 4. TAMBAHKAN TOMBOL INI (MOBILE) --- */}
                  {/* Tampilkan tombol ini HANYA jika superadmin */}
                  {user?.role === 'superadmin' && (
                    <Link
                      to={manageAdminPath}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                        <UserCog className="w-4 h-4" />
                        <span>Manage Admin</span>
                      </Button>
                    </Link>
                  )}
                  
                  {/* Tombol Logout (Mobile) */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="w-full justify-start gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </Button>
                </>
              ) : (
                <>
                  {/* ... (Tombol Login/Register mobile tidak berubah) ... */}
                  <Link to="/login" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">
                      Masuk
                    </Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsOpen(false)}>
                    <Button size="sm" className="w-full btn-primary">
                      Daftar
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;