// FILEPATH: d:/ayi/zhangyu-main/client/src/utils/storage.ts

// 定义可以存储的键的类型
type StorageKey = 'token' | 'user' | 'gameState' | 'settings';

// 定义每个键对应的值的类型
interface StorageSchema {
  token: string;
  user: {
    id: string;
    username: string;
    balance: number;
  };
  gameState: {
    currentBet: number;
    lastResult: 'win' | 'lose' | null;
  };
  settings: {
    theme: 'light' | 'dark';
    soundEnabled: boolean;
  };
}

class Storage {
  private prefix: string;

  constructor(prefix: string = 'app_') {
    this.prefix = prefix;
  }

  private getKey(key: StorageKey): string {
    return `${this.prefix}${key}`;
  }

  get<K extends StorageKey>(key: K): StorageSchema[K] | null {
    const item = localStorage.getItem(this.getKey(key));
    if (item === null) {
      return null;
    }
    try {
      return JSON.parse(item) as StorageSchema[K];
    } catch {
      console.error(`Failed to parse stored item with key: ${key}`);
      return null;
    }
  }

  set<K extends StorageKey>(key: K, value: StorageSchema[K]): void {
    try {
      localStorage.setItem(this.getKey(key), JSON.stringify(value));
    } catch (e) {
      console.error(`Failed to store item with key: ${key}`, e);
    }
  }

  remove(key: StorageKey): void {
    localStorage.removeItem(this.getKey(key));
  }

  clear(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(this.prefix))
      .forEach(key => localStorage.removeItem(key));
  }

  // 辅助方法
  getToken(): string | null {
    return this.get('token');
  }

  setToken(token: string): void {
    this.set('token', token);
  }

  getUser(): StorageSchema['user'] | null {
    return this.get('user');
  }

  setUser(user: StorageSchema['user']): void {
    this.set('user', user);
  }

  updateUserBalance(newBalance: number): void {
    const user = this.getUser();
    if (user) {
      this.setUser({ ...user, balance: newBalance });
    }
  }

  getGameState(): StorageSchema['gameState'] | null {
    return this.get('gameState');
  }

  setGameState(gameState: StorageSchema['gameState']): void {
    this.set('gameState', gameState);
  }

  getSettings(): StorageSchema['settings'] | null {
    return this.get('settings');
  }

  setSettings(settings: StorageSchema['settings']): void {
    this.set('settings', settings);
  }
}

// 创建并导出一个 Storage 实例
const storage = new Storage();
export default storage;
