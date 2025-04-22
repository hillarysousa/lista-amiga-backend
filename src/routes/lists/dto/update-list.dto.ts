import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateListDto {
  @IsNotEmpty()
  @MaxLength(30, {
    message: 'Nome da lista não pode ter mais de 30 caracteres',
  })
  name: string;
}
