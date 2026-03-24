import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode }

type State = { hasError: boolean; message: string }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message || 'Bilinmeyen hata' }
  }

  componentDidCatch(err: Error, info: ErrorInfo) {
    console.error('Echo render error:', err, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-echo-canvas p-8 font-sans text-foreground">
          <h1 className="text-xl font-semibold text-destructive">Uygulama yüklenemedi</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tarayıcı konsolunu açın (F12) ve ayrıntılara bakın. Geliştirme için{' '}
            <code className="rounded bg-muted px-1 font-mono text-sm">npm run dev</code> kullanın; üretim dosyasını
            çift tıklamayın —{' '}
            <code className="rounded bg-muted px-1 font-mono text-sm">npm run preview</code> ile önizleyin.
          </p>
          <pre className="mt-4 max-w-2xl overflow-auto rounded-lg bg-foreground p-4 font-mono text-xs text-background">
            {this.state.message}
          </pre>
        </div>
      )
    }
    return this.props.children
  }
}
