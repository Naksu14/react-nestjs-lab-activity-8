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
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ChatRoomsService } from './chat-rooms.service';
import { CreateChatRoomDto } from './dto/chat_rooms.dto';
import { AddMemberToChatRoomDto } from './dto/chat_members.dto';
import { SendMessageDto } from './dto/chat_messages.dto';

@ApiTags('Chat Rooms')
@Controller('chat-rooms')
export class ChatRoomsController {
  constructor(private readonly chatRoomsService: ChatRoomsService) {}

  // Get all chat rooms
  @ApiOperation({ summary: 'Get all chat rooms' })
  @ApiResponse({ status: 200, description: 'List of all chat rooms' })
  @Get()
  async getAllRooms() {
    return this.chatRoomsService.findAll();
  }

  // Get chat rooms of the logged-in user
  @ApiOperation({ summary: 'Get chat rooms of the logged-in user' })
  @ApiResponse({ status: 200, description: 'List of user chat rooms' })
  @Get('my-rooms')
  @UseGuards(AuthGuard('jwt'))
  async getMyRooms(@Req() req: any) {
    const user = req.user;
    const userId = user?.id;
    return this.chatRoomsService.findAllByUserId(userId);
  }

  // Get chat room by ID
  @ApiOperation({ summary: 'Get chat room by ID' })
  @ApiResponse({ status: 200, description: 'Chat room details' })
  @Get(':id')
  async getRoomById(@Param('id', ParseIntPipe) id: number) {
    return this.chatRoomsService.findById(id);
  }

  // Get messages of a chat room
  @ApiOperation({ summary: 'Get messages of a chat room' })
  @ApiResponse({ status: 200, description: 'List of chat room messages' })
  @Get(':id/messages')
  async getMessages(@Param('id', ParseIntPipe) id: number) {
    return this.chatRoomsService.getMessages(id);
  }

  // Create a new chat room
  @ApiOperation({ summary: 'Create a new chat room' })
  @ApiResponse({ status: 201, description: 'The chat room has been created.' })
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createRoom(@Body() createDto: CreateChatRoomDto, @Req() req: any) {
    const user = req.user;
    const userId = user?.id;
    return this.chatRoomsService.create(createDto, userId);
  }

  // Add member to chat room
  @ApiOperation({ summary: 'Add member to chat room' })
  @ApiResponse({ status: 200, description: 'Member added to chat room' })
  @Post('members')
  @UseGuards(AuthGuard('jwt'))
  addMembers(@Body() dto: AddMemberToChatRoomDto) {
    return this.chatRoomsService.addMembers(dto);
  }

  // Remove member from chat room
  @ApiOperation({ summary: 'Remove member from chat room' })
  @ApiResponse({ status: 200, description: 'Member removed from chat room' })
  @Delete('members')
  @UseGuards(AuthGuard('jwt'))
  async removeMember(@Body() dto: { chat_room_id: number }, @Req() req: any) {
    const userId = req.user?.id;
    return this.chatRoomsService.removeMember(dto.chat_room_id, userId);
  }

  // Send message in chat room
  @ApiOperation({ summary: 'Send message in chat room' })
  @ApiResponse({ status: 201, description: 'Message sent successfully' })
  @Post('messages')
  @UseGuards(AuthGuard('jwt'))
  async sendMessage(@Body() dto: SendMessageDto, @Req() req: any) {
    const user = req.user;
    const userId = user?.id;
    return this.chatRoomsService.sendMessage(dto, userId);
  }

  //update chat room details
  @ApiOperation({ summary: 'Update chat room details' })
  @ApiResponse({ status: 200, description: 'Chat room updated successfully' })
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

  //update last Seen
  @ApiOperation({ summary: 'Update last seen of user in chat room' })
  @ApiResponse({ status: 200, description: 'Last seen updated successfully' })
  @Patch(':id/last-seen')
  @UseGuards(AuthGuard('jwt'))
  async updateLastSeen(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    const user = req.user;
    const userId = user?.id;
    return this.chatRoomsService.updateLastSeen(id, userId);
  }
}
