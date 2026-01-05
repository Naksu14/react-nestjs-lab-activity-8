import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRoomsController } from './chat-rooms.controller';
import { ChatRoomsGateway } from './chat-rooms.gateway';
import { ChatRoomsService } from './chat-rooms.service';
import { ChatRoom } from './entities/chat_rooms.entity';
import { ChatRoomMember } from './entities/chat_room_members.entity';
import { ChatRoomMessage } from './entities/chat_room_messages.entity';
import { User } from '../users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, ChatRoomMember, ChatRoomMessage, User]),
  ],
  controllers: [ChatRoomsController],
  providers: [ChatRoomsGateway, ChatRoomsService],
  exports: [ChatRoomsService],
})
export class ChatRoomsModule {}
