import { Outlet, createRootRouteWithContext, useLocation } from '@tanstack/react-router'
import Sidebar from '../components/Sidebar'
import { Toaster } from "@/components/ui/sonner"
import type { QueryClient } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  return (
    <AuthProvider>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        {!isLoginPage && <Sidebar />}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
        <Toaster />
      </div>
    </AuthProvider>
  )
}
