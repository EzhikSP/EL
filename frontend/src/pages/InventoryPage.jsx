import React, { useState } from "react";

function InventoryPage() {
  const [inventory, setInventory] = useState([
    { id: 1, name: "Меч", type: "Оружие", attack: 10 },
    { id: 2, name: "Щит", type: "Защита", defense: 8 },
    { id: 3, name: "Зелье лечения", type: "Зелье", heal: 20 },
  ]);

  const handleUseItem = (item) => {
    if (item.type === "Зелье") {
      alert(`Вы использовали ${item.name}, восстановив ${item.heal} здоровья.`);
      setInventory((prevInventory) => prevInventory.filter((i) => i.id !== item.id));
    }
  };

  return (
      <div className="inventory-page">
        <h2>Инвентарь</h2>
        <ul>
          {inventory.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong> ({item.type}){" "}
                {item.type === "Зелье" && (
                    <button onClick={() => handleUseItem(item)}>Использовать</button>
                )}
              </li>
          ))}
        </ul>
      </div>
  );
}

export default InventoryPage;
