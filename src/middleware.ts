import { convexAuthNextjsMiddleware, createRouteMatcher, nextjsMiddlewareRedirect } from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher(["/auth/signin", "/auth/signup"]);
const isProtectedPage = createRouteMatcher(["/dashboard(.*)", "/protected(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
    if (isPublicPage(request) && (await convexAuth.isAuthenticated())) {
        return nextjsMiddlewareRedirect(request, "/protected/dashboard");
    }
    if (isProtectedPage(request) && !(await convexAuth.isAuthenticated())) {
        return nextjsMiddlewareRedirect(request, "/auth/signin");
    }
});

export const config = {
    // The following matcher runs middleware on all routes
    // except static assets.
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
