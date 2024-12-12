export interface BalanceUtilization {
  refillAmount: number
  ordersAmount: number
  utilizationPercent: number
}

export interface OrdersByChannels {
  staff: number;
  fax: number;
  online: number;
  call: number;
  all: number;
}

export interface OrdersByDeliveryAddressType {
  facility: number;
  home: number;
}

export interface OrdersByPerformer {
  staff: { [k: string]: number }
  member: number
  relative: number
}

export interface Staff {
  'NF staff': number;
}

export type LeadingZeroMonth = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';

interface ReportMonthDate {
  date:          Date;
  timezone_type: number;
  timezone:      string;
}

export interface ReportMonths {
  fromDate:         ReportMonthDate;
  toDate:           ReportMonthDate;
  year:             number;
  month:            number;
  monthLeadingZero: string;
  monthText:        string;
}


export interface FacilityReport {
  months: ReportMonths[]
  reportData: {
    activeMembers: { [k in LeadingZeroMonth]: number };
    servicedMembers: { [k in LeadingZeroMonth]: number };
    balanceUtilization: { [k in LeadingZeroMonth]: BalanceUtilization };
    ordersByChannels: { [k in LeadingZeroMonth]: OrdersByChannels };
    ordersByPerformers: { [k in LeadingZeroMonth]: OrdersByPerformer };
    ordersByDeliveryAddressTypes: { [k in LeadingZeroMonth]: OrdersByDeliveryAddressType };
  }
}
