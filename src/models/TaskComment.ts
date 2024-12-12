import { MemberBasicInterface } from 'src/models/MemberModel'

export interface TaskCommentInterface {
    readonly id: number
    readonly description: string
    readonly createdAt: string
    readonly member: MemberBasicInterface
}
