import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChatRoomType } from '../entities/chat_rooms.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChatRoomDto {
  @ApiProperty({ example: 'General Chat' })
  @IsOptional()
  @IsString()
  chat_room_name?: string;

  @ApiProperty({ example: 'public', enum: ChatRoomType, required: false })
  @IsOptional()
  @IsEnum(ChatRoomType)
  type?: ChatRoomType;
}