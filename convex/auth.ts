import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import { Password } from "@convex-dev/auth/providers/Password";

const googleClientId = process.env.CONVEX_AUTH_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.CONVEX_AUTH_GOOGLE_CLIENT_SECRET;

if (!googleClientId || !googleClientSecret) {
    console.error("Missing Google Auth Env Vars in auth.ts");
}

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
    providers: [
        Google({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
        }),
        Password(),
    ],
    callbacks: {
        async redirect({ redirectTo }) {
            return redirectTo;
        },
    },
});
