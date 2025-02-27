interface LotteryCardProps {
  title: string;
  description: string;
  participants: number;
  endTime: Date;
  onJoin: () => void;
}

const LotteryCard: React.FC<LotteryCardProps> = ({
  title,
  description,
  participants,
  endTime,
  onJoin
}) => {
  return (
    <div className="lottery-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="lottery-stats">
        <span>参与人数: {participants}</span>
        <span>结束时间: {endTime.toLocaleString()}</span>
      </div>
      <button onClick={onJoin}>立即参与</button>
    </div>
  );
}; 