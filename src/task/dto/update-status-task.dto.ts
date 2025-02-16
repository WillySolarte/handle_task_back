import { IsIn } from "class-validator";
import { taskStatus } from '../schema/taskB.schema';


export class UpdateStatusTaskDto {

    @IsIn(Object.values(taskStatus))
    status: typeof taskStatus[keyof typeof taskStatus];
    
       
}