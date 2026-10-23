// This file runs the schema and seed
import { readFileSync } from "node:fs";
import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

for (const file of process.argv.slice(2)) {
  await client.query(readFileSync(file, "utf8"));
  console.log("Ran SQL", file);
}

await client.end();
