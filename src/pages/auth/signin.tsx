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

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("E-mail ou senha inválidos. Tente novamente.");
    } else {
      router.push("/");
    }

    setIsLoading(false);
  };

  return (
    <>
      <Head>
        <title>Sacoa Cashless System — Login</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.root}>
        {/* Background grid pattern overlay */}
        <div style={styles.gridOverlay} />

        {/* Glow blobs */}
        <div style={{ ...styles.blob, top: "-80px", left: "-80px", background: "radial-gradient(circle, rgba(0,180,100,0.18) 0%, transparent 70%)" }} />
        <div style={{ ...styles.blob, bottom: "-60px", right: "-60px", background: "radial-gradient(circle, rgba(0,130,255,0.12) 0%, transparent 70%)" }} />

        <div style={styles.card}>
          {/* Logo / Brand */}
          <div style={styles.brandArea}>
            <div style={styles.logoBox}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <rect width="36" height="36" rx="10" fill="#00C97C" />
                <path d="M9 18C9 13.03 13.03 9 18 9C20.48 9 22.72 10 24.36 11.64L21.54 14.46C20.64 13.56 19.38 13 18 13C15.24 13 13 15.24 13 18C13 20.76 15.24 23 18 23C19.96 23 21.66 21.92 22.56 20.32L26.16 22.36C24.62 25.14 21.52 27 18 27C13.03 27 9 22.97 9 18Z" fill="white"/>
                <circle cx="25" cy="13" r="3" fill="white" />
              </svg>
            </div>
            <div>
              <h1 style={styles.brandName}>SACOA</h1>
              <p style={styles.brandTagline}>Cashless System</p>
            </div>
          </div>

          {/* Divider */}
          <div style={styles.divider} />

          <h2 style={styles.title}>Bem-vindo de volta</h2>
          <p style={styles.subtitle}>Faça login para acessar o painel</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Email */}
            <div style={styles.fieldGroup}>
              <label htmlFor="email" style={styles.label}>
                E-mail
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  style={styles.input}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#00C97C";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,201,124,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={styles.fieldGroup}>
              <label htmlFor="password" style={styles.label}>
                Senha
              </label>
              <div style={styles.inputWrapper}>
                <span style={styles.inputIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={styles.input}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#00C97C";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(0,201,124,0.15)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={styles.errorBox}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                ...styles.button,
                opacity: isLoading ? 0.75 : 1,
                cursor: isLoading ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.background = "linear-gradient(135deg, #00e88a 0%, #00b36b 100%)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,201,124,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #00C97C 0%, #009a5e 100%)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,201,124,0.3)";
              }}
            >
              {isLoading ? (
                <span style={styles.spinner}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Footer */}
          <p style={styles.footer}>
            © {new Date().getFullYear()} Sacoa Cashless System. Todos os direitos reservados.
          </p>
        </div>

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
          * { box-sizing: border-box; margin: 0; padding: 0; }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0px 1000px #1e2538 inset !important;
            -webkit-text-fill-color: #ffffff !important;
            border-color: rgba(255,255,255,0.1) !important;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}</style>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0d1117 0%, #161b27 50%, #0d1117 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "24px",
  },
  gridOverlay: {
    position: "absolute",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)
    `,
    backgroundSize: "40px 40px",
    pointerEvents: "none",
  },
  blob: {
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    pointerEvents: "none",
  },
  card: {
    background: "rgba(22, 27, 39, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
    animation: "fadeInUp 0.5s ease forwards",
    position: "relative",
    zIndex: 1,
  },
  brandArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  logoBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: "4px",
    lineHeight: 1.1,
  },
  brandTagline: {
    fontSize: "11px",
    color: "#00C97C",
    fontWeight: "500",
    letterSpacing: "2px",
    textTransform: "uppercase",
    marginTop: "2px",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, rgba(0,201,124,0.3), rgba(255,255,255,0.06), transparent)",
    marginBottom: "28px",
  },
  title: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: "6px",
  },
  subtitle: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.45)",
    marginBottom: "28px",
    fontWeight: "400",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },
  label: {
    fontSize: "13px",
    fontWeight: "500",
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.3px",
  },
  inputWrapper: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: "14px",
    color: "rgba(255,255,255,0.35)",
    display: "flex",
    alignItems: "center",
    pointerEvents: "none",
    zIndex: 1,
  },
  input: {
    width: "100%",
    padding: "12px 14px 12px 42px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    fontFamily: "inherit",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(255,60,60,0.1)",
    border: "1px solid rgba(255,60,60,0.2)",
    borderRadius: "8px",
    padding: "10px 14px",
    color: "#ff7070",
    fontSize: "13px",
    fontWeight: "500",
  },
  button: {
    width: "100%",
    padding: "13px",
    background: "linear-gradient(135deg, #00C97C 0%, #009a5e 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "0.3px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 15px rgba(0,201,124,0.3)",
    marginTop: "4px",
    fontFamily: "inherit",
  },
  spinner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  footer: {
    marginTop: "28px",
    textAlign: "center" as const,
    fontSize: "11px",
    color: "rgba(255,255,255,0.2)",
    fontWeight: "400",
  },
};
