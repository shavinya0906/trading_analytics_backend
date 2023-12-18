import { ApiProperty } from '@nestjs/swagger';
export class GetByIdDTO {
  @ApiProperty()
  public id: string;
}
