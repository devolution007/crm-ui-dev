// Type definitions for @nuxtjs/auth 4.8
// Project: https://auth.nuxtjs.org
// Definitions by: Ruskin Constant <https://github.com/jonnyparris>
//                Daniel Leal <https://github.com/danielgek>
//                Nick Bolles <https://github.com/NickBolles>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.1

import CallModel, { CallDetailed } from 'src/models/CallModel'
import { ProductInterface } from 'src/models/ProductModel'
import CustomerModel from 'src/models/CustomerModel'
import IssueModel from 'src/models/IssueModel'
import NoteModel from 'src/models/NoteModel'
import OrderModel from 'src/models/OrderModel'
import ProductRequestModel from 'src/models/ProductRequestModel'
import LanguageModel from 'src/models/LanguageModel'
import FacilityModel from 'src/models/facility/FacilityModel'
import { StaffInterface } from 'src/models/facility/StaffModel'
import FacilityReportModel from 'src/models/facility/FacilityReportModel'
import RefundListEntryModel from 'src/models/RefundListEntryModel'
import CommunicationModel from 'src/models/facility/CommunicationModel'
import StateModel from 'src/models/StateModel'
import { TaskLEInterface } from 'src/models/TaskModel'
import OrderRowModel from 'src/models/OrderRowModel'
import ContactRequestModel from 'src/models/ContactRequestModel'
import BackInStockModel from 'src/models/BackInStockModel'
import { FacilityCustomer } from 'src/models/facility/FacilityCustomer'

export interface ElementaryEntity {
  id: number
  name: string
}

export type AttachmentInfo = ElementaryEntity

export interface SelectOptions{
  text: string,
  value: string|number
}

export interface SelectOption {
  value: string|number
  label: string
}

export interface SelectNumOption {
  value: number
  label: string
}

export interface Task {
  product?: number|null
  comment: string|null
}

export interface StringMap { [key: string]: string | null }
export interface StringMapStrict { [key: string]: string }
export interface StringMapArr { [key: string]: string[] }
export interface StringMapNum { [key: string]: number }
export interface StringMapArrNum { [key: string]: number[] }

export type SortType = 'asc'| 'desc' | null
export type SortDirection = 'asc'| 'desc'
export interface SortBy {
  [key: string]: SortDirection
}

/**
 * @deprecated use SortBy instead
 * @see SortBy
 */
export interface Sort {
  id?: SortType
  createdAt?: SortType
  gender?: SortType
  birthdate?: SortType
  addedAt?: SortType
  insuranceId?: SortType
  csr?: SortType
}

export type CustomerSortKey = 'id' | 'createdAt' | 'insuranceId' | 'firstName' | 'lastName'
export type OrderSortKey = 'id'

interface targetListInputFields {
  type: 'text' | 'password' | 'textarea' | 'email' | 'search' | 'tel' | 'file' | 'number' | 'url' | 'time' | 'date'
  name: string
  desc: string
  queryName: string
  operatorsAllowed: string[]
  rule: any[]
  order: number
  multiple?: boolean
  origin?: string
  options?: object[]
}

export interface ColorIconConstEntry extends SelectNumOption {
  color: string
  icon: string
  code: string
}

type PaymentProcessorCode = 'prohealth' | 'credit' | 'trnsx' | 'nationsbenefits'

export interface BrokerRole {
  value: number,
  label: string,
  code: string
}

