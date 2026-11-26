import 'dotenv/config';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DataSource } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';

const databasePath = resolve(
  process.cwd(),
  process.env.DATABASE_PATH || 'data/task-manager.sqlite',
);

mkdirSync(dirname(databasePath), { recursive: true });

const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: databasePath,
  entities: [Task],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default dataSource;
