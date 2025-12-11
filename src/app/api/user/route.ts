import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    const user = {
        name: cookieStore.get("user_name")?.value || "Admin User",
        role: cookieStore.get("user_role")?.value || "Admin"
    };

    return NextResponse.json(user);
}
