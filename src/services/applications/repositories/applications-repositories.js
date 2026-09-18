/* eslint-disable camelcase */
import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class AppsRepositories {
  constructor() {
    this.pool = new Pool();
  }
  async createApp({ user_id, job_id, status }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO applications(id, user_id, job_id, status) VALUES($1, $2, $3, $4) RETURNING id, user_id, job_id, status, created_at, updated_at',
      values: [id, user_id, job_id, status],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getApps() {
    const query = {
      text: 'SELECT * FROM applications'
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getAppById(id) {
    const query = {
      text: 'SELECT * FROM applications WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getAppByUserId(userId) {
    const query = {
      text: `SELECT applications.id, applications.user_id, users.name AS "Nama User", jobs.title AS "Pekerjaan", applications.status 
      FROM applications
      INNER JOIN users ON applications.user_id = users.id
      LEFT JOIN jobs ON applications.job_id = jobs.id
      WHERE applications.user_id = $1`,
      values: [userId],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getAppByJobId(JobId) {
    const query = {
      text: `SELECT applications.id, applications.job_id, users.name AS "Nama User", jobs.title AS "Pekerjaan", applications.status 
      FROM applications
      INNER JOIN jobs ON applications.job_id = jobs.id
      LEFT JOIN users ON applications.user_id = users.id
      WHERE applications.job_id = $1`,
      values: [JobId],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async editApp({ id, status }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE applications SET status = $1, updated_at = $2 WHERE id = $3 RETURNING id',
      values: [status, updatedAt, id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async deleteApp(id) {
    const query = {
      text: 'DELETE FROM applications WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0].id;
  }
}

export default new AppsRepositories();