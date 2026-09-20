import { Pool } from 'pg';
import { nanoid } from 'nanoid';

class DocumentsRepositories {
  constructor() {
    this.pool = new Pool();
  }
  async uploadDocument({ userId, fileName, originalName, size }) {
    const id = nanoid(16);
    const query = {
      text: 'INSERT INTO documents(id, userId, fileName, original_name, size) VALUES($1, $2, $3, $4) RETURNING id',
      values: [id, userId, fileName, originalName, size],
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

  async deletedocumentById(id) {
    const query = {
      text: 'DELETE FROM documents WHERE id = $1 RETURNING id, filename',
      values: [id],
    };

    const result = await this.pool.query(query);

    return result.rows[0]?.id;
  }
}

export default new DocumentsRepositories();