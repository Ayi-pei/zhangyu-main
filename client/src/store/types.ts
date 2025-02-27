import { IUser } from '../models/User';

export interface RootState {
  user: {
    currentUser: IUser | null;
  };
  admin: {
    currentAdmin: {
      id: string;
      username: string;
      avatar?: string;
    } | null;
  };
} 