import { createPool, Pool, PoolOptions } from "mysql2/promise";
import config from "config";

console.log(config.get("database.master"));
export function createDB(): Pool {
  try {
    const db: Pool = createPool(config.get("database.master") as PoolOptions);
    return db;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
