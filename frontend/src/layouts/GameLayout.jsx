import React from "react";
import ChatPanel from "../components/Chat/ChatPanel";
import OnlineUsersList from "../components/Chat/OnlineUsersList";
import GameScreen from "../components/GameScreen";
import Splitter, { SplitDirection } from "@devbookhq/splitter";
import "./GameLayout.css";

const GameLayout = () => {
  return (
    <div className="game-layout">

          <Splitter
              direction={SplitDirection.Vertical}
              minHeights={[200, 100]} // Минимальная высота для игрового окна и чата
              initialSizes={[60, 40]} // Начальные пропорции (60% - игра, 40% - чат)
          >
            <div className="top-section">
                <GameScreen />
            </div>

          <Splitter direction={SplitDirection.Horizontal} minWidths={[200, 100]} initialSizes={[75, 25]}>
              <div className="bottom-section">
                  <div className="chat-container">
                     <ChatPanel />
                  </div>
                  <div className="players-list">
                    <OnlineUsersList />
                  </div>
              </div>
          </Splitter>
          </Splitter>
    </div>
  );
};

export default GameLayout;
