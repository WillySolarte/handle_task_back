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

export interface IGetMemberByEmail {
    _id: string,
    email: string,
    name: string
}

export interface IUserActive {
    id?: string,
    email?: string,
    name?: string
}