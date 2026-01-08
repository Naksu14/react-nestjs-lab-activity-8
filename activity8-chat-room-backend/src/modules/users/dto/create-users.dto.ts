import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty({ example: 'john.doe@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @ApiProperty({ example: 'strongpassword123' })
    @IsString()
    @MinLength(8)
    @IsNotEmpty()   
    password: string;

    @ApiProperty({ example: true })
    @IsEnum([true, false])
    isActive: boolean;
}