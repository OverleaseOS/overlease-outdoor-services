import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { supabase } from '@/integrations/supabase/client'
import { Nav } from '@/components/Nav'

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
      <Nav />
      <div className="pt-24">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <span className="font-semibold text-foreground">Admin</span>
          <button onClick={handleSignOut} className="text-sm text-muted-foreground hover:text-foreground">
            Sign out
          </button>
        </div>
        <main className="mx-auto max-w-6xl px-4 pb-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
