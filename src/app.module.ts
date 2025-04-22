import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsModule } from './routes/lists/lists.module';
import { ItemsModule } from './routes/items/items.module';
import { UsersModule } from './routes/user/users.module';

@Module({
  imports: [
    ListsModule,
    ItemsModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      url: process.env.DB_URL,
      ssl: {
        rejectUnauthorized: false,
      },
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD || ''),
      database: process.env.DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
