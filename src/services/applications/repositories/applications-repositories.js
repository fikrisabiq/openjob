/* eslint-disable camelcase */
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import CacheService from '../../cache/redis-service.js';

class AppsRepositories {
  constructor() {
    this.pool = new Pool();
    this.cacheService = new CacheService();
  }
  async createApp({ user_id, job_id, status }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO applications(id, user_id, job_id, status) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, user_id, job_id, status],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete('apps:all');
      await this.cacheService.delete(`apps:jobs:${result.rows[0].job_id}`);
      await this.cacheService.delete(`apps:users:${result.rows[0].user_id}`);
    }

    return result.rows[0];
  }

  async getApps() {
    const cacheKey = 'apps:all';
    try {
      const applications = await this.cacheService.get(cacheKey);
      return JSON.parse(applications);
    } catch {
      const query = {
        text: 'SELECT * FROM applications'
      };

      const result = await this.pool.query(query);

      if (!result.rowCount) {
        return null;
      }

      await this.cacheService.set(cacheKey, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async getAppById(id) {
    const cacheKey = `app:${id}`;
    try {
      const application = await this.cacheService.get(cacheKey);
      return JSON.parse(application);
    } catch {
      const query = {
        text: 'SELECT * FROM applications WHERE id = $1',
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

  async getAppByUserId(userId) {
    const cacheKey = `apps:users:${userId}`;
    try {
      const applications = await this.cacheService.get(cacheKey);
      return JSON.parse(applications);
    } catch {
      const query = {
        text: `SELECT applications.id, applications.user_id, users.name AS "Nama User", jobs.title AS "Pekerjaan", applications.status 
      FROM applications
      INNER JOIN users ON applications.user_id = users.id
      LEFT JOIN jobs ON applications.job_id = jobs.id
      WHERE applications.user_id = $1`,
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

  async getAppByJobId(JobId) {
    const cacheKey = `apps:jobs:${JobId}`;
    try {
      const applications = await this.cacheService.get(cacheKey);
      return JSON.parse(applications);
    } catch {
      const query = {
        text: `SELECT applications.id, applications.job_id, users.name AS "Nama User", jobs.title AS "Pekerjaan", applications.status 
      FROM applications
      INNER JOIN jobs ON applications.job_id = jobs.id
      LEFT JOIN users ON applications.user_id = users.id
      WHERE applications.job_id = $1`,
        values: [JobId],
      };

      const result = await this.pool.query(query);

      if (!result.rowCount) {
        return null;
      }

      await this.cacheService.set(cacheKey, JSON.stringify(result.rows));

      return result.rows;
    }
  }

  async editApp({ id, status }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE applications SET status = $1, updated_at = $2 WHERE id = $3 RETURNING id, user_id, job_id',
      values: [status, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete('apps:all');
      await this.cacheService.delete(`apps:jobs:${result.rows[0].job_id}`);
      await this.cacheService.delete(`apps:users:${result.rows[0].user_id}`);
      await this.cacheService.delete(`app:${id}`);
    }

    return result.rows[0];
  }

  async deleteApp(id) {
    const query = {
      text: 'DELETE FROM applications WHERE id = $1 RETURNING id, user_id, job_id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete('apps:all');
      await this.cacheService.delete(`apps:jobs:${result.rows[0].job_id}`);
      await this.cacheService.delete(`apps:users:${result.rows[0].user_id}`);
      await this.cacheService.delete(`app:${id}`);
    }

    return result.rows[0].id;
  }
}

export default new AppsRepositories();