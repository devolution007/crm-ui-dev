import { CustomerInputInterface } from 'src/models/CustomerModel'
import { computed, ref, Ref } from 'vue'

/**
 * This can be used to create a form for customer registration.
 */
export default function useAbstractCustomerRegFormData<CustomDataSetup> (additionalFields: CustomDataSetup)
{
  const basicFormData: Ref<CustomerInputInterface> = ref({
    state: '',
    firstName: '',
    lastName: '',
    gender: '',
    birthdate: '',
    language: '',
    phone: '+1',
    email: '',
    usePhoneAsLogin: false,
  })

  const additionalFieldsData: Ref<CustomDataSetup> = ref(additionalFields) as Ref<CustomDataSetup>

  const basicFormDataHandler = (data: CustomerInputInterface) => {
    basicFormData.value = data
  }

  const combinedFormData = computed(() => {
    return {
      ...basicFormData.value,
      ...additionalFieldsData.value
    }
  })

  return {
    basicFormDataHandler,
    additionalFieldsData,
    combinedFormData
  }
}
