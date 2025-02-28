import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '..', 'data');

export interface JsonDB {
  readData: <T>(filename: string) => Promise<T>;
  writeData: <T>(filename: string, data: T) => Promise<void>;
}

export const jsonDb: JsonDB = {
  readData: async <T>(filename: string): Promise<T> => {
    const filePath = path.join(DATA_DIR, filename);
    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      return JSON.parse(data) as T;
    } catch (error) {
      throw new Error(`Error reading ${filename}: ${error}`);
    }
  },

  writeData: async <T>(filename: string, data: T): Promise<void> => {
    const filePath = path.join(DATA_DIR, filename);
    try {
      await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      throw new Error(`Error writing ${filename}: ${error}`);
    }
  }
};