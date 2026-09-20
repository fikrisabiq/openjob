import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import CacheService from '../../cache/redis-service.js';

class CategoiesRepositories {
  constructor() {
    this.pool = new Pool();
    this.cacheService = new CacheService();
  }
  async createCategories({ name }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO categories(id, name, created_at, updated_at) VALUES($1, $2, $3, $4) RETURNING id, name, created_at, updated_at',
      values: [id, name, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete('categories:all');
    }

    return result.rows[0];
  }

  async getCategories() {
    const cacheKey = 'categories:all';
    try {
      const categories = await this.cacheService.get(cacheKey);
      return JSON.parse(categories);
    } catch {
      const query = {
        text: 'SELECT * FROM categories'
      };

      const result = await this.pool.query(query);

      if (!result.rowCount) {
        return null;
      }

      await this.cacheService.set(cacheKey, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async getCategoryById(id) {
    const cacheKey = `category:${id}`;
    try {
      const category = await this.cacheService.get(cacheKey);
      return JSON.parse(category);
    } catch {
      const query = {
        text: 'SELECT * FROM categories WHERE id = $1',
        values: [id],
      };

      const result = await this.pool.query(query);

      if (!result.rowCount) {
        return null;
      }

      await this.cacheService.set(cacheKey, JSON.stringify(result.rows[0]));

      return result.rows[0];
    }
  }

  async editCategory({ id, name }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE categories SET name = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [name, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete('categories:all');
      await this.cacheService.delete(`category:${id}`);
    }

    return result.rows[0];
  }

  async deleteCategory(id) {
    const query = {
      text: 'DELETE FROM categories WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete('categories:all');
      await this.cacheService.delete(`category:${id}`);
    }

    return result.rows[0]?.id;
  }
}

export default new CategoiesRepositories();