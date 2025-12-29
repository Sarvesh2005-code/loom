import { convexAuthNextjsMiddleware, createRouteMatcher, isAuthenticatedNextjs, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth/signin", "/auth/signup"]);
const isProtectedPage = createRouteMatcher(["/dashboard(.*)", "/protected(.*)"]);

export default convexAuthNextjsMiddleware((request) => {
    if (isPublicPage(request) && isAuthenticatedNextjs(request)) {
        return nextjsMiddlewareRedirect(request, "/protected/dashboard");
    }
    if (isProtectedPage(request) && !isAuthenticatedNextjs(request)) {
        return nextjsMiddlewareRedirect(request, "/auth/signin");
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
