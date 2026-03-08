import { Link } from "react-router-dom";
import "../pages/Styles/Register.scss";
import { useAuth } from "../auth/Hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { handleRegister, Loading } = useAuth();
  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await handleRegister({ username, email, password });
    navigate("/expression");
  }
  if (Loading) return <div>Loading...</div>;
  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            placeholder="Enter your username"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Enter your email"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            placeholder="Create password"
          />

          <button>Register</button>
        </form>

        <p className="bottom-text">
          Already have an account?
          <Link to="/login"> Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
