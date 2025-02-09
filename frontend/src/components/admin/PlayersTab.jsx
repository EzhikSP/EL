import React, { useEffect, useState } from "react";
import axios from "axios";

const PlayersTab = () => {
    const [players, setPlayers] = useState([]);
    const [banReason, setBanReason] = useState("");
    const [banDuration, setBanDuration] = useState(""); // В минутах
    const [muteReason, setMuteReason] = useState("");
    const [muteDuration, setMuteDuration] = useState("");

    useEffect(() => {
        fetchPlayers();
    }, []);

    const fetchPlayers = async () => {
        try {
            const response = await axios.get("/admin/players");
            setPlayers(response.data);
        } catch (error) {
            console.error("Ошибка загрузки игроков:", error);
        }
    };

    const handleBan = async (playerId) => {
        if (!banReason.trim() || !banDuration) {
            alert("Укажите причину и срок бана.");
            return;
        }
        try {
            await axios.post(`/admin/ban/${playerId}`, {
                reason: banReason,
                duration: parseInt(banDuration, 10),
            });
            alert("Игрок забанен.");
            fetchPlayers();
        } catch (error) {
            console.error("Ошибка при бане:", error);
        }
    };

    const handleUnban = async (playerId) => {
        try {
            await axios.post(`/admin/unban/${playerId}`);
            alert("Игрок разбанен.");
            fetchPlayers();
        } catch (error) {
            console.error("Ошибка при разбане:", error);
        }
    };

    const handleMute = async (playerId) => {
        if (!muteReason.trim() || !muteDuration) {
            alert("Укажите причину и срок мута.");
            return;
        }
        try {
            await axios.post(`/admin/mute/${playerId}`, {
                reason: muteReason,
                duration: parseInt(muteDuration, 10),
            });
            alert("Игрок замучен.");
            fetchPlayers();
        } catch (error) {
            console.error("Ошибка при муте:", error);
        }
    };

    const handleUnmute = async (playerId) => {
        try {
            await axios.post(`/admin/unmute/${playerId}`);
            alert("Игрок размучен.");
            fetchPlayers();
        } catch (error) {
            console.error("Ошибка при размуте:", error);
        }
    };

    return (
        <div>
            <h2>Список игроков</h2>
            <table>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Имя</th>
                    <th>Бан</th>
                    <th>Мут</th>
                    <th>Действия</th>
                </tr>
                </thead>
                <tbody>
                {players.map((player) => (
                    <tr key={player.id}>
                        <td>{player.id}</td>
                        <td>{player.username}</td>
                        <td>
                            {player.is_banned
                                ? `До ${new Date(player.ban_until).toLocaleString()}`
                                : "Нет"}
                        </td>
                        <td>
                            {player.is_muted
                                ? `До ${new Date(player.mute_until).toLocaleString()}`
                                : "Нет"}
                        </td>
                        <td>
                            {player.is_banned ? (
                                <button onClick={() => handleUnban(player.id)}>Разбан</button>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Причина бана"
                                        value={banReason}
                                        onChange={(e) => setBanReason(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Срок (минуты)"
                                        value={banDuration}
                                        onChange={(e) => setBanDuration(e.target.value)}
                                    />
                                    <button onClick={() => handleBan(player.id)}>Бан</button>
                                </>
                            )}
                            {player.is_muted ? (
                                <button onClick={() => handleUnmute(player.id)}>Размут</button>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        placeholder="Причина мута"
                                        value={muteReason}
                                        onChange={(e) => setMuteReason(e.target.value)}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Срок (минуты)"
                                        value={muteDuration}
                                        onChange={(e) => setMuteDuration(e.target.value)}
                                    />
                                    <button onClick={() => handleMute(player.id)}>Мут</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default PlayersTab;
