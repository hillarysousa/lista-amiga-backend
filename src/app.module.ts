import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { List } from './routes/lists/entities/list.entity';
import { Item } from './routes/items/entities/item.entity';
import { User } from './routes/user/entities/user.entity';
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
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: String(process.env.DB_PASSWORD || ''),
      database: process.env.DB_NAME,
      entities: [List, Item, User],
      synchronize: true,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
