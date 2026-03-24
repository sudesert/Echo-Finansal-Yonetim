import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ErrorBoundary } from './error-boundary'

const rootEl = document.getElementById('root')
if (!rootEl) {
  throw new Error('Sayfada #root bulunamadı. index.html kontrol edin.')
}

createRoot(rootEl).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
