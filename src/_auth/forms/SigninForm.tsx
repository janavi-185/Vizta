import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from "react-hook-form"

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { SigninValidation } from '@/lib/validation'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router'
import { toast } from "sonner"
// import { describe } from 'zod/v4/core'
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'


const SigninForm = () => {

  const navigate = useNavigate();
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: signInAccount, isPending } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if (!session) {
      console.log('session failed')
      return toast("Sign in failed", {
        description: "There was an issue while signing you in.",
      })
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();
      navigate('/');
    } else {
      return toast("Authentication failed, try again")
    }
  }

  return (
    <Form {...form}>
      <div className='sm:w-auto flex flex-col justify-center items-center'>
        <div className="flex items-center group cursor-pointer select-none">
          <div className="relative flex items-center justify-center w-10 h-10 mr-2">
            <div className="absolute inset-0 bg-indigo-200 rounded-xl rotate-6 group-hover:rotate-70 transition-transform duration-300 opacity-40"></div>
            <div className="absolute inset-0 bg-indigo-500 rounded-xl -rotate-6 group-hover:-rotate-70 transition-transform duration-300"></div>
            <span className="relative text-white font-bold text-xl">V</span>
            </div>
            <h1 className="text-4xl tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="font-extrabold italic tracking-wider text-indigo-500 group-hover:text-indigo-400 transition-colors">Vizta</span>
            </h1>
        </div>
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12 '>Log in to Your account</h2>
        <p className='text-[14px] font-medium leading-[140%] md:text-[16px] md:font-normal md:leading-[140%]'>To Use Something Enter your account details..</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex flex-col w-full mt-4 gap-2">

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type='email' className='' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' className='' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className='bg-accent-foreground hover:bg-accent-foreground/80 text-white/80'>
            {isPending || isUserLoading ? (
              <div className='flex justify-center items-center gap-2'>
                <Loader />
                Loading...
              </div>
            ) : "Sign In"}
          </Button>
          <p className='text-center '>Don't have account?<Link to='/sign-up' className='text-accent-foreground hover:cursor-pointer ml-1' >
            Sign up
          </Link></p>
        </form>
      </div>

    </Form>
  )
}

export default SigninForm
