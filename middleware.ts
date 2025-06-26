import { authMiddleware } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

export default authMiddleware({
  // Public routes that don't require authentication
  publicRoutes: ["/landingpage"],
  
  // Add encryption key for secretKey middleware
  secretKey: process.env.CLERK_SECRET_KEY,
  
  // After sign in, redirect to the root route (dashboard)
  afterAuth(auth, req: NextRequest) {
    // Handle users who aren't authenticated
    if (!auth.userId && !auth.isPublicRoute) {
      const landingPage = new URL('/landingpage', req.url);
      return Response.redirect(landingPage);
    }

    // If the user is signed in and trying to access landing page, 
    // redirect them to the dashboard
    if (auth.userId && req.nextUrl.pathname === '/landingpage') {
      const dashboard = new URL('/', req.url);
      return Response.redirect(dashboard);
    }
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
