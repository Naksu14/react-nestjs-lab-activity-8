import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ChatRoomRole } from '../entities/chat_room_members.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AddMemberToChatRoomDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  chat_room_id: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  user_id: number;

  @ApiProperty({ example: 'member', enum: ChatRoomRole, required: false })
  @IsOptional()
  @IsEnum(ChatRoomRole)
  role?: ChatRoomRole;
}