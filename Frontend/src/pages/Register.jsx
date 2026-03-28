import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  HeartHandshake,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Hooks/useAuth";
import "../pages/Styles/Register.scss";

const Register = () => {
  const { handleRegister, Loading } = useAuth();
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await handleRegister({ username, email, password });
      navigate("/expression");
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  }
  if (Loading) {
    return (
      <div className="register-page register-page--loading">
        <div className="register-loading">Preparing your account...</div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-blob register-blob--one" />
      <div className="register-blob register-blob--two" />
      <div className="register-blob register-blob--three" />

      <div className="register-shell">
        <section className="register-brand">
          <Link to="/" className="register-mark">
            Moodify
          </Link>

          <div className="register-chip">
            <Sparkles size={16} />
            New Here
          </div>

          <h1>Create your mood companion account.</h1>
          <p>
            Register to log emotions, detect facial expressions, and build a
            personalized stream of songs, movies, and self-check-ins.
          </p>

          <div className="register-highlights">
            <div className="register-highlight">
              <UserPlus size={18} />
              <div>
                <strong>Fast onboarding</strong>
                <span>Start tracking moods in just a few seconds.</span>
              </div>
            </div>

            <div className="register-highlight">
              <HeartHandshake size={18} />
              <div>
                <strong>Built for your vibe</strong>
                <span>Your dashboard, sleep, journal, and chat stay connected.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="register-card">
          <div className="register-card__eyebrow">Create Account</div>
          <h2>Join Moodify</h2>
          <p className="register-card__text">
            Start a calmer, more personalized mood journey today.
          </p>

          {!!error && <p className="form-error">{error}</p>}

          <form className="register-form" onSubmit={handleSubmit}>
            <label className="register-field">
              <span>Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                placeholder="Choose your username"
              />
            </label>

            <label className="register-field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                placeholder="Enter your email"
              />
            </label>

            <label className="register-field">
              <span>Password</span>
              <div className="register-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setpassword(e.target.value)}
                  placeholder="Create your password"
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

            <button className="register-submit" type="submit">
              <span>Register</span>
              <ArrowRight size={18} />
            </button>
          </form>

          <p className="bottom-text">
            Already have an account?
            <Link to="/login"> Login</Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default Register;
