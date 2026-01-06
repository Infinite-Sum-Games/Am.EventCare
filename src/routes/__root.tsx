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
  notFoundComponent: () => {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    )
  },
})

function RootComponent() {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login' || location.pathname === '/login/'

  return (
    <AuthProvider>
      <div className="flex h-screen bg-background text-foreground overflow-hidden">
        {!isLoginPage && <Sidebar />}
        
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>
        
        <Toaster />
      </div>
    </AuthProvider>
  )
}