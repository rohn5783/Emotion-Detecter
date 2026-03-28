import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Hooks/useAuth";
import "../pages/Styles/Login.scss";

const Login = () => {
  const { handleLogin, Loading } = useAuth();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await handleLogin({ email, password });
      navigate("/expression");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  }

  if (Loading) {
    return (
      <div className="login-page login-page--loading">
        <div className="login-loading">Loading your mood space...</div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-blob login-blob--one" />
      <div className="login-blob login-blob--two" />
      <div className="login-blob login-blob--three" />

      <div className="login-shell">
        <section className="login-brand">
          <Link to="/" className="login-mark">
            Moodify
          </Link>

          <div className="login-chip">
            <Sparkles size={16} />
            Welcome Back
          </div>

          <h1>Step back into your emotional space.</h1>
          <p>
            Sign in to track moods, detect expressions, and unlock music and
            movie suggestions shaped around how you feel.
          </p>

          <div className="login-highlights">
            <div className="login-highlight">
              <ShieldCheck size={18} />
              <div>
                <strong>Private and personal</strong>
                <span>Your mood history stays tied to your account.</span>
              </div>
            </div>

            <div className="login-highlight">
              <Wand2 size={18} />
              <div>
                <strong>Instant suggestions</strong>
                <span>Jump straight from your mood to songs and movies.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="login-card">
          <div className="login-card__eyebrow">Sign In</div>
          <h2>Login to Moodify</h2>
          <p className="login-card__text">
            Pick up where you left off and continue your mood journey.
          </p>

          {!!error && <p className="form-error">{error}</p>}

          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-field">
              <span>Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
              />
            </label>

            <label className="login-field">
              <span>Password</span>
              <div className="login-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                />
                <button
                  type="button"
                  className="password-visibility-toggle"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  <span
                    className={`password-eye-icon ${
                      showPassword ? "is-visible" : "is-hidden"
                    }`}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </span>
                </button>
              </div>
            </label>

            <button className="login-submit" type="submit">
              <span>Login</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="bottom-text">
            Don&apos;t have an account?
            <Link to="/register"> Create one</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Login;
