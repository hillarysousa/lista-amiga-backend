import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateItemDto {
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Nome do item não pode ter mais de 100 caracteres',
  })
  name: string;

  @IsNotEmpty()
  listId: string;
}
