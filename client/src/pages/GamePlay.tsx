import React,{ useState, useEffect } from 'react';
import axios from 'axios';

const getCurrentSeoulTime = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
};

const getDuration = (mode: string) => (mode === '3min' ? 180 : 300);

const GamePlay = () => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [roundStartTime, setRoundStartTime] = useState<Date | null>(null);
  const [roundNumber, setRoundNumber] = useState('');
  const [balance, setBalance] = useState(1000);
  const [selectedBets, setSelectedBets] = useState<string[]>([]);
  const [betHistory, setBetHistory] = useState<{ bet_type: string[]; result: string[]; is_win: boolean }[]>([]);

  useEffect(() => {
    const mode = '3min'; // 可以动态设置
    const duration = getDuration(mode);

    const storedStartTime = localStorage.getItem(`roundStart_${mode}`);
    let startTime = storedStartTime ? new Date(parseInt(storedStartTime)) : getCurrentSeoulTime();
    const now = getCurrentSeoulTime();

    if (now.getTime() - startTime.getTime() >= duration * 1000) {
      startNewRound(mode);
    } else {
      setRoundStartTime(startTime);
      setTimeLeft(Math.max(0, duration - Math.floor((now.getTime() - startTime.getTime()) / 1000)));
    }

    const interval = setInterval(() => {
      const now = getCurrentSeoulTime();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      if (elapsed >= duration) {
        startNewRound(mode);
      } else {
        setTimeLeft(duration - elapsed);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const startNewRound = (mode: string) => {
    const newStartTime = getCurrentSeoulTime();
    localStorage.setItem(`roundStart_${mode}`, newStartTime.getTime().toString());
    setRoundStartTime(newStartTime);
    setTimeLeft(getDuration(mode));
    setRoundNumber(generateRoundNumber());
    setSelectedBets([]);
  };

  const generateRoundNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const storedIndex = localStorage.getItem('roundIndex');
    const roundIndex = storedIndex ? parseInt(storedIndex) + 1 : 1;
    localStorage.setItem('roundIndex', roundIndex.toString());
    
    return `${year}${month}${day}${String(roundIndex).padStart(3, '0')}`;
  };

  useEffect(() => {
    const storedBalance = localStorage.getItem('playerBalance');
    setBalance(storedBalance ? parseInt(storedBalance) : 1000);
  }, []);

  const updateBalance = (newBalance: number) => {
    setBalance(newBalance);
    localStorage.setItem('playerBalance', newBalance.toString());
  };

  const handleBet = async () => {
    if (selectedBets.length === 0) return alert('请选择一个或多个选项');
    const betAmount = 100;
    if (betAmount > balance) return alert('余额不足');

    const possibleBigSmall = ['big', 'small'];
    const possibleOddEven = ['odd', 'even'];
    const results = [
      possibleBigSmall[Math.floor(Math.random() * 2)],
      possibleOddEven[Math.floor(Math.random() * 2)],
    ];
    
    const isWin = selectedBets.some((bet) => results.includes(bet));
    const newBalance = isWin ? balance + betAmount * 2 : balance - betAmount;

    updateBalance(newBalance);
    setBetHistory([...betHistory, { bet_type: selectedBets, result: results, is_win: isWin }]);
    setSelectedBets([]);
    
    try {
      await axios.post('/api/bets', { roundNumber, betType: selectedBets, result: results, isWin, betAmount, newBalance });
    } catch (error) {
      console.error('投注数据保存失败:', error);
    }
  };

  return (
    <div>
      <h1>游戏页面</h1>
      <p>回合编号: {roundNumber}</p>
      <p>倒计时: {timeLeft} 秒</p>
      <p>余额: {balance}</p>
      <button onClick={handleBet}>投注</button>
    </div>
  );
};

export default GamePlay;
