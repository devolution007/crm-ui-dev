import { nextTick, Ref, ref, toRaw } from 'vue'

export default function useRangeMultiselect (tableRef: Ref) {
  const selected: Ref<any[]> = ref([])
  let storedSelectedRow: any = null

  return {
    tableRef,
    selected,
    handleSelection ({ rows, added, evt }: {
      /**
       * Array of row objects that were selected/unselected
       */
      rows: readonly any[];
      /**
       * Array of the keys of rows that were selected/unselected
       */
      keys: readonly any[];
      /**
       * Were the rows added to selection (true) or removed from selection (false)
       */
      added: boolean;
      /**
       * JS event object
       */
      evt: MouseEvent | KeyboardEvent;
    }) {
      // ignore selection change from header of not from a direct click event
      if (rows.length !== 1 || evt === void 0) {
        return
      }

      const oldSelectedRow = storedSelectedRow
      const [newSelectedRow] = rows
      const { ctrlKey, shiftKey } = evt

      if (!shiftKey) {
        storedSelectedRow = newSelectedRow
      }

      // wait for the default selection to be performed
      nextTick(() => {
        if (shiftKey) {
          const tableRows = tableRef.value.filteredSortedRows
          let firstIndex = tableRows.indexOf(oldSelectedRow)
          let lastIndex = tableRows.indexOf(newSelectedRow)

          if (firstIndex < 0) {
            firstIndex = 0
          }

          if (firstIndex > lastIndex) {
            [firstIndex, lastIndex] = [lastIndex, firstIndex]
          }

          const rangeRows = tableRows.slice(firstIndex, lastIndex + 1)
          // we need the original row object, so we can match them against the rows in range
          const selectedRows = selected.value// .map(toRaw)

          selected.value = added
            ? selectedRows.concat(rangeRows.filter((row: any) => !selectedRows.includes(row)))
            : selectedRows.filter(row => !rangeRows.includes(row))
        }
        /* else if (!ctrlKey && added) {
          selected.value = [newSelectedRow]
        } */
      })
    }
  }
}
