import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomsGateway } from './chat-rooms.gateway';
import { ChatRoom } from './entities/chat_rooms.entity';
import {
  ChatRoomMember,
  ChatRoomRole,
} from './entities/chat_room_members.entity';
import { ChatRoomMessage } from './entities/chat_room_messages.entity';
import { User } from '../users/entities/users.entity';
import { CreateChatRoomDto } from './dto/chat_rooms.dto';
import { AddMemberToChatRoomDto } from './dto/chat_members.dto';
import { SendMessageDto } from './dto/chat_messages.dto';

@Injectable()
export class ChatRoomsService {
  constructor(
    @InjectRepository(ChatRoom)
    private chatRoomRepo: Repository<ChatRoom>,

    @InjectRepository(ChatRoomMember)
    private chatRoomMemberRepo: Repository<ChatRoomMember>,

    @InjectRepository(ChatRoomMessage)
    private chatRoomMessageRepo: Repository<ChatRoomMessage>,

    @InjectRepository(User)
    private usersRepo: Repository<User>,

    private chatRoomsGateway: ChatRoomsGateway,
  ) {}

  // Create a new chat room
  async create(
    createDto: CreateChatRoomDto,
    creatorId: number,
  ): Promise<ChatRoom> {
    const creator = await this.usersRepo.findOneBy({ id: creatorId });
    if (!creator) throw new NotFoundException('Creator user not found');

    const chatRoom = this.chatRoomRepo.create({
      chat_room_name: createDto.chat_room_name,
      type: createDto.type,
      created_by: creator,
    });

    const savedRoom = await this.chatRoomRepo.save(chatRoom);

    // add creator as admin member
    const member = this.chatRoomMemberRepo.create({
      chat_room: savedRoom,
      user: creator,
      role: ChatRoomRole.ADMIN,
    });
    await this.chatRoomMemberRepo.save(member);

    return this.findById(savedRoom.id);
  }

  // Get all chat rooms
  async findAll(): Promise<ChatRoom[]> {
    return this.chatRoomRepo.find({
      relations: ['members', 'members.user', 'messages', 'created_by'],
    });
  }

  // Get all chat rooms by user ID (rooms where user is a member)
  async findAllByUserId(userId: number): Promise<ChatRoom[]> {
    if (!userId) return [];

    const memberships = await this.chatRoomMemberRepo.find({
      where: { user: { id: userId } },
      relations: [
        'chat_room',
        'chat_room.members',
        'chat_room.members.user',
        'chat_room.messages',
        'chat_room.messages.sender',
        'chat_room.created_by',
      ],
    });

    const rooms = memberships.map((m) => m.chat_room).filter(Boolean);

    // remove duplicates (just in case)
    const unique = Array.from(new Map(rooms.map((r) => [r.id, r])).values());

    return unique;
  }

  // Get chat room by ID
  async findById(id: number): Promise<ChatRoom> {
    const room = await this.chatRoomRepo.findOne({
      where: { id },
      relations: [
        'members',
        'members.user',
        'messages',
        'messages.sender',
        'created_by',
      ],
    });
    if (!room) throw new NotFoundException('Chat room not found');
    return room;
  }

  // Add member to chat room or join chat room
  async addMembers(dto: AddMemberToChatRoomDto): Promise<ChatRoomMember> {
    const room = await this.chatRoomRepo.findOneBy({ id: dto.chat_room_id });
    if (!room) throw new NotFoundException('Chat room not found');

    const user = await this.usersRepo.findOneBy({ id: dto.user_id });
    if (!user) throw new NotFoundException('User not found');

    const exists = await this.chatRoomMemberRepo.findOne({
      where: { chat_room: { id: room.id }, user: { id: user.id } },
      relations: ['user', 'chat_room'],
    });
    if (exists)
      throw new ConflictException('User already a member of this chat room');

    const member = this.chatRoomMemberRepo.create({
      chat_room: room,
      user,
      role: dto.role || ChatRoomRole.MEMBER,
    });

    return this.chatRoomMemberRepo.save(member);
  }

  // Remove member from chat room or leave chat room
  async removeMember(chatRoomId: number, userId: number): Promise<void> {
    const membership = await this.chatRoomMemberRepo.findOne({
      where: {
        chat_room: { id: chatRoomId } as any,
        user: { id: userId } as any,
      },
      relations: ['chat_room', 'user'],
    });

    if (!membership) {
      return; // nothing to remove
    }

    await this.chatRoomMemberRepo.remove(membership);
  }

  // Send message in chat room
  async sendMessage(
    dto: SendMessageDto,
    senderId: number,
  ): Promise<ChatRoomMessage> {
    const room = await this.chatRoomRepo.findOneBy({ id: dto.chat_room_id });
    if (!room) throw new NotFoundException('Chat room not found');

    const sender = await this.usersRepo.findOneBy({ id: senderId });
    if (!sender) throw new NotFoundException('Sender not found');

    const message = this.chatRoomMessageRepo.create({
      chat_room: room,
      sender,
      text_message: dto.text_message,
    });

    const savedMessage = await this.chatRoomMessageRepo.save(message);

    this.chatRoomsGateway.server
      .to(`room-${room.id}`)
      .emit('onMessage', savedMessage);

    return savedMessage;
  }

  // Get messages of a chat room
  async getMessages(chatRoomId: number): Promise<ChatRoomMessage[]> {
    return this.chatRoomMessageRepo.find({
      where: { chat_room: { id: chatRoomId } as any },
      relations: ['sender'],
      order: { created_at: 'ASC' },
    });
  }

  //update chat room details
  async updateChatRoom(
    chatRoomId: number,
    updateData: Partial<CreateChatRoomDto>,
  ): Promise<ChatRoom> {
    const chatRoom = await this.chatRoomRepo.findOneBy({ id: chatRoomId });
    if (!chatRoom) throw new NotFoundException('Chat room not found');
    Object.assign(chatRoom, updateData);
    await this.chatRoomRepo.save(chatRoom);
    return this.findById(chatRoomId);
  }

  async updateLastSeen(
    chatRoomId: number,
    userId: number,
  ): Promise<void> {
    const membership = await this.chatRoomMemberRepo.findOne({
      where: {
        chat_room: { id: chatRoomId } as any,
        user: { id: userId } as any,
      },
    });
    if (!membership) {
      throw new NotFoundException('Membership not found');
    }
    membership.last_seen_at = new Date();
    await this.chatRoomMemberRepo.save(membership);
  }

}
