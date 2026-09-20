
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
      text: `
      SELECT 
        applications.id,
        applications.user_id,
        applications.job_id,
        applications.status,
        applications.created_at,
        applications.updated_at,
        jobs.title,
        jobs.description,
        jobs.experience_level,
        jobs.job_type,
        jobs.is_salary_visible,
        companies.name AS company_name,
        companies.location AS company_location,
        categories.name AS category_name,
        users.name AS user_name
      FROM applications
      INNER JOIN users ON applications.user_id = users.id
      INNER JOIN jobs ON applications.job_id = jobs.id
      INNER JOIN companies ON jobs.company_id = companies.id
      INNER JOIN categories ON jobs.category_id = categories.id
      WHERE applications.user_id = $1
    `,
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