import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    const isAdminRoute = pathname.startsWith("/admin");
    const isUserRoute = 
      pathname.startsWith("/dashboard") || 
      pathname.startsWith("/plans") || 
      pathname.startsWith("/my-plans") || 
      pathname.startsWith("/api-keys") || 
      pathname.startsWith("/usage") || 
      pathname.startsWith("/billing") || 
      pathname.startsWith("/settings") || 
      pathname.startsWith("/support") || 
      pathname.startsWith("/api-docs") ||
      pathname.startsWith("/docs/api");

    // Nếu đã đăng nhập mà vào trang login/register -> redirect theo role
    if (token && (pathname === "/login" || pathname === "/register")) {
      const role = token.role as string;
      if (role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Xử lý route ADMIN
    if (isAdminRoute) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    // Xử lý route USER (Chặn ADMIN vào khu vực của USER)
    if (isUserRoute) {
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }
      if (token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Các trang không cần login
        const publicPages = ["/", "/login", "/register", "/pricing", "/forgot-password"];
        if (publicPages.includes(pathname)) {
          return true;
        }

        // Dashboard và các trang con cần login
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/plans/:path*",
    "/my-plans/:path*",
    "/api-keys/:path*",
    "/usage/:path*",
    "/billing/:path*",
    "/settings/:path*",
    "/support/:path*",
    "/docs/api/:path*",
    "/admin/:path*",
    "/login",
    "/register"
  ],
};
