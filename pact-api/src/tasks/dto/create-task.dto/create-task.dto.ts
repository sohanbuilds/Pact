import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finish assignment' })
  title: string;

  @ApiProperty({ example: 'Before Sunday', required: false })
  description?: string;

  @ApiProperty({
    enum: TaskPriority,
    example: TaskPriority.HIGH,
  })
  priority: TaskPriority;

  @ApiProperty({
    example: '2026-01-20T18:30:00.000Z',
    required: false,
  })
  deadline?: Date;
}
