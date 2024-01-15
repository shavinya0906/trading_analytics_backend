import { ApiProperty } from '@nestjs/swagger';
export class GetByIdDTO {
  @ApiProperty()
  id: string;
}
