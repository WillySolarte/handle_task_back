import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';
import { IsString } from 'class-validator';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
    @IsString()
    projectName: string;
        
    @IsString()
    clientName: string;
    
    @IsString()
    description: string;
}
