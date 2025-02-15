import { IsString } from "class-validator";

export class CreateProjectDto {
    @IsString()
    projectName: string;
    
    @IsString()
    clientName: string;

    @IsString()
    description: string;
}
