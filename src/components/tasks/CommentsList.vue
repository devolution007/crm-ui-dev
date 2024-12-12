<template>
  <div>
    <div class="relative-position">
      <q-btn
        class="position-absolute absolute-right z-index-2"
        :loading="loading"
        icon="refresh"
        round
        text-color="blue-grey-5"
        @click="refreshComments"
      />
    </div>
    <div class="row">
      <div class="col-12">
        <q-input
          v-model="addComment"
          type="textarea"
          :rows="(commentActive) ? 3 : 1"
          :row-height="(commentActive) ? 24 : 16"
          auto-grow
          :label="$t('addCommentOrActionTaken')"
          @focusin="commentActive = true"
        />
      </div>
    </div>
    <div
      v-if="commentActive"
      class="q-pt-sm"
    >
      <q-btn
        v-if="commentActive"
        class="me-3"
        color="primary"
        :loading="isSavingComment"
        @click="createComment"
      >
        {{ $t('addComment') }}
      </q-btn>
      <q-btn
        @click="addComment = ''; commentActive = false"
      >
        {{ $t('cancel') }}
      </q-btn>
    </div>
  </div>
  <div class="q-pa-md ">
    <div style="width: 100%">
      <q-chat-message
        v-for="comment in commentsSaved"
        :key="`comment-${comment.id}`"
        :name="`${comment.member.firstName} ${comment.member.lastName}`"
        :text="[comment.description]"
        :sent="comment.member.id === auth.user?.id"
        :stamp="$helper.dateUtc(comment.createdAt)"
        :bg-color="(comment.member.id === auth.user?.id) ? null : 'light-green-2'"
      >
        <template #name>
          <div
            class="flex justify-between items-center hover-able"
            style="min-height: 30px"
          >
            <div>{{ comment.member.firstName }} {{ comment.member.lastName }}</div>

            <q-btn
              v-if="comment.member.id === auth.user?.id"
              round
              class="q-ml-sm shown-on-hover-distinct"
              icon="delete"
              size="sm"
              :loading="isDeletingComment === comment.id"
              @click="deleteComment(comment)"
            />
          </div>
        </template>
      </q-chat-message>
    </div>
  </div>
</template>

<script setup lang="ts">

import { computed, onMounted, Ref, ref } from 'vue'
import TaskApi from 'src/api/TaskApi'
import { useAuthStore } from 'stores/auth-store'
import { api } from 'boot/axios'
import { useTasksStore } from 'stores/tasks-store'
import { TaskCommentInterface } from 'src/models/TaskComment'
import { Dialog } from 'quasar'
import axios, { AxiosError } from 'axios'

const auth = useAuthStore()
const tasksStore = useTasksStore()

const props = defineProps({
  taskId: {
    type: Number,
    required: false,
    default: 0
  }
})
const emit = defineEmits(['comment-added', 'error'])
const taskOriginal = tasksStore.getEntryByID(props.taskId)

const commentsSaved = computed(() => {
  const comments = taskOriginal.value?.comments || []
  return comments.slice().sort((a, b) => {
    return b.id - a.id
  }) || []
})
const commentsLocal = ref([])
const addComment = ref('')
const commentActive = ref(false)
const isSavingComment = ref(false)
const isDeletingComment: Ref<number | null> = ref(null)
const loading = ref(false)

const refreshComments = async () => {
  tasksStore.fetchEntry(props.taskId)
    .finally()
  /* commentsLocal.value = []

  if (!props.taskId) {
    return
  }
  loading.value = true
  try {
    const response = await (new TaskApi(api)).getComments(props.taskId)

    commentsLocal.value = response.data.map((row) => new TaskComment(row))
  } catch (e) {
    if (e.detail) {
      emit('error', e.detail)
    } else {
      emit('error', 'Something went wrong')
    }

    console.error(e)
  } finally {
    loading.value = false
  } */
}

const createComment = async () => {
  if (!addComment.value) {
    return
  }

  isSavingComment.value = true
  try {
    await (new TaskApi(api)).createComment(props.taskId, {
      description: addComment.value
    })
    addComment.value = ''
    commentActive.value = false
    refreshComments()
    emit('comment-added')
  } catch (e: unknown | AxiosError) {
    if (axios.isAxiosError(e)) {
      emit('error', e.response?.data.message)
    } else {
      emit('error', 'Something went wrong')
    }

    console.error(e)
  } finally {
    isSavingComment.value = false
  }
}

/* onMounted(() => {
  refreshComments()
}) */

const deleteComment = async (comment: TaskCommentInterface) => {
  Dialog.create({
    title: 'Delete comment',
    message: 'Are you sure you want to delete this comment?',
    cancel: true
  }).onOk(async () => {
    isDeletingComment.value = comment.id
    try {
      await (new TaskApi(api)).deleteComment(comment.id)
      refreshComments()
    } catch (e: unknown | AxiosError) {
      if (axios.isAxiosError(e)) {
        emit('error', e.response?.data.message)
      } else {
        emit('error', 'Something went wrong')
      }

      console.error(e)
    } finally {
      isDeletingComment.value = null
    }
  })
}
</script>

<style scoped>

</style>
