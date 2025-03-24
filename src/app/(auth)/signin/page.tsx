"use client"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Signed in as {session.user.email} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h2 className="text-4xl font-semibold">Not signed in </h2>
            <button
                className="text-lg bg-orange-500 rounded-lg p-1 mt-5 cursor-pointer"
                onClick={() => signIn()}>Sign in</button>
        </div>
    )
}