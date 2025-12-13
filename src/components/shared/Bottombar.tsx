import { bottombarLinks } from "@/constants";
// import type { INavLink } from "@/types";
import { Link, useLocation } from "react-router-dom"


const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="z-50 flex justify-between items-center w-full sticky bottom-0  rounded-xl bg-accent/30 backdrop-blur-2xl px-5 py-4 sm:hidden">
      {bottombarLinks.map((link) => {
        const isActive = pathname === link.route;
        return (
          <Link 
            to={link.route}
            key={link.label} className={`flex px-7 items-center flex-col justify-center ${isActive && 'bg-primary/80 rounded-[10px] p-2 gap-1 transition'}`}
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
