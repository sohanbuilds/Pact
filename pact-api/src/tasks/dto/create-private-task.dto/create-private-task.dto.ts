import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '@prisma/client';

export class CreatePrivateTaskDto {
  @ApiProperty({ example: 'Prepare slides' })
  title: string;

  @ApiProperty({ example: 'For Monday meeting', required: false })
  description?: string;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.HIGH })
  priority: TaskPriority;

  @ApiProperty({
    example: '2026-01-25T18:30:00.000Z',
    required: false,
  })
  deadline?: Date;

  @ApiProperty({
    example: 'friend-user-id',
    description: 'User ID of friend',
  })
  assigneeId: string;
}
