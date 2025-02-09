import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ClansTab from "../components/admin/ClansTab";
import PlayersTab from "../components/admin/PlayersTab";
import ChatTab from "../components/admin/ChatTab";
import RewardsTab from "../components/admin/RewardsTab";
import SecurityTab from "../components/admin/SecurityTab";

const AdminPanel = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("clans");

    // Если пользователь не админ, перенаправляем на главную
    if (!user || !user.isAdmin) {
        return <Navigate to="/" />;
    }

    return (
        <div className="admin-panel">
            <h2>Административная панель</h2>
            <div className="admin-tabs">
                <button onClick={() => setActiveTab("clans")}>Кланы</button>
                <button onClick={() => setActiveTab("players")}>Игроки</button>
                <button onClick={() => setActiveTab("chat")}>Чаты</button>
                <button onClick={() => setActiveTab("rewards")}>Бонусы и наказания</button>
                <button onClick={() => setActiveTab("security")}>Безопасность</button>
            </div>
            <div className="admin-content">
                {activeTab === "clans" && <ClansTab />}
                {activeTab === "players" && <PlayersTab />}
                {activeTab === "chat" && <ChatTab />}
                {activeTab === "rewards" && <RewardsTab />}
                {activeTab === "security" && <SecurityTab />}
            </div>
        </div>
    );
};

export default AdminPanel;
