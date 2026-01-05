import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ChatRoomRole } from '../entities/chat_room_members.entity';

export class AddMemberToChatRoomDto {
  @IsNumber()
  chat_room_id: number;

  @IsNumber()
  user_id: number;

  @IsOptional()
  @IsEnum(ChatRoomRole)
  role?: ChatRoomRole;
}