// FILEPATH: d:/ayi/zhangyu-main/server/src/models/User.ts

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  creditScore: { type: Number, default: 1000 },
  totalWinnings: { type: Number, default: 0 },
  gamesPlayed: { type: Number, default: 0 }
});

export default mongoose.model('User', userSchema);
