import EmailModel from 'src/models/EmailModel'

export class EmailEditDto {
  value: string
  isValid: boolean
  allowMarketing: boolean

  constructor (props: EmailModel) {
    this.value = props.value
    this.isValid = props.isValid
    this.allowMarketing = props.allowMarketing
  }
}
