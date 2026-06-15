import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from './components/layout/Header'
import { Footer } from './components/layout/Footer'
import { LoginModal } from './components/modals/LoginModal'
import { PortalModal } from './components/modals/PortalModal'
import { Toast } from './components/shared/Toast'
import { HomePage } from './pages/HomePage'
import { AboutPage } from './pages/AboutPage'
import { ServicesPage } from './pages/ServicesPage'
import { ProductsPage } from './pages/ProductsPage'
import { CategoryPage } from './pages/CategoryPage'
import { ProductProfilePage } from './pages/ProductProfilePage'
import { ImpactPage } from './pages/ImpactPage'
import { StoriesPage } from './pages/StoriesPage'
import { ResourcesPage } from './pages/ResourcesPage'
import { ContactPage } from './pages/ContactPage'
import { AdminLoginPage } from './pages/AdminLoginPage'
import { useLanguageStore } from './stores/languageStore'
import { useAuthStore } from './stores/authStore'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export function App() {
  const lang = useLanguageStore((s) => s.lang)
  const validateSession = useAuthStore((s) => s.validateSession)

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    void validateSession()
  }, [validateSession])

  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="pt-[78px]">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:categorySlug" element={<CategoryPage />} />
          <Route path="/products/:categorySlug/:productSlug" element={<ProductProfilePage />} />
          <Route path="/impact" element={<ImpactPage />} />
          <Route path="/stories" element={<StoriesPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Routes>
      </main>
      <Footer />
      <LoginModal />
      <PortalModal />
      <Toast />
    </>
  )
}
