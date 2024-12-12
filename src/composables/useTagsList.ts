import { ref } from 'vue'
import type { Ref } from 'vue'
import TagModel from 'src/models/TagModel'
import { api } from 'boot/axios'
import TagApi from 'src/api/TagApi'

const tags = <Ref<TagModel[]>>ref([])

export default function useTagsList () {
  const loading = ref(false)

  if (!tags.value.length) {
    const tagsApi = new TagApi(api)

    loading.value = true
    tagsApi.getAll().then((items) => {
      tags.value = items
    }).finally(() => {
      loading.value = false
    })
  }

  return {
    tags,
    loading
  }
}
