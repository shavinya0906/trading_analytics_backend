import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class LoginUserDTO {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  public password: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  public email: string;
}
