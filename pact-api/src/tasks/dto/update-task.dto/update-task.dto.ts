import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority } from '@prisma/client';

export class UpdateTaskDto {
  @ApiPropertyOptional({ example: 'Updated title' })
  title?: string;

  @ApiPropertyOptional({ example: 'Updated description' })
  description?: string;

  @ApiPropertyOptional({
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
  })
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: '2026-02-01T18:30:00.000Z',
  })
  deadline?: Date;

  @ApiPropertyOptional({ example: true })
  completed?: boolean;
}
