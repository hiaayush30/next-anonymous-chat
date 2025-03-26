"use client"
import React from "react";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
function Verify({ params }:any) {
    const router = useRouter();
    const { username } = React.use(params) as {username:string};
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [code, setCode] = useState('');
    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await axios.post("/api/verify-code", {
                username,
                code
            })
            toast(res.data.message);
            router.replace("/home");
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast(axiosError.response?.data.message ?? "Error in verifying code")
        }
        finally { 
            setIsSubmitting(false)
        }
    }
    return (
        <div className="min-h-screen bg-stone-800 text-slate-100 flex flex-col justify-center items-center">
            <h1 className="text-4xl text-orange-500">Anonymous Chat</h1>
            <div className=" flex gap-6 my-4 text-lg">
                <label>Enter code</label>
                <input value={code} onChange={(e) => setCode(e.target.value)} type="number" placeholder="X X X X X X" />
            </div>
            <button disabled={isSubmitting}
                className="cursor-pointer bg-orange-500 rounded-lg p-1"
                onClick={handleSubmit}
            >Submit</button>
        </div>
    )
}

export default Verify
