import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import User from "@/models/User"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await clientPromise // Ensure the MongoDB connection is established
        const user = await User.findOne({ email: credentials.email })

        if (!user) {
          return null
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.role = token.role
      return session
    },
    async signIn({ user, account }) {
      if (account.provider === "google") {
        const client = await clientPromise
        const db = client.db()
        const existingUser = await db.collection("users").findOne({ email: user.email })

        if (!existingUser) {
          // Create a new user with default role "User"
          const newUser = await db.collection("users").insertOne({
            name: user.name,
            email: user.email,
            role: "User",
            emailVerified: user.emailVerified,
          })
          user.id = newUser.insertedId.toString()
          user.role = "User"
        } else {
          user.id = existingUser._id.toString()
          user.role = existingUser.role
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

