"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signInSchema } from "@/schemas/signInSchema";
import { useState } from "react";
import { signIn } from "next-auth/react";


function Signin() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  //zod implementation 
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email:'',
      password: ''
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn('credentials',{
      identifier:data.email,
      password:data.password,
      redirect:false
    })
    setIsSubmitting(false);
    if(!result?.error){
      toast("Signed in successfully!");
      router.replace("/dashboard")
    } else {
      toast(result.error);
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Anonymous Messaging
          </h1>
          <p className="mb-4">Sign in to resume your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="cursor-pointer"
              type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in ..." : "Signin"}
            </Button>
            <div className="text-center mt-4">
              <p>
                Not a member?{' '}
                <Link href="/signup" className="text-blue-600 hover:text-blue-800">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default Signin
