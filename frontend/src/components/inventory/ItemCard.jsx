import React, { useState } from "react";
import PropTypes from "prop-types";
import ItemTransferModal from "./ItemTransferModal";
import "./ItemCard.css";

const ItemCard = ({ item, onUse, onEquip, onTransfer, onDrop, players }) => {
  const [showDropConfirm, setShowDropConfirm] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);

  const handleDropClick = () => {
    setShowDropConfirm(true);
  };

  const confirmDrop = () => {
    onDrop(item.id);
    setShowDropConfirm(false);
  };

  const handleTransferClick = () => {
    setShowTransferModal(true);
  };

  const handleTransferConfirm = (transferData) => {
    onTransfer(transferData);
    setShowTransferModal(false);
  };

  return (
    <div className="item-card">
      <img src={item.icon} alt={item.name} className="item-icon" />
      <div className="item-info">
        <h4>{item.name}</h4>
        <p>Количество: {item.quantity}</p>
        <p>Вес: {item.weight} кг</p>
        <p>Характеристики: {item.attributes || "Нет"}</p>
      </div>
      <div className="item-actions">
        {item.usable && (
          <button className="use-btn" onClick={() => onUse(item)}>
            Использовать
          </button>
        )}
        {item.equipable && (
          <button className="equip-btn" onClick={() => onEquip(item)}>
            Надеть
          </button>
        )}
        <button className="transfer-btn" onClick={handleTransferClick}>
          Передать
        </button>
        <button className="drop-btn" onClick={handleDropClick}>
          Выбросить
        </button>
      </div>

      {showDropConfirm && (
        <div className="modal">
          <p>Вы уверены, что хотите выбросить {item.name}?</p>
          <button onClick={confirmDrop}>Да</button>
          <button onClick={() => setShowDropConfirm(false)}>Нет</button>
        </div>
      )}

      {showTransferModal && (
        <ItemTransferModal
          item={item}
          players={players}
          onClose={() => setShowTransferModal(false)}
          onConfirm={handleTransferConfirm}
        />
      )}
    </div>
  );
};

ItemCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.number.isRequired,
    icon: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
    weight: PropTypes.number.isRequired,
    attributes: PropTypes.string,
    usable: PropTypes.bool,
    equipable: PropTypes.bool,
    category: PropTypes.string.isRequired,
  }).isRequired,
  onUse: PropTypes.func.isRequired,
  onEquip: PropTypes.func.isRequired,
  onTransfer: PropTypes.func.isRequired,
  onDrop: PropTypes.func.isRequired,
  players: PropTypes.array.isRequired,
};

export default ItemCard;
