import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// ---------------------------------------------------------------------------
// Environment variable validation (runs once at module load)
// ---------------------------------------------------------------------------
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin@lechshop.vn";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Lecshop@2026";

if (!NEXTAUTH_SECRET) {
    console.error(
        "[AUTH] ⚠️  NEXTAUTH_SECRET is missing! " +
        "Set it in Vercel → Settings → Environment Variables."
    );
}

if (!process.env.NEXTAUTH_URL && process.env.NODE_ENV === "production") {
    console.warn(
        "[AUTH] ⚠️  NEXTAUTH_URL is not set. " +
        "On Vercel it auto-detects from VERCEL_URL, " +
        "but setting NEXTAUTH_URL explicitly is recommended."
    );
}

// ---------------------------------------------------------------------------
// Auth Options
// ---------------------------------------------------------------------------
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Login",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.username || !credentials?.password) {
                        console.log("[AUTH] Missing username or password");
                        return null;
                    }

                    console.log("[AUTH] Login attempt:", credentials.username);

                    // ---------------------------------------------------------
                    // Strategy 1: Try database lookup (works on VPS with SQLite)
                    // ---------------------------------------------------------
                    try {
                        const { default: prisma } = await import("@/lib/db");
                        const bcrypt = await import("bcryptjs");

                        const user = await prisma.adminUser.findUnique({
                            where: { username: credentials.username },
                        });

                        if (user) {
                            const isValid = await bcrypt.compare(
                                credentials.password,
                                user.password
                            );
                            if (isValid) {
                                console.log("[AUTH] ✅ DB login OK:", user.username);
                                return {
                                    id: user.id,
                                    name: user.name || user.username,
                                    email: user.username,
                                    role: user.role,
                                };
                            }
                            console.log("[AUTH] ❌ DB password mismatch");
                            return null;
                        }
                        console.log("[AUTH] User not in DB, trying env fallback...");
                    } catch (dbError) {
                        // DB unavailable (e.g. Vercel read-only FS, missing DB)
                        console.warn("[AUTH] DB unavailable, using env fallback:", dbError instanceof Error ? dbError.message : dbError);
                    }

                    // ---------------------------------------------------------
                    // Strategy 2: Environment variable fallback
                    //   Works everywhere, including Vercel serverless.
                    //   Set ADMIN_USERNAME + ADMIN_PASSWORD in env vars.
                    // ---------------------------------------------------------
                    if (
                        credentials.username === ADMIN_USERNAME &&
                        credentials.password === ADMIN_PASSWORD
                    ) {
                        console.log("[AUTH] ✅ Env-based login OK:", ADMIN_USERNAME);
                        return {
                            id: "admin-env",
                            name: "Administrator",
                            email: ADMIN_USERNAME,
                            role: "ADMIN",
                        };
                    }

                    console.log("[AUTH] ❌ All auth strategies failed for:", credentials.username);
                    return null;
                } catch (error) {
                    console.error("[AUTH] Unexpected error:", error);
                    return null;
                }
            },
        }),
    ],

    pages: {
        signIn: "/admin/login",
        error: "/admin/login",  // redirect errors to login instead of default error page
    },

    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60, // 24 hours
    },

    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },

    secret: NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
};
