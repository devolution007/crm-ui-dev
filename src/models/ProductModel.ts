import ProductDetails from 'src/models/ProductDetails'

export interface ProductInterface {
  id: number
  sku: string
  name: string
  images: string[]
  inStockAmount: number
  mainImage: string
  manufacturer: string
  orderable: boolean
  price: string
  discontinued: boolean
  status: number
  statusName: string
  activeIngredients: string[]
  inactiveIngredients: string[]
  additional: string[]
  analogs: number[]
  description: string
  dualPurpose: string
  form: string
  packaging: string
  strength: string
  symptoms: string[]
  underPart?: string
  tags: string[]
  gift: boolean
  catalog: boolean
  nDC: string
}

/**
 * @deprecated We should use Interfaces instead
 */
class ProductModel {
  public readonly discontinued: boolean
  public readonly id: number
  public readonly images: string[]
  public readonly inStock: number
  public readonly mainImage: string
  public readonly manufacturer: string
  public readonly name: string
  public readonly orderable: boolean
  public readonly price: string
  public readonly sku: string
  public readonly status: number
  public readonly statusName: string
  public readonly activeIngredients: string[]
  public readonly additional: string[]
  public readonly analogs: string[]
  public readonly description: string
  public readonly dualPurpose: any
  public readonly form: any
  public readonly inactiveIngredients: string[]
  public readonly strength: string
  public readonly packaging: undefined
  public readonly symptoms: string[]
  public readonly underPart: any
  public readonly tags: object
  public readonly skuDetails: ProductDetails
  constructor ({
    id,
    sku,
    name,
    images,
    inStock,
    mainImage,
    manufacturer,
    orderable,
    price,
    discontinued,
    status,
    statusName,
    activeIngredients,
    inactiveIngredients,
    additional,
    analogs,
    description,
    dualPurpose,
    form,
    packaging,
    strength,
    symptoms,
    underPart,
    tags,
    skuDetails
  }: any) {
    this.discontinued = discontinued
    this.id = id
    this.images = images
    this.inStock = inStock
    this.mainImage = mainImage
    this.manufacturer = manufacturer
    this.name = name
    this.orderable = orderable
    this.price = price
    this.sku = sku
    this.status = status
    this.statusName = statusName
    this.activeIngredients = activeIngredients
    this.additional = additional
    this.analogs = analogs
    this.description = description
    this.dualPurpose = dualPurpose
    this.form = form
    this.inactiveIngredients = inactiveIngredients
    this.packaging = packaging
    this.strength = strength
    this.symptoms = symptoms
    this.underPart = underPart
    this.tags = tags
    this.skuDetails = skuDetails && new ProductDetails(skuDetails)
  }
}

export default ProductModel
