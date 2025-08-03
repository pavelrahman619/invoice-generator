export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface CompanyDetails {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  phone: string;
}

export interface BillingInfo {
  billTo: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  email: string;
  phone: string;
}

export interface InvoiceForm {
  companyDetails: CompanyDetails;
  billingInfo: BillingInfo;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
}
