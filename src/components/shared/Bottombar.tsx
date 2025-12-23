import { bottombarLinks } from "@/constants";
// import type { INavLink } from "@/types";
import { Link, useLocation } from "react-router-dom"


const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="fixed
      bottom-3
      left-1/2
      -translate-x-1/2
      z-50
      flex
      justify-between
      items-center
      w-full
      max-w-md
      rounded-full
      bg-accent/30
      backdrop-blur-2xl
      px-5
      py-3
      md:hidden">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link 
            to={link.route}
            key={link.label} className={`flex px-4 items-center flex-col justify-center ${isActive && 'bg-accent-foreground/70 rounded-3xl p-2 gap-1 transition'}`}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              className={`${isActive && 'invert brightness-0 transition duration-200'}`}
              width={16}
              height={16}
            />
            <p className="text-sm font-medium leading-[140%]">{link.label}</p>
          </Link>
        )
      })}
    </section>
  )
}

export default Bottombar
