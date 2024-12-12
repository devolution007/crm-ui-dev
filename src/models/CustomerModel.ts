import { InsurancePlanData, InsurancePlanModel } from './InsurancePlanModel'
import FileProfileModel from './FileProfileModel'
import ColorsOptionsModel from './ColorsOptionsModel'
import { EmailData, EmailModel } from './EmailModel'
import PhoneModel from './PhoneModel'
import LanguageModel from './LanguageModel'
import TagModel from './TagModel'
import FacilityModel from 'src/models/facility/FacilityModel'
import AddressModel from 'src/models/AddressModel'
import CartItemInterface from 'src/models/CartItem'
import { PhcOrganizationModel } from 'src/models/PhcOrganizationModel'
import { InsuranceOrganizationModel } from 'src/models/InsuranceOrganizationModel'
import CallModel from 'src/models/CallModel'
import IssueModel from 'src/models/IssueModel'
import OrderModel from 'src/models/OrderModel'
import { PhoneInterface } from 'src/models/Phone'
import { InsuranceCardData, InsuranceCardModel } from 'src/models/InsuranceCardModel'
import { CustomerNote, NoteBasic } from 'src/models/NoteModelShort'
import { InsuranceCompany } from 'src/models/InsuranceCompany'

export interface CustomerBasicInterface {
  insuranceId: string
  id: number
  email: string
  birthdate: string
  name: string
  birthdateStr: string
}

export interface CustomerInCall extends CustomerBasicInterface {
  insurancePlan: InsurancePlanData
}

export interface CustomerInputInterface {
  state: string
  firstName: string
  lastName: string
  gender: string
  birthdate: string
  language: string
  phone: string
  email?: string
  usePhoneAsLogin: boolean
}

export interface CustomerInputMetro extends CustomerInputInterface{
  insuranceCompany: number
}

export type CustomerPatchInterface = Partial<CustomerInputInterface>

class CustomerModel {
  insuranceId: string
  insuranceCards: InsuranceCardData[]
  insuranceCompany?: InsuranceCompany
  lastCall: CallModel
  lastOrder: OrderModel
  balance: number
  insurancePlan: InsurancePlanModel
  tags: TagModel[]
  emails: EmailModel[]
  color: string
  fileProfile: FileProfileModel
  id: number
  email: string
  gender: string
  noteForDisplay?: NoteBasic
  registered: boolean
  status: string
  colorHint: string
  colorsOptions: ColorsOptionsModel[]
  firstName: string
  lastName: string
  name: string
  notes?: CustomerNote[]
  phones: PhoneInterface[]
  addressHppString: string
  birthdateStr: string
  languages: LanguageModel[]
  langCode: string
  addresses: AddressModel[]
  facility: FacilityModel
  organization: InsuranceOrganizationModel
  phcOrganization?: PhcOrganizationModel
  phcPlan?: string
  cart: CartItemInterface[]
  state: string
  calls: CallModel[]
  grievances: IssueModel[]
  member: any

  constructor ({
    state,
    lastCall,
    lastOrder,
    insuranceId,
    balance,
    insurancePlan,
    insuranceCards,
    tags,
    emails,
    color,
    fileProfile,
    id,
    email,
    gender,
    noteForDisplay,
    registered,
    status,
    colorHint,
    colorsOptions,
    firstName,
    lastName,
    name,
    notes,
    phones,
    addressHppString,
    birthdateStr,
    languages,
    langCode,
    addresses,
    facility,
    organization,
    phcOrganization,
    phcPlan,
    member = null,
    calls = [],
    grievances = [],
    cart = [],
    insuranceCompany = null
  }: any = {}) {
    const colorsOptionsModel = colorsOptions && new ColorsOptionsModel(colorsOptions)
    this.colorsOptions = colorsOptionsModel && colorsOptionsModel.asArray()
    this.insuranceId = insuranceId
    this.balance = balance && Number(balance)
    this.insurancePlan = insurancePlan && new InsurancePlanModel(insurancePlan)
    this.insuranceCards = insuranceCards?.map((item: InsuranceCardData) => new InsuranceCardModel(item)) ?? []
    this.tags = tags?.map((item: any) => new TagModel(item)) ?? []
    this.emails = emails?.map((item: EmailData) => new EmailModel(item)) ?? []
    this.color = color
    this.fileProfile = fileProfile && new FileProfileModel(fileProfile)
    this.id = id || null
    this.email = email
    this.lastCall = lastCall
    this.lastOrder = lastOrder
    this.gender = gender
    this.noteForDisplay = noteForDisplay
    this.registered = registered
    this.status = status
    this.colorHint = colorHint
    this.firstName = firstName
    this.lastName = lastName
    this.state = state
    this.name = name
    this.notes = notes?.map((item: CustomerNote) => item) || []
    this.phones = phones?.map((item: any) => new PhoneModel(item)) ?? []
    this.addressHppString = addressHppString
    this.birthdateStr = birthdateStr
    this.languages = languages?.map((item: any) => new LanguageModel(item)) ?? []
    this.langCode = langCode
    this.addresses = addresses?.map((item: any) => new AddressModel(item))
    this.facility = facility && new FacilityModel(facility)
    this.organization = organization && new InsuranceOrganizationModel(organization)
    this.phcOrganization = (phcOrganization && new PhcOrganizationModel(phcOrganization)) || null
    this.phcPlan = phcPlan || null
    this.cart = cart?.map((item: CartItemInterface) => item) ?? []
    this.calls = calls?.map((item: any) => new CallModel(item)) ?? []
    this.grievances = grievances?.map((item: any) => new IssueModel(item)) ?? []
    this.insuranceCompany = insuranceCompany || null
    this.member = member || null
  }
}

export default CustomerModel
