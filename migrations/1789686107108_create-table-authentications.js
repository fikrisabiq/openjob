export const shorthands = undefined;

export const up = (pgm) => {
  pgm.createTable('authentications', {
    token: {
      type: 'TEXT',
      notNull: true,
      primaryKey: true
    },
  });
};

export const down = (pgm) => {
  pgm.dropTable('authentications');
};