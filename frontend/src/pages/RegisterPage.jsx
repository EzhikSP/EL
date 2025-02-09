import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { register as registerService } from "../services/authService";

const classes = ["Воин", "Паладин", "Рейнджер", "Маг", "Жрец", "Друид"];
const races = ["Человек", "Эльф", "Гном", "Орк", "Драконид"];

function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [characterClass, setCharacterClass] = useState("");
  const [race, setRace] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const usernameRegex = /^[A-Za-zА-Яа-я0-9_\-]{3,20}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usernameRegex.test(username)) {
      alert("Логин должен содержать от 3 до 20 символов (буквы, цифры, _, -)!");
      return;
    }

    if (!passwordRegex.test(password)) {
      alert("Пароль должен содержать минимум 8 символов, включая буквы и цифры!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Пароли не совпадают!");
      return;
    }

    if (!emailRegex.test(email)) {
      alert("Введите корректный email!");
      return;
    }

    if (!username || !password || !confirmPassword || !email || !characterClass || !race) {
      alert("Все поля обязательны для заполнения!");
      return;
    }

    const requestData = {
      username,
      password,
      email,
      character_class: characterClass, // Приводим к нужному формату
      race,
    };

    console.log("Отправляем данные на сервер:", requestData);

    try {
      const data = await registerService(requestData);
      login(data);
      navigate("/chat");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      alert(error.message || "Ошибка сети или сервера.");
    }
  };

  return (
      <div className="auth-container">
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Логин:</label>
          <input
              id="username"
              type="text"
              placeholder="Логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
          /><br />

          <label htmlFor="email">Email:</label>
          <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
          /><br />

          <label htmlFor="password">Пароль:</label>
          <input
              id="password"
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
          /><br />

          <label htmlFor="confirmPassword">Подтвердите пароль:</label>
          <input
              id="confirmPassword"
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
          /><br />

          <label htmlFor="characterClass">Класс:</label>
          <select
              id="characterClass"
              value={characterClass}
              onChange={(e) => {
                console.log("Выбранный класс:", e.target.value);
                setCharacterClass(e.target.value);
              }}
              defaultValue="Лох"
              required
          >
            <option value="" disabled>Выберите класс</option>
            {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
            ))}
          </select><br />

          <label htmlFor="race">Раса:</label>
          <select
              id="race"
              value={race}
              onChange={(e) => setRace(e.target.value)}
              defaultValue="Лошара"
              required
          >
            <option value="" disabled>Выберите расу</option>
            {races.map((r) => (
                <option key={r} value={r}>{r}</option>
            ))}
          </select><br />

          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
  );
}

export default RegisterPage;
