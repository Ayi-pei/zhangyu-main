import React from 'react';
import { Button } from '../../common/Button';

interface GameCardProps {
  game: Game;
  onJoin: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onJoin }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h3 className="text-xl font-bold">{game.type}</h3>
      <div className="mt-2">
        <p>状态: {game.status}</p>
        <p>玩家数: {game.players.length}</p>
      </div>
      {game.status === 'waiting' && (
        <Button 
          onClick={onJoin}
          className="mt-4 w-full"
        >
          加入游戏
        </Button>
      )}
    </div>
  );
}; 