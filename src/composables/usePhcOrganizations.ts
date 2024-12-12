import { ref, Ref } from 'vue'
import { PhcOrganizationModel } from 'src/models/PhcOrganizationModel'
import { api } from 'boot/axios'
import OrganizationApi from 'src/api/OrganizationApi'

const phcOrganizations = <Ref<PhcOrganizationModel[]>>ref([])

export default function usePhcOrganizations () {
  const loading = ref(false)

  if (!phcOrganizations.value.length) {
    loading.value = true;

    (new OrganizationApi(api)).getPhcOrganizations().then((items) => {
      phcOrganizations.value = items
    }).finally(() => {
      loading.value = false
    })
  }

  return {
    phcOrganizations,
    loading
  }
}
