import { targetListInputFields } from 'src/types'

export interface Expression {
  field: null|string
  operator: null|string
  value: null|string|number|boolean
  conjunction: null|string
  leftBracket: boolean
  rightBracket: boolean
}

interface Constants{
  FIELD_ERR: string,
  PHONE_RULES: any[]
  CARD_RULES:any[]
  CVV_RULES:any[]
  NAME_RULES:any[]
  LOGIN_RULES:any[]
  EMAIL_RULES:any[]
  DATE_RULES:any[]
  ERR_FORBIDDEN_ENTER: string
  TARGET_LIST_EMPTY_EXPRESSION: Expression
  TARGET_LIST_INPUT_FIELDS: targetListInputFields[]
  TARGET_LIST_SWITCHER_FIELDS: targetListInputFields[]
  TARGET_LIST_AJAX_SELECT_FIELDS: targetListInputFields[]
  TARGET_LIST_SELECT_FIELDS: targetListInputFields[]
  TARGET_LIST_FULL_FIELDS: targetListInputFields[]
}

const FIELD_ERR = 'Please, check the correctness of the field'
const PHONE_RULES = [(v: any) => (!v || /^\+\d\(\d{3}\)\d{3}-\d{4}$/.test(v)) || FIELD_ERR]
const CARD_RULES = [(v: any) => (!v || /^\d{4}-\d{4}-\d{4}-\d{5}$/.test(v)) || FIELD_ERR]
const CVV_RULES = [(v: any) => (!v || /^\d{4}$/.test(v)) || FIELD_ERR]
const NAME_RULES = [(v: any) => (!v || /^[a-z-. ]+$/i.test(v)) || FIELD_ERR]
const LOGIN_RULES = [(v: any) => (!v || /^[a-z0-9_-]{2,20}$/.test(v)) || FIELD_ERR]
const EMAIL_RULES = [(v: any) => (!v || /.+@.+\..+/.test(v)) || FIELD_ERR]
// DATE_RULES MM-DD-YYYY
const DATE_RULES = [(v: any) => !v || /^(1[0-2]|0[1-9])-(3[01]|[12][0-9]|0[1-9])-\d{4}$/.test(v) || FIELD_ERR]
const ERR_FORBIDDEN_ENTER = 'Access is denied. Your account is not active now. Contact support for help.'
const TARGET_LIST_EMPTY_EXPRESSION = {
  field: null,
  operator: null,
  value: null,
  conjunction: null,
  leftBracket: false,
  rightBracket: false
}

