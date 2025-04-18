export const publicRoutes = ["/"];

export const isPublicRoute = (pathname: string = window.location.pathname): boolean =>
  publicRoutes.includes(pathname);