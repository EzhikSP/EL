import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { login as loginService } from "../services/authService";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext || !authContext.login) {
    console.error("AuthContext не инициализирован или login отсутствует.");
    return <div className="auth-container">Ошибка загрузки аутентификации.</div>;
  }

  const { login } = authContext;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await loginService(username, password);
      login(data); // Вызываем login, а не setAuthData
      navigate("/chat");
    } catch (error) {
      console.error("Ошибка входа:", error);
      alert("Ошибка входа. Проверьте данные.");
    }
  };

  return (
      <div className="auth-container">
        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <input
              type="text"
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
          />
          <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          />
          <button type="submit">Войти</button>
        </form>
      </div>
  );
}

export default LoginPage;
