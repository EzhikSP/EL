import React from "react";
import { Link, useLocation } from "react-router-dom";
import GameLayout from "./GameLayout";
import { useAuth } from "../contexts/AuthContext"; // Используем контекст авторизации

function Layout({ children }) {
    const location = useLocation();
    const { authData, logout } = useAuth(); // Получаем данные авторизации и функцию выхода

    // Если игрок в игровом мире и авторизован, используем GameLayout
    if (authData && location.pathname.startsWith("/game")) {
        return <GameLayout>{children}</GameLayout>;
    }

    return (
        <div className="app-container">
            <header>
                <h1>Medieval RPG</h1>
                <nav>
                    {authData ? (
                        <>
                            <Link to="/chat">Чат</Link>{" "}
                            <Link to="/battle">Бой</Link>{" "}
                            <Link to="/inventory">Инвентарь</Link>{" "}
                            <button onClick={logout}>Выход</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Вход</Link>{" "}
                            <Link to="/register">Регистрация</Link>
                        </>
                    )}
                </nav>
            </header>
            <main>{children}</main>
            <footer>
                <p>&copy; 2025 Medieval RPG</p>
            </footer>
        </div>
    );
}

export default Layout;