export interface Constant {
  CALL_CODES: object[]
  PHC_STATES: {
    code: string
    name: string
  }[]
  ORDER_TYPES: {
    [key: string]: string
  }
  LANGUAGES: LanguageModel[]
  ORDER_STATUSES: object
  ORDER_STATUS_CREATED: number
  ORDER_STATUS_CANCELLED: number
  ORDER_STATUS_SHIPPED: number
  ORDER_STATUS_PACKAGED: number
  ORDER_STATUS_PAID_NOT_VERIFIED: number
  STATUS_PACKAGED: number
  FAX_TYPES: string[]
  ATTACHMENT_UPLOAD_URL: string
  USA_STATES: StateModel[]
  PRODUCT_STATUS_IN_STOCK: string
  PRIMARY_LANGUAGE_NAME: string
  DEFAULT_LANGUAGE_ISO: string
  REFUND_REASONS: SelectOption[]
  REFUND_ROW_REJECT_REASONS: SelectOption[]
  REFUND_ROW_REVERSE_REASONS: SelectOption[]
  TASK_STATUSES: ColorIconConstEntry[]
  TASK_PRIORITIES: ColorIconConstEntry[]
  TASK_CATEGORIES: ColorIconConstEntry[]
  ORDER_TYPE_FAX: string
  CATEGORIES: object[]
  CARRIER_NAMES_LIST: string[]
  CALL_TYPES_LIST: object[]
  CALL_CATEGORIES: object[]
  ISSUE_CATEGORIES_LIST: object[]
  ISSUE_PRIORITY_LIST: object[]
  ISSUE_STATUS_LIST: object[]
  ISSUE_PRIORITIES: ColorIconConstEntry[]
  ISSUE_STATUSES: ColorIconConstEntry[]
  PAYMENT_PROCESSORS: { code: PaymentProcessorCode, label: string }[]
  PRODUCT_REQUEST_STATUSES: ColorIconConstEntry[]
  PRODUCT_REQUEST_RESOLUTIONS: ColorIconConstEntry[]
  PRODUCT_REQUEST_STATUS_CREATED_CODE: number
  PRODUCT_REQUEST_STATUS_DONE_CODE: number
  ACTIVE_CUSTOMER_STATUS: string
  FEATURES_ACCESS_ROLES: StringMapArrNum
  PHONE_TYPES: string[]
  STAFF_MEMBER_TYPES: string[]
  STAFF_PREFERRED_COMMUNICATION_WAY: string[],
  SKU_STATUSES: object[]
  GENDER_MALE_CODE: string
  GENDER_FEMALE_CODE: string
  PAYMENT_PROCESSOR_CODE_TRNSX: string
  PAYMENT_PROCESSOR_CODE_NATIONS: string
  PROJECT_DOMAIN_PHC: string
  PROJECT_DOMAIN_CCA: string
  PROJECT_DOMAIN_METRO: string
  BROKER_ROLES: BrokerRole[]
}

export type OrderType = Constant['ORDER_TYPES'][keyof Constant['ORDER_TYPES']]

interface PaymentMethodInputInterface {
  [key: string]: string|number|boolean|null
}
interface PaymentMethodInterface {
  code: PaymentProcessorCode
  input: PaymentMethodInputInterface
}

interface List {
  readonly items: object[]
  readonly totalPages: number
  readonly totalItemCount: number
}

export interface CallList extends List{
  readonly items: CallDetailed[]
}

export interface CatalogList extends List{
  readonly items: ProductInterface[]
}

export interface CustomerList extends List{
   items: CustomerModel[]
}

export interface FacilityCustomerList extends List{
   items: FacilityCustomer[]
}

export interface IssueList extends List{
  readonly items: IssueModel[]
}
export interface FacilityCommunicationLogList extends List{
  readonly items: CommunicationModel[]
}
export interface FacilityList extends List{
  readonly items: FacilityModel[]
}
export interface FacilityReportList extends List{
  readonly items: FacilityReportModel[]
  readonly meta: {
    activeCustomers: number
    servedMembers: number
    servedMembersPrevMonth: number
  }
}

export interface StaffList extends List {
  readonly items: StaffInterface[]
}
export interface NoteList extends List{
  readonly items: NoteModel[]
}

export interface OrderList extends List{
  readonly items: OrderModel[]
}

export interface RefundList extends List{
  readonly items: RefundListEntryModel[]
}

export interface TaskList extends List {
  readonly items: TaskLEInterface[]
}

export interface BackInStockList extends List {
  readonly items: BackInStockModel[]
}

export interface ProductRequestList extends List {
  readonly items: ProductRequestModel[]
}
export interface BackInStockFilter {
  from?: string
  sku?: string
  to?: string
  memberId?: number
  organizationId?: number
  status?: string
  isDone?: boolean
  types?: ('email'| 'phone'| 'sms')[]
}

export interface ContactRequestList extends List{
  readonly items: ContactRequestModel[]
}

export interface CallsFilter {
  type: string | null
  insuranceId: string | null
  orderId: number | null
  from: string | null
  to: string | null
  categories: object[]
  memberId: number | null
  organizationId: number | null
}

