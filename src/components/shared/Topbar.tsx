import { Link } from 'react-router-dom';
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '@/context/AuthContext';

const Topbar = () => {

  const { mutate: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const { user } = useUserContext();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess])

  return (
    <section className='sticky top-0 z-50 sm:hidden backdrop-blur rounded-b-xl w-full'>
      <div className='flex justify-between items-center py-4 px-5'>
        <Link to='/' className='flex gap-3 items-center'>
          {/* <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={130}
            height={325}
          /> */}
          <p className='h2-bold'>Vizta</p>

        </Link>

        <div className='flex gap-4 '>
          <Button variant='ghost'
            onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${user.id}`} className='flex justify-center items-center gap-3'>
            <img
              src={user.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt="profile"
              className='h-8 w-8 rounded-full' />
          </Link>
        </div>
      </div>

    </section>
  )
}

export default Topbar
