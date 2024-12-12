<template>
  <div class="column items-stretch col-grow">
    <q-spinner v-if="loading || !report" />
    <q-markup-table v-else>
      <tbody>
        <tr>
          <td />
          <td
            v-for="month in report.months"
            :key="month"
          >
            {{ month.monthText }}
          </td>
        </tr>
        <tr>
          <td>
            {{ $t('ofActiveMembers') }}
          </td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.activeMembers[month.monthLeadingZero] }}
          </td>
        </tr>
        <tr>
          <td>{{ $t('servicedMembers') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.servicedMembers[month.monthLeadingZero] }}
          </td>
        </tr>
        <tr>
          <td>{{ $t('balanceUtilization') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
            :title="`${report.reportData.balanceUtilization[month.monthLeadingZero].ordersAmount} $ of ${report.reportData.balanceUtilization[month.monthLeadingZero].refillAmount } $`"
          >
            {{ report.reportData.balanceUtilization[month.monthLeadingZero].utilizationPercent }}%
          </td>
        </tr>
        <tr class="bg-toner">
          <td>{{ $t('ordersByChannels') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.ordersByChannels[month.monthLeadingZero].all }}
          </td>
        </tr>
        <tr>
          <td>{{ $t('staff') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.ordersByChannels[month.monthLeadingZero].staff }}
          </td>
        </tr>

        <tr>
          <td>{{ $t('fax') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.ordersByChannels[month.monthLeadingZero].fax }}
          </td>
        </tr>
        <tr>
          <td>{{ $t('online') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.ordersByChannels[month.monthLeadingZero].online }}
          </td>
        </tr>
        <tr>
          <td>{{ $t('call') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.ordersByChannels[month.monthLeadingZero].call }}
          </td>
        </tr>
        <tr class="bg-toner">
          <td>{{ $t('performers') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          />
        </tr>
        <tr>
          <td>{{ $t('member') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.ordersByPerformers[month.monthLeadingZero].member }}
          </td>
        </tr>
        <tr>
          <td>{{ $t('poaRelative') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.ordersByPerformers[month.monthLeadingZero].relative }}
          </td>
        </tr>
        <tr v-for="(s, staffType) in Object.values(report.reportData.ordersByPerformers)[0].staff">
          <td>{{ staffType }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.ordersByPerformers[month.monthLeadingZero].staff[staffType] }}
          </td>
        </tr>
        <tr class="bg-toner">
          <td>{{ $t('delivery') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          />
        </tr>
        <tr>
          <td>{{ $t('nursingFacility') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.ordersByDeliveryAddressTypes[month.monthLeadingZero].facility }}
          </td>
        </tr>
        <tr>
          <td>{{ $t('home') }}</td>
          <td
            v-for="month in report?.months"
            :key="month"
          >
            {{ report.reportData.ordersByDeliveryAddressTypes[month.monthLeadingZero].home }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>
<script setup lang="ts">
import FacilityModel from 'src/models/facility/FacilityModel'
import { api } from 'boot/axios'
import FacilityApi from 'src/api/FacilityApi'
import { onMounted, Ref, ref } from 'vue'
import { FacilityReport } from 'src/models/facility/FacilityReport'

const facilityRepository: FacilityApi = new FacilityApi(api)
const props = defineProps<{
  facility: FacilityModel
}>()
const report: Ref<FacilityReport | null> = ref(null)
const loading = ref<boolean>(false)

onMounted(async () => {
  loading.value = true
  report.value = await facilityRepository.getFacilityReport(Number(props.facility.id))
  loading.value = false
  // todo complete Performers
})

</script>
