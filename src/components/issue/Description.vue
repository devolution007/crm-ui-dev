<template>
  <div class="q-mb-md">
    <q-input
      v-model="description"
      rows="3"
      type="textarea"
      autogrow
      :label="title"
      :placeholder="$t('description')"
      outlined
    >
      <template #after>
        <q-btn
          color="positive"
          :disable="!description"
          :loading="submitting"
          @click="add"
        >
          {{ $t('add') }}
        </q-btn>
      </template>
    </q-input>
  </div>

  <div class="col-12 q-mb-lg">
    <q-markup-table
      v-if="descriptions && descriptions.length"
      dense
      flat
    >
      <template #default>
        <thead>
          <tr>
            <th class="text-left">
              {{ $t('description') }}
            </th>
            <th class="text-left">
              {{ $t('addedBy') }}
            </th>
            <th class="text-left">
              {{ $t('addedAt') }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, key) in descriptions"
            :key="key"
          >
            <td class="text-left ">
              <div class="min-width-300 white-space-pre">
                {{ item.description }}

              </div>
            </td>
            <td class="text-left">
              {{ item.author }}
            </td>
            <td>
              {{ $helper.dateEst(item.createdAt) }}
            </td>
          </tr>
        </tbody>
      </template>
    </q-markup-table>
  </div>
</template>

<script>
import IssueApi from 'src/api/IssueApi'
import { api } from 'boot/axios'

export default {
  props: {
    issueId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    descriptions: {
      type: Array,
      required: true
    }
  },
  emits: ['issueChanged'],
  data () {
    return {
      description: '',
      submitting: false,
      issueRepository: new IssueApi(api)
    }
  },
  methods: {
    async add () {
      if (!this.description) {
        return
      }
      this.submitting = true
      const issue = await this.issueRepository.saveDescription(this.issueId, this.description, this.type)
      this.$emit('issueChanged', issue[this.type + 'DescriptionJson'])
      this.description = ''
      this.submitting = false
    }
  }
}
</script>
<style scoped>
</style>
