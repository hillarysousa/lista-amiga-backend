import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateItemDto {
  @IsNotEmpty()
  @MaxLength(100, {
    message: 'Nome do item não pode ter mais de 100 caracteres',
  })
  name: string;
}
