import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./ItemTransferModal.css";

const ItemTransferModal = ({ item, players, onClose, onConfirm }) => {
  const [selectedPlayer, setSelectedPlayer] = useState("");
  const [price, setPrice] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (players.length > 0) {
      setSelectedPlayer(players[0].id);
    }
  }, [players]);

  const handleSubmit = () => {
    onConfirm({
      item,
      recipientId: selectedPlayer,
      price: Number(price),
      comment,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Передача предмета</h2>
        <p>{item.name}</p>

        <label>Выберите игрока:</label>
        <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)}>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.username}
            </option>
          ))}
        </select>

        <label>Стоимость (если передача за деньги):</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

        <label>Комментарий (для модераторов):</label>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />

        <div className="modal-buttons">
          <button onClick={handleSubmit}>ОК</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

ItemTransferModal.propTypes = {
  item: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ItemTransferModal;
