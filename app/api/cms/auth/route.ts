import { NextRequest, NextResponse } from "next/server";
import {
  validateCredentials,
  generateSessionToken,
  validateSessionToken,
  COOKIE_NAME,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET: Check current auth status
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const isValid = token ? validateSessionToken(token) : false;

    return NextResponse.json({ authenticated: isValid }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

// POST: Login
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    const isValid = validateCredentials(username, password);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password" },
        { status: 401 }
      );
    }

    const token = generateSessionToken(username);
    const response = NextResponse.json(
      { success: true, message: "Authentication successful" },
      { status: 200 }
    );

    // Set HTTP-only secure session cookie (7 days)
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Login request failed" },
      { status: 500 }
    );
  }
}

// DELETE: Logout
export async function DELETE() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.set({
      name: COOKIE_NAME,
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Logout failed" },
      { status: 500 }
    );
  }
}
