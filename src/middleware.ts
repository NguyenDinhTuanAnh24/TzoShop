import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Nếu đã đăng nhập mà vào trang login/register -> redirect về dashboard
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Bảo vệ các route admin
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
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
    "/api-docs/:path*",
    "/admin/:path*",
    "/login",
    "/register"
  ],
};
