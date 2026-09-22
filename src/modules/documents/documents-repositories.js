import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class DocumentsRepositories {
  constructor() {
    this.pool = new Pool();
  }

  async addDocument({ userId, filename, originalName, size }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO documents(id, user_id, filename, original_name, size) VALUES($1, $2, $3, $4, $5) RETURNING id, filename, original_name AS "originalName", size',
      values: [id, userId, filename, originalName, size],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async getDocuments() {
    const query = {
      text: 'SELECT * FROM documents'
    };

    const result = await this.pool.query(query);
    return result.rows;
  }

  async getDocumentById(id) {
    const query = {
      text: 'SELECT * FROM documents WHERE id = $1',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }

  async deleteDocumentById(id) {
    const query = {
      text: 'DELETE FROM documents WHERE id = $1 RETURNING id, filename',
      values: [id],
    };

    const result = await this.pool.query(query);
    return result.rows[0];
  }
}

export default new DocumentsRepositories();