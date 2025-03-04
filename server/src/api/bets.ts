export const placeBet = async (userId: string, amount: number, betType: string[], result: string[], isWin: boolean) => {
    const response = await fetch("/api/bets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, amount, bet_type: betType, result, is_win: isWin }),
    });
    return response.json();
  };
  
  export const getBets = async () => {
    const response = await fetch("/api/bets");
    return response.json();
  };