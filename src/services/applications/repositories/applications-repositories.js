/* eslint-disable camelcase */
import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import CacheService from '../../cache/redis-service.js';

class AppsRepositories {
  constructor() {
    this.pool = new Pool();
    this.cacheService = new CacheService();
  }

  async createApp({ user_id, job_id, status = 'pending' }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: `
        INSERT INTO applications(id, user_id, job_id, status, created_at, updated_at) 
        VALUES($1, $2, $3, $4, $5, $6) 
        RETURNING id, user_id, job_id, status
      `,
      values: [id, user_id, job_id, status, createdAt, updatedAt],
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
      return {
        applications: JSON.parse(applications),
        source: 'cache',
      };
    } catch {
      const query = {
        text: `
          SELECT 
            applications.id,
            applications.user_id,
            applications.job_id,
            applications.status,
            applications.created_at,
            applications.updated_at,
            users.name AS user_name,
            users.email AS user_email,
            jobs.title AS job_title,
            jobs.job_type,
            jobs.location_type AS job_location_type,
            jobs.location_city AS job_location_city,
            jobs.status AS job_status
          FROM applications
          INNER JOIN users ON applications.user_id = users.id
          INNER JOIN jobs ON applications.job_id = jobs.id
        `,
      };

      const result = await this.pool.query(query);
      const applications = result.rows || [];

      await this.cacheService.set(cacheKey, JSON.stringify(applications));

      return {
        applications,
        source: 'database',
      };
    }
  }

  async getAppById(id) {
    const cacheKey = `app:${id}`;
    try {
      const application = await this.cacheService.get(cacheKey);
      return {
        application: JSON.parse(application),
        source: 'cache',
      };
    } catch {
      const query = {
        text: 'SELECT * FROM applications WHERE id = $1',
        values: [id],
      };

      const result = await this.pool.query(query);

      if (!result.rowCount) {
        return {
          application: null,
          source: 'database',
        };
      }

      await this.cacheService.set(cacheKey, JSON.stringify(result.rows[0]));

      return {
        application: result.rows[0],
        source: 'database',
      };
    }
  }

  async getAppByUserId(userId) {
    const cacheKey = `apps:users:${userId}`;
    try {
      const applications = await this.cacheService.get(cacheKey);
      return {
        applications: JSON.parse(applications),
        source: 'cache',
      };
    } catch {
      const query = {
        text: 'SELECT * FROM applications WHERE user_id = $1',
        values: [userId],
      };

      const result = await this.pool.query(query);
      const applications = result.rows || [];

      await this.cacheService.set(cacheKey, JSON.stringify(applications));

      return {
        applications,
        source: 'database',
      };
    }
  }

  async getAppByJobId(jobId) {
    const cacheKey = `apps:jobs:${jobId}`;
    try {
      const applications = await this.cacheService.get(cacheKey);
      return {
        applications: JSON.parse(applications),
        source: 'cache',
      };
    } catch {
      const query = {
        text: 'SELECT * FROM applications WHERE job_id = $1',
        values: [jobId],
      };

      const result = await this.pool.query(query);
      const applications = result.rows || [];

      await this.cacheService.set(cacheKey, JSON.stringify(applications));

      return {
        applications,
        source: 'database',
      };
    }
  }

  async verifyUserAlreadyApplied({ user_id, job_id }) {
    const query = {
      text: 'SELECT id FROM applications WHERE user_id = $1 AND job_id = $2',
      values: [user_id, job_id],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      return result.rows[0];
    }
    return null;
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
      return result.rows[0];
    }

    return null;
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
      return result.rows[0].id;
    }

    return null;
  }
}

export default new AppsRepositories();