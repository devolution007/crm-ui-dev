import Api from 'src/api/Api'

class FileApi extends Api {
  async attachmentGetDownloadLink (id: number): Promise<string> {
    const data = (await this.axios.post(`/crm/api/v2/files/attachment/${id}/sign`)).data
    return data.url
  }

  async attachmentDelete (id: number): Promise<void> {
    await this.axios.delete(`/crm/api/v2/files/attachment/${id}`)
  }
}

export default FileApi
