import pg from "pg";

pg.types.setTypeParser(pg.types.builtins.DATE, (value) => value);
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value) => Number(value));

export const pool = new pg.Pool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER ?? "librarian",
  password: process.env.DB_PASSWORD ?? "password",
  database: process.env.DB_DATABASE ?? "library",
});
