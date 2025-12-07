import { NextRequest, NextResponse } from "next/server";

// POST - Login with password
export async function POST(request: NextRequest) {
    // Parse the JSON body to get password
    const { password } = await request.json();

    // Validate password against environment variable
    if (password !== process.env.AUTH_PASSWORD) {
        return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Password correct - set auth cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth", "true", {
        httpOnly: true,      // Client JS cannot read it
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "lax",     // Prevent CSRF attacks
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
}

// GET - Check if user is authenticated
export async function GET(request: NextRequest) {
    const authCookie = request.cookies.get("auth");
    const isAuthenticated = authCookie?.value === "true";

    return NextResponse.json({ authenticated: isAuthenticated });
}

// DELETE - Logout (clear cookie)
export async function DELETE() {
    const response = NextResponse.json({ success: true });
    response.cookies.delete("auth");
    return response;
}