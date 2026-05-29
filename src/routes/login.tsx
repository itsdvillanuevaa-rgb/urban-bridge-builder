import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { BigButton } from "@/components/big-button";
import logo from "@/assets/Logo_Urbix.jpeg";
import { Mail, User, Lock, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Iniciar sesión — Acento Accesible" }] }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Google OAuth Simulation state
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleError, setGoogleError] = useState("");

  // Auto-restore session and skip login page if active session exists
  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = localStorage.getItem("aa.session");
    const onboarded = localStorage.getItem("aa.onboarded");
    if (session) {
      navigate({ to: onboarded ? "/" : "/encuesta" });
    }
  }, [navigate]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("Por favor completa los campos requeridos.");
      return;
    }

    // Save to aa.session
    const session = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
    };
    localStorage.setItem("aa.session", JSON.stringify(session));

    // Skip survey if already completed onboarding previously
    const onboarded = localStorage.getItem("aa.onboarded");
    toast.success("¡Registro de cuenta exitoso!");
    navigate({ to: onboarded ? "/" : "/encuesta" });
  };

  const handleGoogleSimulationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleName.trim() || !googleEmail.trim()) {
      setGoogleError("Por favor completa todos los campos.");
      return;
    }

    // Split entered name to obtain first/last names dynamically
    const nameParts = googleName.trim().split(" ");
    const parsedFirstName = nameParts[0] || "";
    const parsedLastName = nameParts.slice(1).join(" ") || "";

    const session = {
      firstName: parsedFirstName,
      lastName: parsedLastName,
      email: googleEmail.trim(),
    };

    localStorage.setItem("aa.session", JSON.stringify(session));
    setShowGoogleModal(false);
    toast.success("¡Inicio de sesión simulado con Google exitoso!");

    // Skip survey if already completed onboarding previously
    const onboarded = localStorage.getItem("aa.onboarded");
    navigate({ to: onboarded ? "/" : "/encuesta" });
  };

  return (
    <div className="absolute inset-0 flex flex-col bg-background overflow-y-auto">
      {/* Top Header */}
      <div className="px-6 pt-12 pb-6 safe-top flex flex-col items-center text-center">
        <div className="size-20 rounded-2xl overflow-hidden shadow-md border border-border bg-white flex items-center justify-center p-1.5 mb-4 ring-2 ring-brand/10 animate-fade-up">
          <img src={logo} alt="Logo Urbix" className="w-full h-full object-contain rounded-xl" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight animate-fade-up">Comencemos tu viaje</h2>
        <p className="mt-1.5 text-sm text-muted-foreground max-w-xs animate-fade-up">
          Crea tu perfil y ayuda a construir una ciudad sin barreras.
        </p>
      </div>

      {/* Auth Card Form */}
      <div className="flex-1 px-6 pb-8 space-y-6">
        <form
          onSubmit={handleRegister}
          className="bg-card rounded-3xl border border-border p-5 shadow-sm space-y-4 animate-fade-up"
        >
          {error && (
            <p className="text-xs font-semibold text-destructive text-center bg-destructive/10 py-2.5 px-4 rounded-xl">
              {error}
            </p>
          )}

          <div className="space-y-3.5">
            <div>
              <label
                htmlFor="firstName"
                className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1"
              >
                Nombre *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User className="size-4" />
                </span>
                <input
                  id="firstName"
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="block w-full pl-10 pr-4 h-12 bg-muted/40 border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-background"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1"
              >
                Apellido *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <User className="size-4" />
                </span>
                <input
                  id="lastName"
                  type="text"
                  required
                  placeholder="Tu apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="block w-full pl-10 pr-4 h-12 bg-muted/40 border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-background"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1"
              >
                Correo Electrónico *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Mail className="size-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 h-12 bg-muted/40 border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-background"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1"
              >
                Contraseña (Opcional)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                  <Lock className="size-4" />
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-4 h-12 bg-muted/40 border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-background"
                />
              </div>
            </div>
          </div>

          <div className="pt-2">
            <BigButton type="submit">Crear cuenta y continuar</BigButton>
          </div>
        </form>

        <div className="flex items-center justify-between px-2 animate-fade-up">
          <span className="w-1/3 border-b border-muted" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            o
          </span>
          <span className="w-1/3 border-b border-muted" />
        </div>

        {/* Dynamic / OAuth mock signup */}
        <div className="space-y-3 animate-fade-up">
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full h-14 border border-border bg-card hover:bg-muted/50 rounded-2xl flex items-center justify-center gap-3 text-sm font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            {/* Google Icon SVG */}
            <svg className="size-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v3.92h6.69c-.29 1.5-.1.14-.14-.26 1.4-1.2 2.2-3 2.2-5.18 0-1.15-.1-2.23-.29-3.23z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96L1.29 17.66C3.26 21.46 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.29c-.25-.72-.39-1.49-.39-2.29s.14-1.57.39-2.29L1.29 6.34C.47 8.05 0 9.97 0 12s.47 3.95 1.29 5.66l3.98-3.37z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.54 1.29 6.34l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            Continuar con Google (Simulado)
          </button>
        </div>
      </div>

      {/* Google OAuth Simulation Modal */}
      {showGoogleModal && (
        <div className="absolute inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-card border border-border rounded-3xl p-6 shadow-2xl space-y-5 animate-pop-in relative">
            <button
              type="button"
              onClick={() => setShowGoogleModal(false)}
              className="absolute top-4 right-4 size-8 grid place-items-center rounded-full hover:bg-muted text-muted-foreground"
            >
              <X className="size-4" />
            </button>

            <div className="text-center space-y-1.5">
              <div className="mx-auto size-12 rounded-full bg-brand-soft text-brand grid place-items-center mb-2">
                <svg className="size-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M21.35 11.1H12v2.7h5.38c-.24 1.28-.91 2.37-1.95 3.07v2.55h3.15c1.84-1.7 2.92-4.2 2.92-7.23 0-.61-.05-1.19-.15-1.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 21c2.43 0 4.47-.8 5.96-2.18l-3.15-2.55c-.87.58-1.99.93-2.81.93-2.17 0-4-.15-4.66-2.92L3.15 17.65C4.63 20.62 7.7 21 12 21z"
                  />
                  <path
                    fill="currentColor"
                    d="M7.34 14.28C7.19 13.84 7.1 13.37 7.1 12.87c0-.5.09-.97.24-1.41L3.15 8.37C2.41 9.87 2 11.53 2 12.87s.41 3 1.15 4.5l4.19-3.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 7.1c1.32 0 2.5.45 3.44 1.35l2.58-2.58C16.46 4.35 14.42 4 12 4 7.7 4 4.63 6.38 3.15 8.37l4.19 3.09c.66-2.77 2.49-4.36 4.66-4.36z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-bold">Iniciar sesión con Google</h3>
              <p className="text-xs text-muted-foreground">
                Simulador de Autenticación OAuth. Ingresa tus datos para continuar de forma
                dinámica.
              </p>
            </div>

            <form onSubmit={handleGoogleSimulationSubmit} className="space-y-4">
              {googleError && (
                <p className="text-xs font-semibold text-destructive text-center bg-destructive/10 py-2 px-3 rounded-lg">
                  {googleError}
                </p>
              )}

              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="googleName"
                    className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1"
                  >
                    Nombre Completo
                  </label>
                  <input
                    id="googleName"
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    className="block w-full px-3 h-11 bg-muted/40 border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>

                <div>
                  <label
                    htmlFor="googleEmail"
                    className="block text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-1"
                  >
                    Correo de Google
                  </label>
                  <input
                    id="googleEmail"
                    type="email"
                    required
                    placeholder="Ej. juan.perez@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="block w-full px-3 h-11 bg-muted/40 border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(false)}
                  className="flex-1 h-12 bg-muted text-foreground font-semibold text-sm rounded-xl hover:bg-muted/80"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 h-12 bg-brand text-brand-foreground font-semibold text-sm rounded-xl hover:opacity-90"
                >
                  Iniciar sesión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
