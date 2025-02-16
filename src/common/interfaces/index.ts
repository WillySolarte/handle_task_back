import { ITaskB } from "src/task/schema/taskB.schema"

export interface IUserReturn {
    msg: string
    state: string,
    error: string
}
export interface IConfirmAccountReturn {
    msg: string
    state: string
    error: string
}

export interface ILoginReturn {
    msg: string
    state: string,
    data: string
}

export interface IGeneralReturn {
    msg: string
    state: string,
    data: string
}

export interface IGetTaskReturn {
    msg: string
    state: string,
    data: ITaskB | null
}