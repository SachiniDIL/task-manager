import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databasePath = resolve(
          process.cwd(),
          configService.get<string>(
            'DATABASE_PATH',
            'data/task-manager.sqlite',
          ),
        );

        mkdirSync(dirname(databasePath), { recursive: true });

        return {
          type: 'better-sqlite3' as const,
          database: databasePath,
          autoLoadEntities: true,
          synchronize: false,
        };
      },
    }),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}