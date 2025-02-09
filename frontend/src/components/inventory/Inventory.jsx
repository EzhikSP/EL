import React, { useState, useEffect } from "react";
import axios from "axios";
import ItemCard from "./ItemCard";
import "./Inventory.css";

const categories = ["Все", "Оружие", "Броня", "Ресурсы", "Расходники"];

const Inventory = ({ playerId }) => {
  const [items, setItems] = useState([]);
  const [players, setPlayers] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Все");

  useEffect(() => {
    // Загружаем предметы инвентаря игрока
    const fetchItems = async () => {
      try {
        const response = await axios.get(`/api/inventory/${playerId}`);
        setItems(response.data);
      } catch (error) {
        console.error("Ошибка загрузки инвентаря:", error);
      }
    };

    // Загружаем список онлайн-игроков
    const fetchPlayers = async () => {
      try {
        const response = await axios.get(`/api/players/online`);
        setPlayers(response.data);
      } catch (error) {
        console.error("Ошибка загрузки списка игроков:", error);
      }
    };

    fetchItems();
    fetchPlayers();
  }, [playerId]);

  const handleUse = async (item) => {
    try {
      const response = await axios.post(`/api/inventory/${playerId}/use`, { itemId: item.id });
      console.log("Предмет использован:", response.data);
      // Если предмет стакаемый, уменьшаем количество, иначе удаляем
      setItems((prevItems) =>
        prevItems.map((i) =>
          i.id === item.id && i.quantity > 1
            ? { ...i, quantity: i.quantity - 1 }
            : i.id === item.id
            ? null
            : i
        ).filter(i => i !== null)
      );
    } catch (error) {
      console.error("Ошибка использования предмета:", error);
    }
  };

  const handleEquip = async (item) => {
    try {
      const response = await axios.post(`/api/inventory/${playerId}/equip`, { itemId: item.id });
      console.log("Предмет надет:", response.data);
      // Логика обновления инвентаря зависит от серверного ответа
    } catch (error) {
      console.error("Ошибка надевания предмета:", error);
    }
  };

  const handleTransfer = async (transferData) => {
    try {
      const response = await axios.post(`/api/inventory/transfer`, transferData);
      console.log("Передача успешна:", response.data);
      // Если передача прошла, удаляем предмет из инвентаря
      setItems((prevItems) => prevItems.filter((item) => item.id !== transferData.item.id));
    } catch (error) {
      console.error("Ошибка передачи предмета:", error);
    }
  };

  const handleDrop = async (itemId) => {
    try {
      const response = await axios.delete(`/api/inventory/${playerId}/drop/${itemId}`);
      console.log("Предмет выброшен:", response.data);
      setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Ошибка выбрасывания предмета:", error);
    }
  };

  const filteredItems =
    activeCategory === "Все"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <div className="inventory">
      <h2>Инвентарь</h2>
      <div className="inventory-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            className={activeCategory === cat ? "active" : ""}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="item-list">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              players={players}
              onUse={handleUse}
              onEquip={handleEquip}
              onTransfer={handleTransfer}
              onDrop={handleDrop}
            />
          ))
        ) : (
          <p>Нет предметов в этой категории</p>
        )}
      </div>
    </div>
  );
};

export default Inventory;
