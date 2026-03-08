import {Link} from "react-router-dom";
import "../pages/Styles/Login.scss";
import { useAuth } from "../auth/Hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const {handleLogin,Loading} = useAuth();
const [email, setemail] = useState("");
const [password, setpassword] = useState("");

const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    await handleLogin({email,password});
navigate("/expression");
  
  }
  if(Loading) return <div>Loading...</div>
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
        <p className="bottom-text">
          Don't have an account? 
          <Link to="/register"> Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;