import { computed, ComputedRef, Ref, ref } from 'vue'
import { QTableRequestProps } from 'src/types'

export interface Pagination {
  sortBy: string
  descending: boolean
  rowsPerPage: number
  page: number
  rowsNumber: number
}

export default function usePagination (defaultPagination: Partial<Pagination> = {}) {
  const pagination: Ref<Pagination> = ref({
    sortBy: 'id',
    descending: true,
    page: 1,
    rowsPerPage: 15,
    rowsNumber: <number>-1
  })

  pagination.value = Object.assign(pagination.value, defaultPagination)

  const updateFromTableRequestProps = (props: QTableRequestProps) => {
    const {
      page,
      rowsPerPage,
      sortBy,
      descending
    } = props.pagination

    pagination.value.page = page
    pagination.value.rowsPerPage = rowsPerPage
    pagination.value.sortBy = sortBy
    pagination.value.descending = descending
  }

  const updateRowsNumber = (rowsNumber: number) => {
    pagination.value.rowsNumber = rowsNumber
  }

  const totalPages: ComputedRef<number> = computed(() => {
    if (pagination.value.rowsNumber === -1) {
      return 1
    }

    return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage) as number
  })

  return {
    totalPages,
    pagination,
    updateFromTableRequestProps,
    updateRowsNumber
  }
}
