/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('applications', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
    },
    job_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"jobs"',
      onDelete: 'CASCADE',
    },
    status: {
      type: 'VARCHAR(50)',
      notNull: true,
      default: 'pending',
    },
    created_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
    updated_at: {
      type: 'TIMESTAMPTZ',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Indeks untuk mempercepat pencarian lamaran berdasarkan user atau lowongan
  pgm.createIndex('applications', 'user_id');
  pgm.createIndex('applications', 'job_id');
};

export const down = (pgm) => {
  pgm.dropTable('applications');
};