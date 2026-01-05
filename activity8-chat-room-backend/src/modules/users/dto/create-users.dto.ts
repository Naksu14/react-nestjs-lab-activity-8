import {
    IsEmail,
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @IsString()
    @IsNotEmpty()
    lastname: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @MinLength(8)
    @IsNotEmpty()   
    password: string;

    @IsEnum([true, false])
    isActive: boolean;
}