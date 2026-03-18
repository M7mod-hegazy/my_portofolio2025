import { FormEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Shield, User, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { clearStoredAdminToken, getStoredAdminToken, setStoredAdminToken, verifyStoredAdminToken } from "@/lib/adminAuth";

const AdminLogin = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [username, setUsername] = useState("admin");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = new URLSearchParams(location.search);
    const redirectTo = searchParams.get("redirect") || "/admin/dashboard";

    useEffect(() => {
        const validateExistingToken = async () => {
            const token = getStoredAdminToken();
            if (!token) return;
            try {
                const isValid = await verifyStoredAdminToken(token);
                if (isValid) {
                    navigate(redirectTo, { replace: true });
                } else {
                    clearStoredAdminToken();
                }
            } catch {
                clearStoredAdminToken();
            }
        };
        validateExistingToken();
    }, [navigate, redirectTo]);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            const response = await fetch('/api/admin/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const payload = await response.json();
            if (!response.ok || !payload?.success || !payload?.data?.token) {
                setError(payload?.error || "Invalid login credentials");
                return;
            }
            setStoredAdminToken(payload.data.token);
            navigate(redirectTo, { replace: true });
        } catch {
            setError("Unable to login right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-slate-950 flex items-center justify-center px-4 py-10">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.18),transparent_40%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.14),transparent_35%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:42px_42px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="rounded-2xl border border-white/15 bg-black/55 backdrop-blur-xl p-5 sm:p-7 shadow-[0_0_40px_rgba(6,182,212,0.15)]">
                    <div className="flex items-center justify-center mb-5">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 p-[2px]">
                            <div className="w-full h-full rounded-2xl bg-black/90 flex items-center justify-center">
                                <Shield className="w-6 h-6 text-cyan-300" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Access</h1>
                        <p className="text-sm text-zinc-400 mt-2">Secure sign-in required to manage portfolio content</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-zinc-300">Username</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="pl-9 bg-zinc-950/80 border-white/10 text-white h-11"
                                    autoComplete="username"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-300">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-9 pr-10 bg-zinc-950/80 border-white/10 text-white h-11"
                                    autoComplete="current-password"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-md text-zinc-400 hover:text-white hover:bg-white/10 transition flex items-center justify-center"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {error ? (
                            <div className="rounded-lg border border-red-500/40 bg-red-500/10 text-red-300 text-sm px-3 py-2">
                                {error}
                            </div>
                        ) : null}

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-11 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold"
                        >
                            {isLoading ? "Signing in..." : "Login to Admin"}
                            {!isLoading ? <ArrowRight className="ml-2 w-4 h-4" /> : null}
                        </Button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
