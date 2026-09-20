
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
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO bookmarks(id, user_id, job_id, created_at) VALUES($1, $2, $3, $4) RETURNING id, user_id, job_id, created_at',
      values: [id, userId, jobId, createdAt],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete(`bookmarks:user:${result.rows[0].user_id}`);
      await this.cacheService.delete(`bookmarks:jobs:${result.rows[0].job_id}`);
      await this.cacheService.delete(`bookmark:users:${result.rows[0].user_id}:jobs:${result.rows[0].job_id}`);
    }

    return result.rows[0];
  }

  async getBookmarks(userId) {
    const cacheKey = `bookmarks:user:${userId}`;
    try {
      const bookmarks = await this.cacheService.get(cacheKey);
      return {
        bookmarks: JSON.parse(bookmarks),
        source: 'cache',
      };
    } catch {
      const query = {
        text: `
          SELECT 
            bookmarks.id,
            bookmarks.user_id,
            bookmarks.job_id,
            bookmarks.created_at,
            jobs.company_id,
            jobs.category_id,
            jobs.title,
            jobs.description,
            jobs.job_type,
            jobs.experience_level,
            jobs.location_type,
            jobs.location_city,
            jobs.salary_min,
            jobs.salary_max,
            jobs.is_salary_visible,
            jobs.status,
            companies.name AS company_name,
            categories.name AS category_name
          FROM bookmarks
          INNER JOIN jobs ON bookmarks.job_id = jobs.id
          LEFT JOIN companies ON jobs.company_id = companies.id
          LEFT JOIN categories ON jobs.category_id = categories.id
          WHERE bookmarks.user_id = $1
        `,
        values: [userId],
      };

      const result = await this.pool.query(query);
      const bookmarks = result.rows || [];

      await this.cacheService.set(cacheKey, JSON.stringify(bookmarks));

      return {
        bookmarks,
        source: 'database',
      };
    }
  }

  async getBookmarksById(id, jobId) {
    const cacheKey = `bookmark:${id}:${jobId}`;
    try {
      const bookmark = await this.cacheService.get(cacheKey);
      return {
        bookmark: JSON.parse(bookmark),
        source: 'cache',
      };
    } catch {
      const query = {
        text: `
          SELECT 
            bookmarks.*,
            jobs.title AS job_title
          FROM bookmarks
          INNER JOIN jobs ON bookmarks.job_id = jobs.id
          WHERE bookmarks.id = $1 AND bookmarks.job_id = $2
        `,
        values: [id, jobId],
      };

      const result = await this.pool.query(query);

      if (!result.rowCount) {
        return {
          bookmark: null,
          source: 'database',
        };
      }

      await this.cacheService.set(cacheKey, JSON.stringify(result.rows[0]));

      return {
        bookmark: result.rows[0],
        source: 'database',
      };
    }
  }

  async deleteBookmark(jobId) {
    const query = {
      text: 'DELETE FROM bookmarks WHERE job_id = $1 RETURNING id, user_id, job_id',
      values: [jobId],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete(`bookmarks:user:${result.rows[0].user_id}`);
      await this.cacheService.delete(`bookmarks:jobs:${result.rows[0].job_id}`);
      await this.cacheService.delete(`bookmark:${result.rows[0].id}:${result.rows[0].job_id}`);
      return result.rows[0].id;
    }

    return null;
  }
}

export default new BookmarksRepositories();