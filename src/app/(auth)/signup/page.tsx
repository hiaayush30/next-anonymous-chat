"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";


function Signup() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const debouncedUsername = useDebounceValue(username, 300);

    //zod implementation 
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: '',
            username: '',
            password: ''
        }
    });

    useEffect(() => {
        const checkUsernameUnique = async () => {
            if (debouncedUsername) {
                setIsCheckingUsername(true);
                setUsernameMessage('');
                try {
                    const res = await axios.get('/api/check-username-unique?username=' + debouncedUsername);
                    setUsernameMessage(res.data.message);
                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
                } finally {
                    setIsCheckingUsername(false);
                }
            }
        }
        checkUsernameUnique();
    }, [debouncedUsername])

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsSubmitting(true);
        try {
            const res = await axios.post<ApiResponse>('/api/signup', { data });
            toast(res.data.message)
            router.replace(`/verify/${username}`);
        }
        catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast(axiosError.response?.data.message ?? "Something went wrong! Please try again later")
        }
        finally {
            setIsSubmitting(false);
        }
    }


    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Anonymous Messaging
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            name="username"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" {...field}
                                            onChange={
                                                (e) => {
                                                    field.onChange(e)
                                                    setUsername(e.target.value)
                                                }

                                            } />
                                    </FormControl>
                                    <FormDescription>
                                        This is your public display name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name="email"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
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
                                        <Input placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="cursor-pointer"
                            type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Signing up ..." : "Signup"}
                        </Button>
                        <div className="text-center mt-4">
                            <p>
                                Already a member?{' '}
                                <Link href="/signin" className="text-blue-600 hover:text-blue-800">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export default Signup
