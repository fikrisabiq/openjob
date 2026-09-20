
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import CacheService from '../../cache/redis-service.js';

class BookmarksRepositories {
  constructor() {
    this.pool = new Pool();
    this.cacheService = new CacheService();
  }
  async createBookmark({ userId, jobId }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO bookmarks(id, user_id, job_id) VALUES($1, $2, $3) RETURNING id, user_id, job_id, created_at',
      values: [id, userId, jobId],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete(`bookmarks:jobs:${result.rows[0].job_id}`);
      await this.cacheService.delete(`bookmark:users:${result.rows[0].user_id}:jobs:${result.rows[0].job_id}`);
    }

    return result.rows[0];
  }

  async getBookmarks(userId) {
    const cacheKey = `bookmarks:user:${userId}`;
    try {
      const bookmarks = await this.cacheService.get(cacheKey);
      return JSON.parse(bookmarks);
    } catch {
      const query = {
        text: `SELECT bookmarks.id, bookmarks.created_at
      FROM bookmarks
      INNER JOIN users ON bookmarks.user_id = users.id
      WHERE bookmarks.user_id = $1`,
        values: [userId],
      };

      const result = await this.pool.query(query);

      if (!result.rowCount) {
        return null;
      }

      await this.cacheService.set(cacheKey, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async getBookmarksById(id, jobId) {
    const cacheKey = `bookmark:users:${id}:jobs:${jobId}`;
    try {
      const bookmark = await this.cacheService.get(cacheKey);
      return JSON.parse(bookmark);
    } catch {
      const query = {
        text: `SELECT bookmarks.id, users.name AS "Nama User", jobs.title AS "Pekerjaan", bookmarks.created_at
      FROM bookmarks
      INNER JOIN users ON bookmarks.user_id = users.id
      INNER JOIN jobs ON bookmarks.job_id = jobs.id
      WHERE bookmarks.id = $1 AND bookmarks.job_id = $2`,
        values: [id, jobId],
      };

      const result = await this.pool.query(query);

      if (!result.rowCount) {
        return null;
      }

      await this.cacheService.set(cacheKey, JSON.stringify(result.rows[0]));

      return result.rows[0];
    }
  }

  async deleteBookmark(jobId) {
    const query = {
      text: 'DELETE FROM bookmarks WHERE bookmarks.job_id = $1 RETURNING id, user_id, job_id',
      values: [jobId],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete(`bookmarks:jobs:${result.rows[0].job_id}`);
      await this.cacheService.delete(`bookmark:users:${result.rows[0].user_id}:jobs:${result.rows[0].job_id}`);
    }

    return result.rows[0].id;
  }
}

export default new BookmarksRepositories();