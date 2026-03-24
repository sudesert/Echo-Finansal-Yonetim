import { BrowserRouter, Link, Outlet, Route, Routes } from 'react-router-dom'
import { Dashboard } from './components/Dashboard'
import ViewData from './TransactionTable'

const AppLayout = () => (
  <div className="min-h-screen bg-background text-foreground">
    <nav
      className="border-b border-echo-brand/35 bg-card/80 print:hidden"
      aria-label="Sayfa gezinmesi"
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2 md:px-6">
        <Link
          to="/"
          className="font-sans text-sm font-medium text-echo-brand transition hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-echo-brand/40"
        >
          Ana sayfa
        </Link>
        <span className="text-muted-foreground/40" aria-hidden>
          |
        </span>
        <Link
          to="/view-data"
          className="font-sans text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-echo-brand/40"
        >
          Tablo
        </Link>
      </div>
    </nav>
    <Outlet />
  </div>
)

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/view-data" element={<ViewData />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
