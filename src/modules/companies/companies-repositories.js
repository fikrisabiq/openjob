import { Pool } from 'pg';
import { nanoid } from 'nanoid';
import CacheService from '../../infrastructure/cache/redis-service.js';

class CompaniesRepositories {
  constructor() {
    this.pool = new Pool();
    this.cacheService = new CacheService();
  }
  async createCompany({ name, location, description, owner }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    const query = {
      text: 'INSERT INTO companies(id, name, location, description, owner, created_at, updated_at) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, name, location, description, owner, createdAt, updatedAt],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete('companies:all');
    }

    return result.rows[0];
  }

  async getCompanies() {
    const cacheKey = 'companies:all';
    try {
      const companies = await this.cacheService.get(cacheKey);
      return {
        companies: JSON.parse(companies),
        source: 'cache',
      };
    } catch {
      const query = {
        text: 'SELECT id, name, location, description, created_at, updated_at FROM companies',
      };

      const result = await this.pool.query(query);

      const companies = result.rows || [];

      await this.cacheService.set(cacheKey, JSON.stringify(companies));

      return {
        companies,
        source: 'database',
      };
    }
  }

  async getCompanyById(id) {
    const cacheKey = `companies:${id}`;
    try {
      const company = await this.cacheService.get(cacheKey);
      return {
        company: JSON.parse(company),
        source: 'cache',
      };
    } catch {
      const query = {
        text: 'SELECT * FROM companies WHERE id = $1',
        values: [id],
      };

      const result = await this.pool.query(query);

      if (!result.rowCount) {
        return {
          company: null,
          source: 'database',
        };
      }

      await this.cacheService.set(cacheKey, JSON.stringify(result.rows[0]));

      return {
        company: result.rows[0],
        source: 'database',
      };
    }
  }

  async editCompany({ id, name, location, description }) {
    const updatedAt = new Date().toISOString();

    const query = {
      text: 'UPDATE companies SET name = $1, location = $2, description = $3, updated_at = $4 WHERE id = $5 RETURNING id',
      values: [name, location, description, updatedAt, id],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete(`companies:${id}`);
      await this.cacheService.delete('companies:all');
    }

    return result.rows[0];
  }

  async deleteCompany(id) {
    const query = {
      text: 'DELETE FROM companies WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this.pool.query(query);

    if (result.rows[0]) {
      await this.cacheService.delete(`companies:${id}`);
      await this.cacheService.delete('companies:all');
    }

    return result.rows[0]?.id;
  }
}

export default new CompaniesRepositories();