import { AttachmentInfo } from 'src/types'
import FileApi from 'src/api/FileApi'
import { api } from 'boot/axios'
import { watchOnce, useWindowFocus } from '@vueuse/core'

export function useAttachment () {
  async function download (attachment: AttachmentInfo) {
    const fileRepository: FileApi = new FileApi(api)
    const url = await fileRepository.attachmentGetDownloadLink(attachment.id)

    const focused = useWindowFocus()

    // Hack to delete the downloaded attachment after the download is complete
    watchOnce(focused, async (isFocused) => {
      if (!isFocused) {
        // When the window is lost focus, wait for it to be focused again
        watchOnce(focused, async (isFocused) => {
          if (isFocused) {
            // When the window is focused again, delete the downloaded attachment
            await fileRepository.attachmentDelete(attachment.id)
          }
        })
      }
    })

    window.open(url)
  }

  return { download }
}
