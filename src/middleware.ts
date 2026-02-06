export { auth as middleware } from "@/auth";

export const config = {
    // Matcher from NextAuth docs
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
