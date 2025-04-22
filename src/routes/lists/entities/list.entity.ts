import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Item } from '../../items/entities/item.entity';
import { User } from '../../user/entities/user.entity';

@Entity('list')
export class List {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @OneToMany(() => Item, (item) => item.list, { cascade: true })
  items: Item[];

  @ManyToOne(() => User, (user) => user.lists)
  @JoinColumn({ name: 'owner_uid' })
  owner: User;

  @ManyToMany(() => User, (user) => user.sharedLists)
  @JoinTable({
    name: 'list_participants_user',
    joinColumn: {
      name: 'list_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_uid',
      referencedColumnName: 'uid',
    },
  })
  participants: User[];

  @Column({ type: 'varchar', unique: true, nullable: true })
  shareToken: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updateAt: Date;
}
