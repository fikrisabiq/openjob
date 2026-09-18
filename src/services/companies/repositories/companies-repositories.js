import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class CompaniesRepositories {
  constructor() {
    this.pool = new Pool();
  }
  async createCompany({ name, location, description }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO companies(id, name, location, description, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6) RETURNING id, name, location, description, created_at, updated_at',
      values: [id, name, location, description, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getCompanies() {
    const query = {
      text: 'SELECT * FROM companies'
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getCompanyById(id) {
    const query = {
      text: 'SELECT * FROM companies WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async editCompany({ id, name, location, description }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE companies SET name = $1, location = $2, description = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [name, location, description, updatedAt, id],
    };

    const result = await this.pool.query(query);

    return result.rows[0];
  }

  async deleteCompany(id) {
    const query = {
      text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0]?.id;
  }
}

export default new CompaniesRepositories();