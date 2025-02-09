import React, { useState } from "react";

function BattlePage() {
  const [log, setLog] = useState(["Бой начинается..."]);
  const [enemyHp, setEnemyHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);

  const attack = () => {
    const damage = Math.floor(Math.random() * 20) + 5;
    const enemyDamage = Math.floor(Math.random() * 15) + 5;
    setEnemyHp((hp) => Math.max(0, hp - damage));
    setPlayerHp((hp) => Math.max(0, hp - enemyDamage));

    setLog((prevLog) => [
      ...prevLog,
      `Вы нанесли ${damage} урона`,
      `Противник нанес ${enemyDamage} урона`,
    ]);
  };

  return (
    <div className="battle-page">
      <h2>Бой</h2>
      <div className="battle-status">
        <p>Ваше здоровье: {playerHp}</p>
        <p>Здоровье противника: {enemyHp}</p>
      </div>
      <button onClick={attack} disabled={playerHp === 0 || enemyHp === 0}>
        Атаковать
      </button>
      <div className="battle-log">
        <h3>Лог боя</h3>
        <ul>
          {log.map((entry, index) => (
            <li key={index}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default BattlePage;
