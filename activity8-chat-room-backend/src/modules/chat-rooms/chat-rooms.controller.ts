import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ChatRoomsService } from './chat-rooms.service';
import { CreateChatRoomDto } from './dto/chat_rooms.dto';
import { AddMemberToChatRoomDto } from './dto/chat_members.dto';
import { SendMessageDto } from './dto/chat_messages.dto';

@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  // Get all chat rooms
  @Get()
  async getAllRooms() {
    return this.chatRoomsService.findAll();
  }

  @Get('my-rooms')
  @UseGuards(AuthGuard('jwt'))
  async getMyRooms(@Req() req: any) {
    const user = req.user;
    const userId = user?.id;
    return this.chatRoomsService.findAllByUserId(userId);
  }

  // Get chat room by ID
  @Get(':id')
  async getRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.chatRoomsService.findById(id);
  }

  // Get messages of a chat room
  @Get(':id/messages')
  async getMessages(@Param('id', ParseIntPipe) id: number) {
    return this.chatRoomsService.getMessages(id);
  }

  // Create a new chat room
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createRoom(@Body() createDto: CreateChatRoomDto, @Req() req: any) {
    const user = req.user;
    const userId = user?.id;
    return this.chatRoomsService.create(createDto, userId);
  }

  // Add member to chat room
  @Post('members')
  @UseGuards(AuthGuard('jwt'))
  addMembers(@Body() dto: AddMemberToChatRoomDto) {
    return this.chatRoomsService.addMembers(dto);
  }

  // Remove member from chat room
  @Delete('members')
  @UseGuards(AuthGuard('jwt'))
  async removeMember(@Body() dto: { chat_room_id: number }, @Req() req: any) {
    const userId = req.user?.id;
    return this.chatRoomsService.removeMember(dto.chat_room_id, userId);
  }

  // Send message in chat room
  @Post('messages')
  @UseGuards(AuthGuard('jwt'))
  async sendMessage(@Body() dto: SendMessageDto, @Req() req: any) {
    const user = req.user;
    const userId = user?.id;
    return this.chatRoomsService.sendMessage(dto, userId);
  }

  //update chat room details
  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async updateRoom(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: CreateChatRoomDto,
    @Req() req: any,
  ) {
    const user = req.user;
    const userId = user?.id;
    return this.chatRoomsService.updateChatRoom(id, updateDto);
  }
}
