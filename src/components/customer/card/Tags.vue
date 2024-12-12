<template>
  <div>
    <q-chip
      v-for="(tag, key) in tags"
      :key="`customer${customerStore.customer}TagKey${key}`"
      :removable="props.enableDelete"
      color="primary"
      text-color="white"
      :size="size"
      :disable="removingTagIds.includes(tag.id)"
      @remove="removeTag(tag.id)"
    >
      <div class="ellipsis">
        {{ tag.name }}
      </div>
    </q-chip>
  </div>
</template>

<script setup lang="ts">
import TagModel from 'src/models/TagModel'
import { useCustomerStore } from 'stores/customer-store'
import { Ref, ref } from 'vue'

interface Props {
  tags?: TagModel[]
  enableDelete?: boolean
  size?: string
}
const props = withDefaults(defineProps<Props>(), {
  tags: () => [],
  enableDelete: false,
  size: 'md'
})

const emit = defineEmits(['removedTag'])

const customerStore = useCustomerStore()

const removingTagIds = <Ref<number[]>>ref([])

const removeTag = async (tagId: number) => {
  removingTagIds.value.push(tagId)
  await customerStore.removeTag({
    customerId: customerStore.customer?.id,
    tagId
  })
  removingTagIds.value = removingTagIds.value.filter(id => id !== tagId)
  emit('removedTag', tagId)
}
</script>
