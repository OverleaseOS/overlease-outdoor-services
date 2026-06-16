import { createFileRoute, Outlet, Link, redirect, useNavigate } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/_authenticated/admin')({
  ssr: false,
  beforeLoad: async () => {
    const { data: userData } = await supabase.auth.getUser()
    if (!userData.user) throw redirect({ to: '/auth' })

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)

    const isAdmin = (roles ?? []).some((r) => r.role === 'admin')
    if (!isAdmin) throw redirect({ to: '/' })
    return { user: userData.user }
  },
  component: AdminLayout,
})

function AdminLayout() {
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate({ to: '/auth', replace: true })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="font-semibold text-foreground">Admin</span>
            <nav className="flex gap-4 text-sm">
              <Link to="/admin" activeOptions={{ exact: true }} activeProps={{ className: 'text-primary font-medium' }} className="text-muted-foreground hover:text-foreground">
                Estimates
              </Link>
              <Link to="/admin/notify-setup" activeProps={{ className: 'text-primary font-medium' }} className="text-muted-foreground hover:text-foreground">
                Notifications
              </Link>
            </nav>
          </div>
          <button onClick={handleSignOut} className="text-sm text-muted-foreground hover:text-foreground">
            Sign out
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
