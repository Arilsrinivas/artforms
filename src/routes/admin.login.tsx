import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { ShieldCheck, User, Lock, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect straight away
  useEffect(() => {
    const auth = localStorage.getItem("artforms_admin_auth");
    if (auth === "true") {
      navigate({ to: "/admin/business-updates" });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate small latency
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (username === "admin" && password === "admin") {
      localStorage.setItem("artforms_admin_auth", "true");
      toast.success("Administrator Authenticated", {
        description: "Welcome back, owner of Artforms Civil & Interior Hassan.",
      });
      navigate({ to: "/admin/business-updates" });
    } else {
      toast.error("Authentication Failed", {
        description: "Invalid username or password. Check your credentials.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-canvas text-ink antialiased flex flex-col justify-between">
      <Nav />

      <main className="flex-1 flex items-center justify-center px-6 py-24 md:py-36">
        <div className="w-full max-w-md bg-canvas border border-ink/10 shadow-xl rounded-2xl p-8 md:p-10 relative overflow-hidden">
          {/* Subtle accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-clay" />

          <div className="text-center mb-8">
            <div className="h-14 w-14 rounded-full bg-clay/10 text-clay flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-light tracking-tight text-ink">
              Admin Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs mx-auto">
              Please enter your administrator credentials to access the Business Updates dashboard.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              {/* Username Input */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  disabled={loading}
                  className="w-full rounded-full border border-ink/15 bg-canvas py-3.5 pl-12 pr-6 text-sm text-ink placeholder:text-muted-foreground/60 focus:border-clay focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  disabled={loading}
                  className="w-full rounded-full border border-ink/15 bg-canvas py-3.5 pl-12 pr-6 text-sm text-ink placeholder:text-muted-foreground/60 focus:border-clay focus:outline-none disabled:opacity-50"
                />
              </div>
            </div>

            {/* Helper Credentials Hint Box */}
            <div className="bg-sand/20 border border-ink/5 p-4 rounded-xl text-left text-xs text-ink/70">
              <span className="font-semibold text-clay block mb-1">Developer Credentials Hint:</span>
              Use username <code className="bg-canvas px-1 rounded text-ink">admin</code> and password <code className="bg-canvas px-1 rounded text-ink">admin</code> for review.
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group rounded-full bg-ink px-6 py-4 text-xs font-semibold uppercase tracking-wider text-canvas flex items-center justify-center gap-2 hover:bg-clay transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login to Dashboard"}
              {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
