import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) {
      setError("E-mail ou senha inválidos. Tente novamente.");
      setIsLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <Head>
        <title>Sacoa Cashless System — Login</title>
      </Head>
      <div style={styles.root}>
        <div style={styles.gridOverlay} />
        <div style={styles.glowLeft} />
        <div style={styles.glowRight} />

        <div style={styles.card}>
          <div style={styles.brandArea}>
            <div style={styles.logoBox}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="8" fill="#E3001B" />
                <text x="18" y="26" textAnchor="middle" fontFamily="Arial" fontWeight="900" fontSize="22" fill="white">S</text>
              </svg>
            </div>
            <div>
              <div style={styles.brandName}>SACOA</div>
              <div style={styles.brandTagline}>CASHLESS SYSTEM</div>
            </div>
          </div>

          <h1 style={styles.title}>Bem-vindo de volta</h1>
          <p style={styles.subtitle}>Faça login para acessar o painel</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>E-mail</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  style={styles.input}
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Senha</label>
              <div style={styles.inputWrapper}>
                <svg style={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={styles.input}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E3001B" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span style={{ marginLeft: 8 }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{ ...styles.button, opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <div style={styles.footer}>
            © {new Date().getFullYear()} Sacoa Cashless System. Todos os direitos reservados.
          </div>
        </div>

        <style>{`
          input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus{-webkit-text-fill-color:white!important;-webkit-box-shadow:0 0 0px 1000px #1A1A1A inset!important;}
          input:focus{outline:none;border-color:#E3001B!important;box-shadow:0 0 0 1px #E3001B!important;}
        `}</style>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "linear-gradient(135deg, #0A0A0A 0%, #141414 50%, #0A0A0A 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  gridOverlay: { position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(227,0,27,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(227,0,27,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" },
  glowLeft: { position: "absolute", top: "-200px", left: "-200px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(227,0,27,0.15) 0%, transparent 70%)", pointerEvents: "none" },
  glowRight: { position: "absolute", bottom: "-200px", right: "-200px", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(227,0,27,0.08) 0%, transparent 70%)", pointerEvents: "none" },
  card: { position: "relative", zIndex: 1, background: "rgba(20,20,20,0.92)", backdropFilter: "blur(20px)", border: "1px solid rgba(227,0,27,0.2)", borderRadius: "16px", padding: "40px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(227,0,27,0.1)", margin: "16px" },
  brandArea: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" },
  logoBox: { display: "flex", alignItems: "center", justifyContent: "center" },
  brandName: { fontSize: "20px", fontWeight: 900, letterSpacing: "4px", color: "white", lineHeight: "1" },
  brandTagline: { fontSize: "10px", fontWeight: 600, letterSpacing: "3px", color: "#E3001B", marginTop: "2px" },
  title: { fontSize: "24px", fontWeight: 700, color: "white", margin: "0 0 6px 0" },
  subtitle: { fontSize: "14px", color: "#888", margin: "0 0 28px 0" },
  form: { display: "flex", flexDirection: "column", gap: "18px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: 500, color: "#AAAAAA", letterSpacing: "0.5px" },
  inputWrapper: { position: "relative", display: "flex", alignItems: "center" },
  inputIcon: { position: "absolute", left: "12px", width: "18px", height: "18px", color: "#555", pointerEvents: "none" } as React.CSSProperties,
  input: { width: "100%", padding: "11px 12px 11px 40px", background: "#1A1A1A", border: "1px solid #2D2D2D", borderRadius: "8px", color: "white", fontSize: "14px", transition: "border-color 0.2s", boxSizing: "border-box" },
  errorBox: { display: "flex", alignItems: "center", padding: "10px 14px", background: "rgba(227,0,27,0.1)", border: "1px solid rgba(227,0,27,0.3)", borderRadius: "8px", color: "#ff6b6b", fontSize: "13px" },
  button: { width: "100%", padding: "13px", background: "#E3001B", color: "white", border: "none", borderRadius: "8px", fontSize: "15px", fontWeight: 700, letterSpacing: "0.5px", transition: "background 0.2s", marginTop: "4px" },
  footer: { textAlign: "center", marginTop: "28px", fontSize: "11px", color: "#444" },
};
