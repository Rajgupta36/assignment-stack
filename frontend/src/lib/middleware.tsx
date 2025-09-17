import { Navigate, useLocation } from "react-router-dom";
import type { ReactElement } from "react";
import { useSession } from "@/lib/auth-client";
import { hasConfigKey } from "@/lib/config";

const publicRoutes = ["/signin", "/signup"];
const protectedRoutes = ["/config"];
const privateRoutes = ["/dashboard"];

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}

export default function RouteMiddleware({ children }: { children: ReactElement }) {
  const location = useLocation();
  const { data, isPending } = useSession();
  const pathname = normalizePath(location.pathname);

  if (isPending) return null;

  const isAuthenticated = Boolean(data?.user);

  const isPublic = publicRoutes.includes(pathname);
  const isProtected = protectedRoutes.includes(pathname);
  const isPrivate = privateRoutes.includes(pathname);

  if (isPublic) {
    return children;
  }

  if (isProtected && !isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }

  if (isPrivate) {
    if (!isAuthenticated) return <Navigate to="/signin" replace />;
    if (!hasConfigKey()) return <Navigate to="/config" replace />;
    return children;
  }

  return children;
}

