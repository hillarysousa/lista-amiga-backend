import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from 'src/routes/items/entities/item.entity';
import { User } from 'src/routes/user/entities/user.entity';

@Entity()
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 30 })
  name: string;

  @OneToMany(() => Item, (item) => item.list, { cascade: true })
  items: Item[];

  @ManyToOne(() => User, (user) => user.lists)
  @JoinColumn({ name: 'owner_uid' })
  owner: User;

  @ManyToMany(() => User, (user) => user.sharedLists)
  participants: User[];

  @Column({ type: 'varchar', unique: true, nullable: true })
  shareToken: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;
}
