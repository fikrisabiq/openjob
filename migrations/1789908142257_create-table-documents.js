/* eslint-disable camelcase */

export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('documents', {
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
    filename: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    original_name: {
      type: 'VARCHAR(255)',
      notNull: true,
    },
    size: {
      type: 'BIGINT',
      notNull: true,
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

  pgm.createIndex('documents', 'user_id');
};

export const down = (pgm) => {
  pgm.dropTable('documents');
};