export interface IssuesFilter {
  customerId?: number
  orderId?: number
  insuranceId?: string
  from?: string
  to?: string
  category?: string[]
  statuses?: string[]
  memberId?: number
  organizationId?: number
  period?: string
}

export interface CustomersFilter {
  search?: string
  name?: string
  combined?: string
  cardNumber?: string
  balance?: number
}

export interface FacilityCommunicationLogFilter {
  facilityId?: number
}

export interface FacilityCustomersFilter extends CustomersFilter{
  lastOrderType?: string
  facilityId?: number
  lastOrderedAt?: string
}

export interface IssueFilter {
  period?: string
  customerId?: number
  orderId?: number
  insuranceId?: string
  from?: string
  to?: string
  category?: string
  statuses?: object[]
  memberId?: number
  ids?: number[]
}

export interface NoteFilter {
  customerId?: number
}

export interface OrdersFilter {
  customerId?: number|null
  performerId?: number|null
  status?: number[]|number|null
  period?: string|null
  orderType?: string|string[]|null
  carrier?: string|string[]|null
  firstName?: string|null
  lastName?: string|null
  insuranceId?: string| null
  orderId?: number|null
  organizationId?: number|null
  facilityId?: number| null
  trackingNumber?: string| null
  orderFrom?: string
  orderTo?: string
}

export interface RefundsFilter {
  orderId?: string | null
  refundId?: string | null
  reasons?: number[]
  returnWindow?: string | null
  refundRequestedOnFrom?: string | null
  refundRequestedOnTo?: string | null
  refundRequestedBy?: number[]
  organizations?: number[]
}

export interface TasksFilter {
  assignedTo?: number | null
  status: number[],
  title: string,
  category?: number[] | []
}

export interface ProductRequestFilter {
  insuranceId?: string|null
  memberId?: number|null
  resolution?: number|null
  productName?: string|null
  createdAtTo?: string|undefined
  createdAtFrom?: string|undefined
  processedAtFrom?: string|undefined
  processedAtTo?: string|undefined
  organizationId?: number|null
}

export interface ContactRequestFilter {
  insuranceId?: string
  orderId?: string
  name?: string
}

export type SkuType = 'item' | 'catalog' | 'gift'
export type NotifyType = 'email' | 'phone' | 'sms'

export interface WishlistItemInterface {
  id: number
  product: ProductInterface
}

export interface BackInStockItemInterface {
  id: number
  product: ProductInterface
  noticeType: NotifyType
  noticeTarget: string
}

export interface ProductsFilter {
  type: SkuType
  category?: number[]|number
  plan?: string
  skus?: string,
  customerId: number
  search?: string
  activeIngredient?: string
  strength?: string
  form?: string
  symptom?: string
  priceTo?: number|null
}

export interface FacilityOrdersScheduleFilter {
  memberId?: number
  facilityIds: number[]
}

export interface FacilityFilter {
  name?: string
  memberId?: number
  verified?: boolean
}

export interface StaffFilter {
  name?: string
  email?: string
  facilityIds: number[]
  isActive?: boolean
}

export interface FacilityLogForm {
  dateTime?: string
  staff?: number
  channel?: string
  reason?: string
  link?: string
  result?: string
  facilityId?: number
}
interface orderRowsForm extends OrderRowModel{
  isSelected: boolean
}
export interface IssueAddForm {
  todo?: string
  complaintDescriptionJson?: object[]
  actionsDescriptionJson?: object[]
  category?: string
  isCallWithRepresentative?: boolean
  customerId?: number
  orderId?: number
  callId?: number
  status?: string
  priority?: string
  isMemberInformed?: boolean
  attachments?: AttachmentInfo[]
}

export interface RefundFormRegisteredRow {
  order_row_id: number
  sku: string
  name: string
  price: string
  reasons: number[]
  amount: number
  ordered: number
}

export interface RefundFormRow {
  order_row_id: number
  sku: string
  name: string
  price: string
  reason: number|null
  amount: number
  maxAmount: number
  ordered: number
}

export interface FacilityAssociationForm {
  facilityId?: number
}

