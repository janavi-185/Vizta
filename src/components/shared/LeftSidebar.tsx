import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useEffect } from 'react';
import { useUserContext } from '@/context/AuthContext';
import { sidebarLinks } from '@/constants';
import type { INavLink } from '@/types';
import { Button } from '../ui/button';

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess])

  return (

    <nav className='hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px]'>
      <div className='flex flex-col gap-11'>
        <Link to='/' className='flex gap-3  items-center'>
          <div className="flex items-center group cursor-pointer select-none">
          {/* <div className="relative flex items-center justify-center w-10 h-10 mr-2">
            <div className="absolute inset-0 bg-indigo-200 rounded-xl rotate-6 group-hover:rotate-70 transition-transform duration-300 opacity-40"></div>
            <div className="absolute inset-0 bg-indigo-500 rounded-xl -rotate-6 group-hover:-rotate-70 transition-transform duration-300"></div>
            <span className="relative text-white font-bold text-xl">V</span>
            </div> */}
            <h1 className="text-4xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="font-extrabold tracking-wider text-indigo-500 group-hover:text-indigo-400 transition-colors italic">Vizta</span>
            </h1>
        </div> 
        </Link>
        <Link to={`profile/${user.id}`} className='flex gap-3 items-center'>
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="logo"
            className='h-14 w-14 rounded-full'
          />
          <div className='flex flex-col'>
            <p className='text-[18px] font-bold leading-[140%]'> {user.name}
            </p>
            <p className='text-[14px] font-normal leading-[140%] text-secondary'>
              @{user.username}
            </p>
          </div>
        </Link>

        <ul className='flex flex-col gap-6'>
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li key={link.label} className={`rounded-lg hover:bg-accent-foreground/70 hover:text-white transition group ${isActive && 'bg-accent-foreground/70'}`}>
                <NavLink
                  to={link.route}
                  className='flex gap-4 items-center p-4 transition'
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert group-hover:brightness-0 transition duration-200 ${isActive && 'invert brightness-0'}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </div>
      <Button variant='ghost' className='flex gap-4 items-center justify-start hover:bg-transparent hover:text-white'
        onClick={() => signOut()}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className='text-[14px] font-medium leading-[140%] lg:text-[16px]'>Logout</p>
      </Button>
    </nav>
  )
}

export default LeftSidebar
