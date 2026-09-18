
import { Pool } from 'pg';

class ProfileRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async getProfile(userId) {
    const query = {
      text: `SELECT id, name, email, role
      FROM users
      WHERE id = $1`,
      values: [userId],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getProfileApplications(userId) {
    const query = {
      text: `SELECT users.name, jobs.title, applications.status, applications.created_at, applications.updated_at
      FROM applications
      INNER JOIN users ON applications.user_id = users.id
      LEFT JOIN jobs ON applications.job_id = jobs.id
      WHERE users.id = $1`,
      values: [userId],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getProfileBookmarks(userId) {
    const query = {
      text: `SELECT users.name, jobs.title, bookmarks.created_at
      FROM bookmarks
      INNER JOIN users ON bookmarks.user_id = users.id
      LEFT JOIN jobs ON bookmarks.job_id = jobs.id
      WHERE users.id = $1`,
      values: [userId],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }
}

export default new ProfileRepositories();