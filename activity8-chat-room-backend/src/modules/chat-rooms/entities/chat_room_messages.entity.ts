// src/entities/chat-room-message.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ChatRoom } from './chat_rooms.entity';
import { User } from '../../users/entities/users.entity';

@Entity('chat_room_messages')
export class ChatRoomMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  chat_room: ChatRoom;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  sender: User;

  @Column('simple-json', { nullable: true })
  unsent_user_id: string[];

  @Column('text')
  text_message: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
