import { Outlet, Navigate } from 'react-router-dom'


const AuthLayout = () => {
  const isAuthenticated = false // Replace with actual authentication logic

  return (
    <>
      {isAuthenticated ? (
        <Navigate to='/' />
      ) : (
        <>
          <section className='flex flex-1 justify-center items-center flex-col p-10'>
            <Outlet />
          </section>
          <img
            src='/auth-background.png'
            alt='Auth Background'
            className='hidden bg-amber-200 lg:block md:w-1/2 object-cover'
          />

        </>
      )

      }
    </>
  )
}

export default AuthLayout
