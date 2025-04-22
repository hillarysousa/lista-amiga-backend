import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany } from 'typeorm';
import { List } from '../../lists/entities/list.entity';
import { Item } from '../../items/entities/item.entity';

@Entity('user')
export class User {
  @PrimaryColumn()
  uid: string;

  @Column({ nullable: true })
  name: string;

  @OneToMany(() => List, (list) => list.owner)
  lists: List[];

  @ManyToMany(() => List, (list) => list.participants)
  sharedLists: List[];

  @OneToMany(() => Item, (item) => item.owner)
  items: Item[];
}
