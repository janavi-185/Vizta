import React from 'react'
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
import { SignupValidation } from '@/lib/validation'
import Loader from '@/components/shared/Loader'
import { Link, useNavigate } from 'react-router'
import { toast } from "sonner"
// import { describe } from 'zod/v4/core'
import { useCreateUserAccount, useSignInAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'


const SignupForm = () => {

  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: createUserAccount, isPending: isCreatingAccount } = useCreateUserAccount();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { mutateAsync: signInAccount, isPending: isSigningIn } = useSignInAccount();
  
  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  })
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);
    console.log(newUser);

    if (!newUser) {
      return toast("Sign Up failed. Please try again.", {
        description: "There was an issue while creating your account.",
      })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })



    if (!session) {
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
        <img src="/assets/images/logo.svg" alt="image" />
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12 '>Create a new account</h2>
        <p className='text-[14px] font-medium leading-[140%] md:text-[16px] md:font-normal md:leading-[140%]'>To Use Something Enter your account details..</p>


        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 flex flex-col w-full mt-4 gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type='text' className='' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type='text' className='' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <Button type="submit">
            {isCreatingAccount ? (
              <div className='flex justify-center items-center gap-2'>
                <Loader />
                Loading...
              </div>
            ) : "Sign Up"}
          </Button>
          <p className='text-center '>Already have account?<Link to='/sign-in' className='text-primary hover:cursor-pointer ml-1' >
            Login
          </Link></p>
        </form>
      </div>

    </Form>
  )
}

export default SignupForm
