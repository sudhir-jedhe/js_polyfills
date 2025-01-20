import Link from 'next/link'
import { ShoppingCart, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          FoodDelivery
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Button variant="ghost" asChild>
                <Link href="/cart">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Cart
                </Link>
              </Button>
            </li>
            {user ? (
              <>
                <li>
                  <Button variant="ghost" asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      {user.name}
                    </Link>
                  </Button>
                </li>
                <li>
                  <Button variant="ghost" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Button variant="ghost" asChild>
                  <Link href="/login">
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Link>
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

