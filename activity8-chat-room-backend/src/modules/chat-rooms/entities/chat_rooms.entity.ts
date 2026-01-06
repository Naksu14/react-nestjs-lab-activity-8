import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ChatRoomMember } from './chat_room_members.entity';
import { ChatRoomMessage } from './chat_room_messages.entity';
import { User } from '../../users/entities/users.entity';

export enum ChatRoomType {
  PRIVATE = 'private',
  PUBLIC = 'public',
}

@Entity('chat_rooms')
export class ChatRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  chat_room_name: string;

  @Column({
    type: 'enum',
    enum: ChatRoomType,
    default: ChatRoomType.PRIVATE,
  })
  type: ChatRoomType;

  @ManyToOne(() => User, { nullable: false })
  created_by: User;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ChatRoomMember, (member) => member.chat_room)
  members: ChatRoomMember[];

  @OneToMany(() => ChatRoomMessage, (message) => message.chat_room)
  messages: ChatRoomMessage[];
}
