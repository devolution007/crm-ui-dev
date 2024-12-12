import Api from 'src/api/Api'
import TagModel from 'src/models/TagModel'

class TagApi extends Api {
  async getAll (): Promise<TagModel[]> {
    const items = (await this.axios.get('/crm/api/v2/tags/list')).data
    return items.map((item: any) => new TagModel(item))
  }
}

export default TagApi
