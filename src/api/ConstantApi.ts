import Api from 'src/api/Api'
import { Constant } from 'src/types'

class ConstantApi extends Api {
  async getConstants (): Promise<Constant> {
    return (await this.axios.get('/crm/api/v2/handbook/constants')).data
  }
}

export default ConstantApi
