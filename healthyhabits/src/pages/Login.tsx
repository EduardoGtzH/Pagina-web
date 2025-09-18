import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Login() {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (user === "admin" && password === "1234") {
      localStorage.setItem("username", user);
      navigate("/home"); // 👈 Lleva al Home
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="w-full">
      
      <div className="card">
        
        <h2 className="Write">HealthyHabits</h2>

        {/* 👇 aquí agregamos el onSubmit */}
        <form onSubmit={handleLogin} className="flex flex-col space-y-4">
          <input
            type="user"
            placeholder="Usuario"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <button type="submit" className="btn-primary">
            Ingresar
          </button>
        </form>

        <br />

        {/* 👇 usamos <Link> en vez de <h1> */}
        <p className="link">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Crear cuenta
          </Link>
        </p>
        <p className="link">
          ¿Olvidaste tu contraseña?{" "}
          <Link to="/reset" className="text-blue-600 hover:underline">
            Recuperar
          </Link>
        </p>
      </div>
      <img src={logo} alt="HealthyHabits Logo" className="logo-bottom" />

    </div>
  );
}
