
export interface PaymentDetailsInputInterface {
  input: {
    card: string;
    cvv: string;
  } | Record<string, never>
}

export interface PaymentDetailsInterface {
  id: number;
  processor: string;
  details: PaymentDetailsInputInterface | Record<string, unknown> | Record<string, never>;
  isActual: boolean;
}

export interface PaymentDetailsTRNSXInterface {
  result: {
    receiptNumber: string;
  }
  input: {
    card: string;
  }
}
export interface PaymentDetailsNATIONSInterface {
  result: {
    receiptNumber: string;
  }
  input: {
    card: string;
  }
}

export interface OrderActivePaymentInterface {
  id: number;
  processorCode: string;
  details: PaymentDetailsTRNSXInterface | PaymentDetailsNATIONSInterface | null;
}