const TARGET_LIST_INPUT_FIELDS = [
  {
    type: 'text',
    name: 'City',
    desc: 'City',
    queryName: 'addresses.city',
    operatorsAllowed: ['='],
    rule: NAME_RULES,
    order: 5
  },
  {
    type: 'number',
    name: 'Birthday Year',
    desc: 'Input a birthday year',
    queryName: 'customerProfile.birthday_year',
    operatorsAllowed: ['=', '!=', '>', '<', '>=', '<='],
    rule: [(v: any) => !v || /^(19|20)\d{2}$/.test(v) || 'Field is not valid'],
    order: 11
  },
  {
    type: 'number',
    name: 'Balance',
    desc: 'Input the number',
    queryName: 'customer.balance',
    operatorsAllowed: ['=', '!=', '>', '<', '>=', '<='],
    rule: [(v: any) => !v || /^[1-9][0-9]*$/.test(v) || 'Field is not valid'],
    order: 17
  },
  {
    type: 'number',
    name: 'No orders last x days',
    desc: 'Input the number',
    queryName: 'orders.no_orders_within',
    operatorsAllowed: ['='],
    rule: [(v: any) => !v || /^[1-9][0-9]*$/.test(v) || 'Field is not valid'],
    order: 18
  },
  {
    type: 'number',
    name: 'No calls last x days',
    desc: 'Input the number',
    queryName: 'calls.no_calls_within',
    operatorsAllowed: ['='],
    rule: [(v: any) => !v || /^[1-9][0-9]*$/.test(v) || 'Field is not valid'],
    order: 19
  }
]
const TARGET_LIST_SWITCHER_FIELDS = [
  {
    name: 'Registered',
    desc: 'Registered on site',
    queryName: 'customer.confirmed',
    operatorsAllowed: ['='],
    order: 14
  }
]
const TARGET_LIST_AJAX_SELECT_FIELDS = [
  {
    name: 'Health Plan',
    origin: 'insurancePlans',
    desc: 'Insurance Plan',
    queryName: 'plan.organizationPlanId',
    operatorsAllowed: ['='],
    order: 3,
    multiple: true
  },
  {
    name: 'Last Call Category',
    desc: 'Last Call Category',
    origin: 'callCategories',
    queryName: 'calls.last_category',
    operatorsAllowed: ['='],
    order: 22,
    multiple: true
  },
  {
    name: 'Last Call CSR',
    desc: 'Last Call CSR',
    origin: 'members',
    queryName: 'calls.last_operator',
    operatorsAllowed: ['='],
    order: 20,
    multiple: true
  },
  {
    name: 'Project Name',
    desc: 'Organization',
    origin: 'organizations',
    queryName: 'organization.domainPrefix',
    operatorsAllowed: ['='],
    order: 1,
    multiple: true
  },
  {
    name: 'Address State',
    desc: 'Address State',
    origin: 'states',
    queryName: 'addresses.state',
    operatorsAllowed: ['='],
    order: 4,
    multiple: true
  },
  {
    name: 'Registration State',
    desc: 'Registration State',
    origin: 'phcStates',
    queryName: 'customer.state',
    operatorsAllowed: ['='],
    order: 4,
    multiple: true
  }
]
const TARGET_LIST_SELECT_FIELDS = [
  {
    name: 'Last Call Type',
    options: [
      {
        text: 'Inbound',
        value: 'inbound'
      },
      {
        text: 'Outbound',
        value: 'outbound'
      }
    ],
    desc: 'Last Call Type',
    queryName: 'calls.last_call_type',
    operatorsAllowed: ['='],
    order: 21,
    multiple: true
  },
  {
    name: 'Birthday Month',
    desc: 'Birthday Month',
    options: [
      {
        text: 'January',
        value: '01'
      },
      {
        text: 'February',
        value: '02'
      },
      {
        text: 'March',
        value: '03'
      },
      {
        text: 'April',
        value: '04'
      },
      {
        text: 'May',
        value: '05'
      },
      {
        text: 'June',
        value: '06'
      },
      {
        text: 'July',
        value: '07'
      },
      {
        text: 'August',
        value: '08'
      },
      {
        text: 'September',
        value: '09'
      },
      {
        text: 'October',
        value: '10'
      },
      {
        text: 'November',
        value: '11'
      },
      {
        text: 'December',
        value: '12'
      }
    ],
    queryName: 'customerProfile.birthday_month',
    operatorsAllowed: ['='],
    order: 12,
    multiple: false
  },
  {
    name: 'Has issues in status',
    options: [
      {
        text: 'New',
        value: 'New'
      },
      {
        text: 'In progress',
        value: 'In progress'
      },
      {
        text: 'Resolved',
        value: 'Resolved'
      }
    ],
    desc: 'Has issues in status',
    queryName: 'grievance.status',
    operatorsAllowed: ['='],
    order: 23,
    multiple: true
  },
  {
    name: 'Best mean of communication',
    options: [
      {
        text: 'Email',
        value: 'email'
      },
      {
        text: 'Phone',
        value: 'phone'
      }
    ],
    desc: '',
    queryName: 'customer.sendNotificationsBy',
    operatorsAllowed: ['='],
    order: 15,
    multiple: true
  },
  {
    name: 'Color',
    options: [
      {
        text: 'grey',
        value: 'grey'
      },
      {
        text: 'green',
        value: 'green'
      },
      {
        text: 'orange',
        value: 'orange'
      },
      {
        text: 'red',
        value: 'red'
      },
      {
        text: 'dark grey',
        value: 'dark grey'
      },
      {
        text: 'blue',
        value: 'blue'
      }
    ],
    desc: 'Color',
    queryName: 'customer.color',
    operatorsAllowed: ['='],
    order: 7,
    multiple: true
  },
  {
    name: 'Status',
    options: [
      {
        text: 'Locked',
        value: 'Locked'
      },
      {
        text: 'Active',
        value: 'Active'
      },
      {
        text: 'Inactive',
        value: 'Inactive'
      },
      {
        text: 'Outdated',
        value: 'Outdated'
      }
    ],
    desc: 'Status',
    queryName: 'customer.status',
    operatorsAllowed: ['='],
    order: 8,
    multiple: true
  },
  {
    name: 'Language',
    options: [
      {
        text: 'English',
        value: 'en'
      },
      {
        text: 'Spanish',
        value: 'es'
      },
      {
        text: 'German',
        value: 'de'
      },
      {
        text: 'Russian',
        value: 'ru'
      },
      {
        text: 'French',
        value: 'fr'
      }
    ],
    desc: 'Language',
    queryName: 'languages.language',
    operatorsAllowed: ['='],
    order: 9,
    multiple: true
  },
  {
    name: 'Gender',
    options: [
      {
        text: 'Female',
        value: 'F'
      },
      {
        text: 'Male',
        value: 'M'
      }
    ],
    desc: 'Gender',
    queryName: 'customerProfile.gender',
    operatorsAllowed: ['='],
    order: 10,
    multiple: false
  }
]
const TARGET_LIST_FULL_FIELDS = [
  ...TARGET_LIST_INPUT_FIELDS,
  ...TARGET_LIST_SELECT_FIELDS,
  ...TARGET_LIST_AJAX_SELECT_FIELDS,
  ...TARGET_LIST_SWITCHER_FIELDS
]

export default <Constants>{
  FIELD_ERR,
  PHONE_RULES,
  CARD_RULES,
  CVV_RULES,
  NAME_RULES,
  LOGIN_RULES,
  EMAIL_RULES,
  DATE_RULES,
  ERR_FORBIDDEN_ENTER,
  TARGET_LIST_EMPTY_EXPRESSION,
  TARGET_LIST_INPUT_FIELDS,
  TARGET_LIST_SWITCHER_FIELDS,
  TARGET_LIST_AJAX_SELECT_FIELDS,
  TARGET_LIST_SELECT_FIELDS,
  TARGET_LIST_FULL_FIELDS
}
