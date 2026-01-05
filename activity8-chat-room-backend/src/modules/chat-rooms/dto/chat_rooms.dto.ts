import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ChatRoomType } from '../entities/chat_rooms.entity';

export class CreateChatRoomDto {
  @IsOptional()
  @IsString()
  chat_room_name?: string;

  @IsOptional()
  @IsEnum(ChatRoomType)
  type?: ChatRoomType;
}