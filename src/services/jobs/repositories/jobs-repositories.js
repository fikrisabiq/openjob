/* eslint-disable camelcase */
import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class JobsRepositories {
  constructor() {
    this.pool = new Pool();
  }
  async createJob({
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city = null,
    salary_min = null,
    salary_max = null,
    is_salary_visible = true,
    status = 'open',
  }) {
    const id = nanoid(16);
    const query = {
      text: `
        INSERT INTO jobs (
          id, company_id, category_id, title, description,
          job_type, experience_level, location_type, location_city,
          salary_min, salary_max, is_salary_visible, status
        )
        VALUES (
          $1, $2, $3, $4, $5,
          $6, $7, $8, $9,
          $10, $11, $12, $13
        )
        RETURNING id
      `,
      values: [
        id,
        company_id,
        category_id,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city,
        salary_min,
        salary_max,
        is_salary_visible,
        status
      ],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getJobs() {
    const query = {
      text: 'SELECT * FROM jobs'
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getJobById(id) {
    const query = {
      text: 'SELECT * FROM jobs WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async getJobByCompanyId(company_id) {
    const query = {
      text: `SELECT jobs.id, companies.name AS "Nama Perusahaan", categories.name AS "Kategori"
      FROM jobs
      INNER JOIN companies ON jobs.company_id = companies.id
      LEFT JOIN categories ON jobs.category_id = categories.id
      WHERE jobs.company_id = $1`,
      values: [company_id],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async getJobByCategoryId(category_id) {
    const query = {
      text: `SELECT jobs.id, companies.name AS "Nama Perusahaan", categories.name AS "Kategori"
      FROM jobs
      INNER JOIN categories ON jobs.category_id = categories.id
      LEFT JOIN companies ON jobs.company_id = companies.id
      WHERE jobs.category_id = $1`,
      values: [category_id],
    };

    const result = await this.pool.query(query);

    return result.rows;
  }

  async editJob(id, {
    company_id,
    category_id,
    title,
    description,
    job_type,
    experience_level,
    location_type,
    location_city = null,
    salary_min = null,
    salary_max = null,
    is_salary_visible = true,
    status = 'open',
  }) {
    const query = {
      text: `
        UPDATE jobs
        SET
          company_id = $1,
          category_id = $2,
          title = $3,
          description = $4,
          job_type = $5,
          experience_level = $6,
          location_type = $7,
          location_city = $8,
          salary_min = $9,
          salary_max = $10,
          is_salary_visible = $11,
          status = $12,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $13
        RETURNING id
      `,
      values: [
        company_id,
        category_id,
        title,
        description,
        job_type,
        experience_level,
        location_type,
        location_city,
        salary_min,
        salary_max,
        is_salary_visible,
        status,
        id,
      ],
    };

    const result = await this._pool.query(query);
    return result.rows[0]; // Bernilai row yang terupdate, atau undefined jika id tidak ditemukan
  }

  async deleteJob(id) {
    const query = {
      text: 'DELETE FROM jobs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0].id;
  }
}

export default new JobsRepositories();