import { DataSource } from 'typeorm';
import { Task } from '../tasks/entities/task.entity';

const dataSource = new DataSource({
  type: 'better-sqlite3',

  database: process.env.DATABASE_PATH || 'data/task-manager.sqlite',

  entities: [Task],

  migrations: [__dirname + '/migrations/*{.ts,.js}'],

  synchronize: false,
});

export default dataSource;