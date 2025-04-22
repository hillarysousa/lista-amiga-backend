import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Item } from 'src/routes/items/entities/item.entity';

export class CreateListDto {
  @IsNotEmpty()
  @MaxLength(30, {
    message: 'Nome da lista não pode ter mais de 30 caracteres',
  })
  name: string;

  @IsOptional()
  items: Item[];
}
