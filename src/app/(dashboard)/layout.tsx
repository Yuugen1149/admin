import { NavigationDock } from "@/components/NavigationDock";
import { cookies } from "next/headers";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = await cookies();
    const user = {
        name: cookieStore.get("user_name")?.value || "Admin User",
        role: cookieStore.get("user_role")?.value || "Admin"
    };

    return (
        <div className="min-h-screen bg-background pb-32">
            <NavigationDock user={user} />
            <main className="container mx-auto">
                {children}
            </main>
        </div>
    );
}
