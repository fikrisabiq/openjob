import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import CacheService from '../../cache/redis-service.js';

class UserRepositories {
  constructor() {
    this._pool = new Pool();
    this.cacheService = new CacheService();
  }

  async createUser({ name, email, password, role }) {
    const id = nanoid(16);
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO users(id, name, email, password, role, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, name, email, hashedPassword, role, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getUserById(id) {
    const cacheKey = `user:${id}`;
    try {
      const user = await this.cacheService.get(cacheKey);
      return JSON.parse(user);
    } catch {
      const query = {
        text: 'SELECT * FROM users WHERE id = $1',
        values: [id],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        return null;
      }

      await this.cacheService.set(cacheKey, JSON.stringify(result.rows[0]));

      return result.rows[0];
    }
  }

  async verifyUserCredential(email, password) {
    const query = {
      text: 'SELECT id, password FROM users WHERE email = $1',
      values: [email],
    };

    const user = await this._pool.query(query);
    if (!user.rowCount) {
      return null;
    }

    const { id, password: hashedPassword } = user.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, hashedPassword);

    if (!isPasswordMatch) {
      return null;
    }
    return id;
  }

  async verifyNewEmail(email) {
    const query = {
      text: 'SELECT email FROM users WHERE email = $1',
      values: [email],
    };

    const result = await this._pool.query(query);

    return result.rows.length > 0;
  }
}

export default new UserRepositories();