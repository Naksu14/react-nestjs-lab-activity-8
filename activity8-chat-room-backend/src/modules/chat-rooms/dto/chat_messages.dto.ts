import { IsNumber, IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  
  @ApiProperty({ example: 1 })
  @IsNumber()
  chat_room_id: number;

  @ApiProperty({ example: 'Hello, how are you?' })
  @IsString()
  @IsNotEmpty()
  text_message: string;
}

export class UpdateMessageDto {
  @ApiProperty({ example: 'Edited message text' })
  @IsString()
  @IsNotEmpty()
  text_message: string;
}