/* use location нужен для того чтобы опредлить куда нажал пользователь и какая ссылка в данный момент актина */
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

import { INavLink } from '@/types'

/* переменные содержащие в себе ссылки и все необходимое для ссылок на боковой панеле */
import { sidebarLinks } from "@/constants";
// загрузчик
import Loader from '@/components/shared/Loader'
import { Button } from '@/components/ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'

/* так мы получем пользователя */
import { useUserContext, INITIAL_USER } from '@/context/AuthContext'

const LeftSidebar = () => {
  const navigate = useNavigate()

  /* создаем переменную держащую в себе текущий путь которую позднее будем использовать для определения активной ссылки */
  const { pathname } = useLocation()
  const { user, setUser, setIsAuthenticated, isLoading } = useUserContext()

  const { mutate: signOut } = useSignOutAccount()

  const handleSignOut = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    signOut()
    setIsAuthenticated(false)
    setUser(INITIAL_USER)
    navigate('/sign-in')
  }

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        {/* логотип */}
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.png"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        {isLoading || !user.email ? (
          /* загрузчик */
          <div className="h-14">
            <Loader />
          </div>
        ) : (
          <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
            {/* картинка пользователя */}
            <img
              src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user.name}</p>
              <p className="small-regular text-light-3">@{user.username}</p>
            </div>
          </Link>
        )}

{/* получаем ссылки и сразу их генерируем */}
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            /* так мы ищем активную в данный момент ссылку */
            const isActive = pathname === link.route

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && 'bg-primary-500'
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && 'invert-white'
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={(e) => handleSignOut(e)}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Выйти</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar
