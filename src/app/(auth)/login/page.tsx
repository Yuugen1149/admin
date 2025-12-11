"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { ShaderAnimation } from "@/components/ui/shader-lines";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Login failed");
            }

            router.push("/");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex flex-col justify-center items-center bg-primary p-12 text-white relative overflow-hidden">
                {/* Shader Animation Background */}
                <ShaderAnimation />

                {/* Content overlay */}
                <div className="relative z-10 max-w-md text-center">
                    <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl mx-auto mb-8 flex items-center justify-center">
                        <svg width="48" height="48" viewBox="0 0 64 64" fill="none">
                            <circle cx="32" cy="32" r="6" fill="white" />
                            <circle cx="20" cy="20" r="4" fill="white" />
                            <circle cx="44" cy="20" r="4" fill="white" />
                            <circle cx="20" cy="44" r="4" fill="white" />
                            <circle cx="44" cy="44" r="4" fill="white" />
                            <line x1="32" y1="32" x2="20" y2="20" stroke="white" strokeWidth="2" />
                            <line x1="32" y1="32" x2="44" y2="20" stroke="white" strokeWidth="2" />
                            <line x1="32" y1="32" x2="20" y2="44" stroke="white" strokeWidth="2" />
                            <line x1="32" y1="32" x2="44" y2="44" stroke="white" strokeWidth="2" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Admin Platform</h2>
                    <p className="text-blue-100 text-lg">
                        Manage your organization efficiently with our powerful dashboard tools.
                    </p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center items-center p-8 bg-surface">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold text-text-primary">Welcome Back</h1>
                        <p className="text-text-secondary mt-2">Enter your credentials to access the admin panel.</p>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-error rounded-xl text-sm font-medium border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-background"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-primary mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-border focus:border-primary focus:ring-4 focus:ring-blue-50 outline-none transition-all bg-background pr-12"
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary justify-center py-4"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : "Log In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