export interface FacilityForm {
  address: {
    addressString: string|null
    addressOptionalString: string|null
    city: string|null
    county: string|null
    state: string|null
    zipCode: string|null
    phone: string|null
  }
  name: string|null
  manager: {
    id: number|null
    name: string|null
  }
  verified: boolean|null
}

export interface StaffForm {
  phone: string|null
  name: string|null
  title: string|null
  email: string|null
  note: string|null
  preferredWayOfCommunication: string|null
  primaryContact: boolean
  type: string|null
  facilities: number[]
}

export interface BrokerAgencyData {
  name: string
}

export interface FileUploadedResponse {
  xhr: XMLHttpRequest
  lastModified: number
  lastModifiedDate: Date
  name: string
  size: number
  type: string
}

export interface Storage {
  setUniversal(key: string, value: any, isJson?: boolean): string;
  getUniversal(key: string, isJson?: boolean): any;
  syncUniversal(key: string, defaultValue: any, isJson?: boolean): any;
  // Local State
  setState(key: string, val: any): string;
  getState(key: string): string;
  watchState(key: string, handler: (newValue: any) => void): any;
  // Cookies
  setCookie(key: string, val: any, options?: object): any;
  getCookie(key: string, isJson?: boolean): any;
  // Local Storage
  setLocalStorage(key: string, val: any, isJson?: boolean): any;
  getLocalStorage(key: string, isJson?: boolean): any;
}

export interface Auth<T = any> {
  ctx: any;
  $state: any;
  $storage: Storage;
  user: Partial<T>;
  loggedIn: boolean;
  loginWith(strategyName: string, ...args: any): Promise<never>;
  login(...args: any): Promise<never>;
  logout(): Promise<never>;
  fetchUser(): Promise<never>;
  fetchUserOnce(): Promise<never>;
  hasScope(scopeName: string): boolean;
  setToken(strategyName: string, token?: string): string;
  getToken(strategyName: string): string;
  syncToken(strategyName: string): string;
  onError(handler: (error: Error, name: string, endpoint: any) => void): any;
  setUser(user?: Partial<T>): any;
  reset(): Promise<never>;
  redirect(name: string): any;
}

/**
 * taken from node_modules/quasar/dist/types/index.d.ts:10302
 */
export interface QTableRequestProps {
  /**
   * Pagination object
   */
  pagination: {
    /**
     * Column name (from column definition)
     */
    sortBy: string;
    /**
     * Is sorting in descending order?
     */
    descending: boolean;
    /**
     * Page number (1-based)
     */
    page: number;
    /**
     * How many rows per page? 0 means Infinite
     */
    rowsPerPage: number;
  };
  /**
   * String/Object to filter table with (the 'filter' prop)
   */
  filter?: string | any;
  /**
   * Function to get a cell value
   * @param col Column name from column definitions
   * @param row The row object
   * @returns Parsed/Processed cell value
   */
  getCellValue: (col: any, row: any) => any;
}

export type BrokerAgenciesFilters = Array<{
  name: 'id',
  value: number
}>

export type BrokersFilters = BrokerAgenciesFilters[number]
  | { name: 'brokerAgency', value: number }
  | { name: 'role', value: number}
  | { name: 'status', value: number }

export interface BrokersSortBy {
  name: 'id' | 'name' | 'createdAt' | 'updatedAt',
  direction: 'asc' | 'desc'
}

export interface Broker {
  id: number,
  name: string,
  email: string,
  phone: string,
  role: BrokerRole['value']
  area: string,
  preferredCommunicationMethod: string,
  note: string,
  status: number,
  createdAt: string,
  updatedAt: string,
  agency: {
    id: string,
    name: string,
    bankName: null,
    bankRoutingNumber: null,
    bankAccount: null,
    newCouponDiscountPercent: number,
    newCouponOnlyFirstOrder: boolean,
    createdAt: string,
    updatedAt: string
  } | null
}

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface MenuExpansionItem {
  label?: string
  icon?: string
  to: string | { name: string }
  accessFeature?: string,
  hide?: boolean
}

export interface BrokerAgencies {
  id: number,
  name: string,
  createdAt: string,
  updatedAt: string
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth;
  }
}

declare global {
  interface Window {
    callOtcExtensionFunction?: (name: string, payload: Record<string, any>) => void; // Replace `() => void` with the actual function signature
  }
}
