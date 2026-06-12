import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { AuthProvider } from '@/contexts/AuthContext'
import { Home } from '@/pages/Home'

const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })))
const Products = lazy(() => import('@/pages/Products').then((m) => ({ default: m.Products })))
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })))
const CategoryDetail = lazy(() =>
  import('@/pages/CategoryDetail').then((m) => ({ default: m.CategoryDetail })),
)
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))
const CookiePolicy = lazy(() =>
  import('@/pages/CookiePolicy').then((m) => ({ default: m.CookiePolicy })),
)
const Kvkk = lazy(() => import('@/pages/Kvkk').then((m) => ({ default: m.Kvkk })))

const AdminLayout = lazy(() =>
  import('@/layouts/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const AdminLogin = lazy(() =>
  import('@/pages/admin/AdminLogin').then((m) => ({ default: m.AdminLogin })),
)
const AdminDashboard = lazy(() =>
  import('@/pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })),
)
const AdminProducts = lazy(() =>
  import('@/pages/admin/AdminProducts').then((m) => ({ default: m.AdminProducts })),
)
const AdminCategories = lazy(() =>
  import('@/pages/admin/AdminCategories').then((m) => ({ default: m.AdminCategories })),
)
const AdminContact = lazy(() =>
  import('@/pages/admin/AdminContact').then((m) => ({ default: m.AdminContact })),
)
const AdminMessages = lazy(() =>
  import('@/pages/admin/AdminMessages').then((m) => ({ default: m.AdminMessages })),
)
const AdminBrand = lazy(() =>
  import('@/pages/admin/AdminBrand').then((m) => ({ default: m.AdminBrand })),
)
const AdminFooter = lazy(() =>
  import('@/pages/admin/AdminFooter').then((m) => ({ default: m.AdminFooter })),
)
const AdminSeo = lazy(() =>
  import('@/pages/admin/AdminSeo').then((m) => ({ default: m.AdminSeo })),
)
const AdminAnnouncements = lazy(() =>
  import('@/pages/admin/AdminAnnouncements').then((m) => ({ default: m.AdminAnnouncements })),
)
const AdminContent = lazy(() =>
  import('@/pages/admin/AdminContent').then((m) => ({ default: m.AdminContent })),
)

function AdminFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 text-sm">
      Yükleniyor...
    </div>
  )
}

function PageFallback() {
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route
              path="hakkimizda"
              element={
                <Suspense fallback={<PageFallback />}>
                  <About />
                </Suspense>
              }
            />
            <Route
              path="urunlerimiz"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Products />
                </Suspense>
              }
            />
            <Route
              path="urunlerimiz/:slug"
              element={
                <Suspense fallback={<PageFallback />}>
                  <CategoryDetail />
                </Suspense>
              }
            />
            <Route
              path="iletisim"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Contact />
                </Suspense>
              }
            />
            <Route
              path="cerez-politikasi"
              element={
                <Suspense fallback={<PageFallback />}>
                  <CookiePolicy />
                </Suspense>
              }
            />
            <Route
              path="kvkk"
              element={
                <Suspense fallback={<PageFallback />}>
                  <Kvkk />
                </Suspense>
              }
            />
          </Route>

        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Suspense fallback={<AdminFallback />}>
                <AdminLayout />
              </Suspense>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="urunler" element={<AdminProducts />} />
          <Route path="kategoriler" element={<AdminCategories />} />
          <Route path="iletisim" element={<AdminContact />} />
          <Route path="mesajlar" element={<AdminMessages />} />
          <Route path="marka" element={<AdminBrand />} />
          <Route path="footer" element={<AdminFooter />} />
          <Route path="seo" element={<AdminSeo />} />
          <Route path="duyurular" element={<AdminAnnouncements />} />
          <Route path="icerik" element={<AdminContent />} />
        </Route>

          <Route
            path="*"
            element={
              <Suspense fallback={<PageFallback />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
