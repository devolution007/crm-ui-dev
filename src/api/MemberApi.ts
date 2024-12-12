import Api from 'src/api/Api'
import MemberModel from 'src/models/MemberModel'

class MemberApi extends Api {
  async getMembersForThisOrganization (): Promise<MemberModel[]> {
    const items = (await this.axios.get('/crm/api/v2/member')).data
    return items.map((item: MemberModel) => new MemberModel(item))
  }
}

export default MemberApi
