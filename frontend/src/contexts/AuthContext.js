import React, { createContext, useContext, useState, useEffect } from "react";

// Создаем контекст
export const AuthContext = createContext(null);

// Кастомный хук для доступа к контексту
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth должен использоваться внутри AuthProvider");
    }
    return context;
};

// Провайдер аутентификации
export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(null);

    // Проверка токена при загрузке страницы
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setAuthData(JSON.parse(storedUser));
        }
    }, []);

    // Синхронизация localStorage при изменении authData
    useEffect(() => {
        if (authData) {
            localStorage.setItem("user", JSON.stringify(authData));
        } else {
            localStorage.removeItem("user");
        }
    }, [authData]);

    // Логин
    const login = (userData) => {
        const userWithRole = { ...userData, isAdmin: userData.role === "admin" };
        setAuthData(userWithRole);
    };

    // Логаут
    const logout = () => {
        setAuthData(null);
    };

    return (
        <AuthContext.Provider value={{ authData, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
