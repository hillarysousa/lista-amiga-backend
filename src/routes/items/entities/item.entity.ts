import { List } from 'src/routes/lists/entities/list.entity';
import { User } from 'src/routes/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'bool', default: false })
  checked: boolean;

  @ManyToOne(() => List, (list) => list.items, { onDelete: 'CASCADE' })
  list: List;

  @ManyToOne(() => User, (user) => user.items, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  owner: User;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;
}
