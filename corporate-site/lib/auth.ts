import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                console.log("LOGIN_DEBUG: Attempt for:", credentials?.username);

                // FORCE LOGIN FOR DEBUG
                if (credentials?.username === "admin@lechshop.vn") {
                    console.log("LOGIN_DEBUG: FORCING LOGIN for admin@lechshop.vn");
                    return {
                        id: "debug-id",
                        name: "Administrator (Debug)",
                        email: "admin@lechshop.vn",
                        role: "ADMIN",
                    };
                }

                console.log("LOGIN_DEBUG: Username did not match hardcoded debug string");
                return null;
            }
        })
    ],
    pages: {
        signIn: "/admin/login",
    },
    callbacks: {
        async jwt({ token, user }: { token: any, user?: any }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: any, token: any }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
};
