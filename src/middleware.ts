import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth/signin", "/auth/signup"]);
const isProtectedPage = createRouteMatcher(["/dashboard(.*)", "/protected(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    const isAuth = await convexAuth.isAuthenticated();
    console.log(`[Middleware] ${request.nextUrl.pathname} - Authenticated: ${isAuth}`);

    if (isPublicPage(request) && isAuth) {
        console.log("Redirecting to dashboard");
        return nextjsMiddlewareRedirect(request, "/protected/dashboard");
    }
    if (isProtectedPage(request) && !isAuth) {
        console.log("Redirecting to login");
        return nextjsMiddlewareRedirect(request, "/auth/signin");
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
