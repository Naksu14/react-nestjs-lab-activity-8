import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class SendMessageDto {
  @IsNumber()
  chat_room_id: number;

  @IsString()
  @IsNotEmpty()
  text_message: string;
}