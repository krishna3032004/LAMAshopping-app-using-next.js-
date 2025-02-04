import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials";
import mongoose from 'mongoose'
import User from '@/app/models/User'
import connectDB from '@/app/db/connectDB'
import { fetchUser } from '@/actions/useraction'

const handler = NextAuth({
    session: {
        debug: true,
        strategy: 'jwt',
    },
    providers: [
        // OAuth authentication providers...
        GithubProvider({
            clientId: process.env.Github_ID,
            clientSecret: process.env.Github_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,

            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    // Fetch user from the database
                    const user = await fetchUser(credentials.email); // Ensure fetchUser is implemented correctly

                    // Check if the user exists
                    if (!user) {
                        console.error("User not found");
                        // return
                        throw new Error("Invalid Email");
                        // return user
                    }

                    // Validate the password
                    const isPasswordValid = credentials.password === user.password; 

                    if (!isPasswordValid) {
                        console.error("Invalid password");
                        throw new Error("Invalid Password");
                    }

                    // Return a safe user object
                    return {
                        id: user._id.toString(), // Ensure this is a unique identifier
                        email: user.email,
                        password: user.password,
                        name: user.username,

                    };
                } catch (error) {
                    console.error("Authorize error:", error);
                    throw new Error("Invalid email or password");
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {

            if (account.provider == "github" || account.provider == "google") {
                await connectDB()
                const currentUser = await User.findOne({ email: user.email })
                if (!currentUser) {
                    const newUser = await User.create({
                        email: user.email,
                        username: user.email.split("@")[0],
                        password: "hellowold"
                    })
                }
                return true
            }
            return true
        },
        async session({ session, token, user }) {
            const dbUser = await User.findOne({ email: session.user.email })
            session.user.name = dbUser.username
            return session
        }
    }
})

export { handler as GET, handler as POST }