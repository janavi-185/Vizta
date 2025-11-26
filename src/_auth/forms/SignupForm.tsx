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
import { Link } from 'react-router'
import { createUserAccount } from '@/lib/appwrite/api'

const SignupForm = () => {
  const isLoading = false;
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
  }


  return (
    <Form {...form}>
      <div className='sm:w-auto flex flex-center flex-col'>
        <img src="/assets/images/logo.svg" alt="image" />
        <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12 '>Create a new account</h2>
        <p className='small-medium md:base-regular'>To Use Something Enter your account details..</p>
      

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
          {isLoading ? (
            <div className='flex-center gap-2'>
             <Loader /> 
              Loading...
            </div>
            ): "Sign Up"}
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
