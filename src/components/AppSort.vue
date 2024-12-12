<template>
  <q-th
    @click="(findProperty[name] === 'asc' ? order('desc') : order('asc'))"
  >
    {{ label }}

    <template v-if="findProperty">
      <template v-if="findProperty[name] === 'asc' || findProperty[name] === 'desc'">
        <q-icon
          color="warning"
          size="20px"
          :name="findProperty[name] === 'asc' ? 'sym_o_arrow_upward' : 'sym_o_arrow_downward'"
          class="cursor-pointer"
        />
        <q-chip
          square
          size="sm"
        >
          <q-avatar
            size="sm"
            color="red"
            text-color="white"
          >
            {{ queueNumber }}
          </q-avatar>
          <q-icon
            class="cursor-pointer"
            size="xs"
            name="close"
            title="Reset"
            @click="$event.stopPropagation() || close()"
          />
        </q-chip>
      </template>

      <template v-else-if="findProperty[name] === null">
        <q-icon
          class="cursor-pointer not-used-yet"
          name="sym_o_arrow_downward"
          size="20px"
        />
      </template>
    </template>
  </q-th>
</template>

<script>
/**
 * @deprecated This component is not good enough and contains a lot of bugs. It should be replaced with a better solution.
 */
import { helper } from 'boot/helper'

export default {
  name: 'AppSort',
  props: {
    sortBy: {
      type: Object,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      mutableSortBy: helper.clone(this.sortBy)
    }
  },
  computed: {
    findProperty () {
      return this.mutableSortBy.find(item => Object.keys(item)[0] === this.name)
    },
    queueNumber () {
      let mutableSortBy = helper.clone(this.mutableSortBy)
      mutableSortBy = mutableSortBy.filter(item => Object.values(item)[0] !== null)
      const index = mutableSortBy.findIndex(item => !!item[this.name])
      return (index < 0 ? 0 : index) + 1
    }
  },
  watch: {
    sortBy (value) {
      this.mutableSortBy = helper.clone(value)
    }
  },
  methods: {
    order (direction) {
      this.mutableSortBy.forEach(item => {
        const index = this.mutableSortBy.findIndex(item => item[this.name] === null)
        if (index !== -1) {
          const add = helper.clone(this.mutableSortBy[index])
          this.mutableSortBy.splice(index, 1)
          this.mutableSortBy.push(add)
        }
      })
      this.findProperty[this.name] = direction
      this.$emit('update:sortBy', this.mutableSortBy)
    },
    close () {
      this.findProperty[this.name] = null
      this.$emit('update:sortBy', this.mutableSortBy)
    }
  }
}
</script>
<style scoped>
.not-used-yet{
  visibility: hidden
}
th:hover .not-used-yet {
  visibility: visible;
}
</style>
