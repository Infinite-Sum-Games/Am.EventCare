import { Link } from '@tanstack/react-router'
import { Users, Activity, LogOut, Hotel } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function Sidebar() {
    const { user, logout } = useAuth()

    return (
        <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b border-sidebar-border">
                <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                    Anokha 2026
                </h1>
                <p className="text-xs text-muted-foreground mt-1">Hospitality Panel</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link
                    to="/details"
                    className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
                    activeProps={{
                        className: 'flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 backdrop-blur-md border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-500 font-medium'
                    }}
                >
                    <Users size={20} />
                    <span>Accommodation</span>
                </Link>

                <Link
                    to="/logs"
                    className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
                    activeProps={{
                        className: 'flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 backdrop-blur-md border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-500 font-medium'
                    }}
                >
                    <Activity size={20} />
                    <span>Logs</span>
                </Link>

                <Link
                    to="/hostels"
                    className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
                    activeProps={{
                        className: 'flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 backdrop-blur-md border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-500 font-medium'
                    }}
                >
                    <Hotel size={20} />
                    <span>Hostels</span>
                </Link>

                {/* <Link
                    to="/analytics"
                    className="flex items-center gap-3 p-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-300"
                    activeProps={{
                        className: 'flex items-center gap-3 p-3 rounded-lg bg-amber-500/10 backdrop-blur-md border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] text-amber-500 font-medium'
                    }}
                >
                    <BarChart3 size={20} />
                    <span>Analytics</span>
                </Link> */}
            </nav>

            <div className="p-4 border-t border-sidebar-border">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary/20 to-orange-500/20 border border-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                            {user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-foreground truncate">{user?.name || 'Admin'}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.email || 'admin@anokha.amrita.edu'}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => logout()}
                        className="w-full flex items-center justify-center gap-2 p-2 rounded-lg 
                                 text-xs font-medium text-muted-foreground
                                 bg-black/20 backdrop-blur-sm border border-transparent
                                 hover:bg-black/40 hover:text-red-400 hover:border-red-500/30 
                                 hover:shadow-[0_0_15px_rgba(220,38,38,0.15)]
                                 transition-all duration-300 group"
                    >
                        <LogOut size={14} className="group-hover:scale-105 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </aside>
    )
}
