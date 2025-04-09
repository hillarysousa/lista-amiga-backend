import { List } from 'src/routes/lists/entities/list.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Item {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'bool' })
  checked: boolean;

  @ManyToOne(() => List, (list) => list.items)
  list: List;
}
