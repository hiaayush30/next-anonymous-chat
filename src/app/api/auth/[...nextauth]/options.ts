import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import dbConnect from "@/lib/dbConnect";
import { User } from "@/model/User";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials: any, req): Promise<any> => {
                try {
                    await dbConnect();
                    const user = await User.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }  //for future proofing
                        ]
                    })
                    if (!user) {
                        throw new Error("User not found with this email")
                    }
                    if (!user.isVerified) {
                        throw new Error("Please verify your account before login")
                    }
                    const isPasswordCorrect = bcrypt.compareSync(credentials.password, user.password);
                    if (!isPasswordCorrect) {
                        throw new Error("Password incorrect!")
                    } else {
                        return user;
                    }
                } catch (error: any) {
                    throw new Error(error);
                }
            }
        })
    ],
    pages: {
        signIn: '/signin'
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXT_AUTH_SECRET,
    // Callbacks are asynchronous functions you can use to control 
    // what happens when an action is performed.
    callbacks: {
        async jwt({ token, user }) {
            console.log("in jwt callback:"+JSON.stringify(user))
            // The user object is only available when the user logs in. On subsequent requests, the token is used
            if (user) {
                token._id = user._id?.toString();
                token.isVerified = user.isVerified;
                token.username = user.username;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
            }
            return token // This token is stored in the session cookie
        },
        async session({ session, user }) { //this user came from what we returned in the authorize fn
            // This callback modifies the session object that is sent to the client.
            // Runs every time useSession() or getSession() is called on the client.
            // Uses data from the token (not user, since user data is only available on login).
            if (user) {
                session.user._id = user._id?.toString();
                session.user.isVerified = user.isVerified;
                session.user.username = user.username;
                session.user.isVerified = user.isVerified;
                session.user.isAcceptingMessages = user.isAcceptingMessages;
            }
            return session
        }
    }
}


// Instead of sending the JWT token directly to the frontend, NextAuth uses a session object 
// for security and ease of use.
// If you send the JWT to the frontend, it could be stolen via XSS attacks.
// JWTs often contain sensitive data (like _id and roles). Exposing the full JWT increases the risk of leaks.

// Example Flow:
// 1.Client calls useSession() or getSession().
// 2.NextAuth fetches the JWT, then calls session() callback.
// 3.session() reads the JWT and modifies the session object before returning it to the client.