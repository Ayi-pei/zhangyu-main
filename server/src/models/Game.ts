interface Game {
  id: string;
  type: string;
  players: string[];
  status: "waiting" | "active" | "completed";
  result: {
    winner: string;
    score: number;
  };
  createdAt: Date;
  updatedAt: Date;
} 