// src/utils/storage.ts

/**
 * storage 工具模块，用于封装 localStorage 操作。
 */
export const storage = {
    /**
     * 从 localStorage 中读取指定 key 的值，自动进行 JSON 解析
     * @param key 存储的 key
     * @returns 如果存在，则返回解析后的数据，否则返回 null
     */
    get<T>(key: string): T | null {
      const value = localStorage.getItem(key);
      if (!value) return null;
      try {
        return JSON.parse(value) as T;
      } catch (e) {
        console.error(`Error parsing localStorage item "${key}":`, e);
        return value as any;
      }
    },
  
    /**
     * 将数据保存到 localStorage 中，数据将以 JSON 字符串格式存储
     * @param key 存储的 key
     * @param data 要保存的数据
     */
    set(key: string, data: any): void {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
        console.error(`Error saving localStorage item "${key}":`, e);
      }
    },
  
    /**
     * 从 localStorage 中删除指定 key 的数据
     * @param key 存储的 key
     */
    remove(key: string): void {
      localStorage.removeItem(key);
    },
  
    /**
     * 清空所有 localStorage 数据
     */
    clear(): void {
      localStorage.clear();
    },
  };
  //使用示例
  // 存储数据
storage.set('playerBalance', 1000);

// 读取数据
const balance = storage.get<number>('playerBalance');

// 删除数据
storage.remove('playerBalance');

// 清空所有数据
storage.clear();
