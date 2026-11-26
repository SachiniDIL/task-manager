import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDueDateToTasks1795685385667 implements MigrationInterface {
  name = 'AddDueDateToTasks1795685385667';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_tasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar(200) NOT NULL, "description" text, "completed" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "dueDate" date)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_tasks"("id", "title", "description", "completed", "createdAt", "updatedAt") SELECT "id", "title", "description", "completed", "createdAt", "updatedAt" FROM "tasks"`,
    );
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`ALTER TABLE "temporary_tasks" RENAME TO "tasks"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" RENAME TO "temporary_tasks"`);
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "title" varchar(200) NOT NULL, "description" text, "completed" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`,
    );
    await queryRunner.query(
      `INSERT INTO "tasks"("id", "title", "description", "completed", "createdAt", "updatedAt") SELECT "id", "title", "description", "completed", "createdAt", "updatedAt" FROM "temporary_tasks"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_tasks"`);
  }
}
