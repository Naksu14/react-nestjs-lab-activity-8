// src/entities/chat-room-member.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  UpdateDateColumn,
} from 'typeorm';
import { ChatRoom } from './chat_rooms.entity';
import { User } from '../../users/entities/users.entity';

export enum ChatRoomRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

@Entity('chat_room_members')
export class ChatRoomMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ChatRoom, (chatRoom) => chatRoom.members, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  chat_room: ChatRoom;

  @ManyToOne(() => User, { nullable: false })
  user: User;

  @Column({
    type: 'enum',
    enum: ChatRoomRole,
    default: ChatRoomRole.MEMBER,
  })
  role: ChatRoomRole;

  @CreateDateColumn()
  joined_at: Date;

  @UpdateDateColumn()
  last_seen_at: Date;
}
