import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

export interface RootState {
  admin: {
    currentAdmin: {
      username?: string;
      avatar?: string;
    };
  };
  user: ReturnType<typeof userReducer>;
}

const store = configureStore({
  reducer: {
    admin: (state = { currentAdmin: {} }) => state, // 临时的 admin reducer
    user: userReducer,
  },
});

export default store; 