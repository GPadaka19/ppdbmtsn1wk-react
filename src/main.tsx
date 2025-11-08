import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

import Index from './pages/Index';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Informasi = lazy(() => import('./pages/Informasi'));
const Pengumuman = lazy(() => import('./pages/Pengumuman'));
const Kontak = lazy(() => import('./pages/Kontak'));
const Faq = lazy(() => import('./pages/Faq'));

const DashboardSiswa = lazy(() => import('./pages/siswa/Dashboard'));
const ProfilSiswa = lazy(() => import('./pages/siswa/Profil'));
const BerkasSiswa = lazy(() => import('./pages/siswa/Berkas'));

const DashboardAdmin = lazy(() => import('./pages/admin/Dashboard'));
const PendaftarAdmin = lazy(() => import('./pages/admin/Pendaftar'));
const DetailPendaftarAdmin = lazy(() => import('./pages/admin/DetailPendaftar'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Index /> }, 
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/informasi', element: <Informasi /> },
      { path: '/pengumuman', element: <Pengumuman /> },
      { path: '/kontak', element: <Kontak /> },
      { path: '/faq', element: <Faq /> },
      
      {
        element: <ProtectedRoute allowedRoles={['siswa']} />,
        children: [
          { path: '/siswa/dashboard', element: <DashboardSiswa /> },
          { path: '/siswa/profil', element: <ProfilSiswa /> },
          { path: '/siswa/berkas', element: <BerkasSiswa /> },
        ],
      },
      
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { path: '/admin/dashboard', element: <DashboardAdmin /> },
          { path: '/admin/pendaftar', element: <PendaftarAdmin /> },
          { path: '/admin/pendaftar/:id', element: <DetailPendaftarAdmin /> },
        ],
      },
      
      { path: '*', element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);