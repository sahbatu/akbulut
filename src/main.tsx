import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { CategoriesProvider } from '@/contexts/CategoriesContext'
import { SiteDataProvider } from '@/contexts/SiteDataContext'
import '@fontsource/dm-sans/latin-400.css'
import '@fontsource/dm-sans/latin-600.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import '@fontsource/cormorant-garamond/latin-700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <SiteDataProvider>
        <CategoriesProvider>
          <App />
        </CategoriesProvider>
      </SiteDataProvider>
    </HelmetProvider>
  </StrictMode>,
)
