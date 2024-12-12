import MemberModel from './MemberModel'

export interface TargetListData{
  id: number
  member: MemberModel
  name: string
  query: any
  updatedAt: string
  createdAt: string
}

class TargetListModel {
  id: number
  member: MemberModel
  name: string
  query: any
  updatedAt: string
  createdAt: string

  constructor ({
    createdAt,
    id,
    member,
    name,
    query,
    updatedAt
  }: TargetListData) {
    this.createdAt = createdAt
    this.id = id
    this.member = member && new MemberModel(member)
    this.name = name
    this.query = query
    this.updatedAt = updatedAt
  }
}

export default TargetListModel
