import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Admin routes: require admin role
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    if (user.user_metadata?.is_admin !== true) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return response;
  }

  // Dashboard routes: check subscription status
  if (pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Allow /dashboard and /dashboard/settings without subscription
    const isAllowedWithoutSub =
      pathname === "/dashboard" ||
      pathname.startsWith("/dashboard/settings");

    if (!isAllowedWithoutSub) {
      const { data: business } = await supabase
        .from("businesses")
        .select("subscription_status")
        .eq("owner_id", user.id)
        .single();

      if (!business || business.subscription_status !== "active") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
