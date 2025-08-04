import { useState } from 'react'
import InvoiceForm from './components/InvoiceForm'
import { generateInvoicePDF } from './components/InvoicePDF'
import type { InvoiceForm as InvoiceFormType } from './types/invoice'
import './App.css'

function App() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  const handleInvoiceSubmit = async (data: InvoiceFormType): Promise<void> => {
    try {
      setIsGenerating(true)
      console.log('Invoice Data:', data)
      
      // Transform data for backend
      const backendData = {
        company_name: data.companyDetails.name,
        company_address: data.companyDetails.address,
        company_city: data.companyDetails.city,
        company_state: data.companyDetails.state,
        company_zip_code: data.companyDetails.zipCode,
        company_country: data.companyDetails.country,
        company_email: data.companyDetails.email,
        company_phone: data.companyDetails.phone,

        client_name: data.billingInfo.billTo,
        client_address: data.billingInfo.address,
        client_city: data.billingInfo.city,
        client_state: data.billingInfo.state,
        client_zip_code: data.billingInfo.zipCode,
        client_country: data.billingInfo.country,
        client_email: data.billingInfo.email,
        client_phone: data.billingInfo.phone,

        invoice_number: data.invoiceNumber,
        invoice_date: data.invoiceDate,
        due_date: data.dueDate,
        subtotal: data.subtotal,
        tax_rate: data.taxRate,
        tax_amount: data.taxAmount,
        total: data.total,
        notes: data.notes,
        items: data.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          rate: item.rate,
          amount: item.amount
        }))
      }

      // Save to backend
      const response = await fetch('http://localhost:8000/api/invoices/create-from-form/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(backendData),
      })

      if (!response.ok) {
        throw new Error('Failed to save invoice')
      }

      const savedInvoice = await response.json()
      console.log('Invoice saved:', savedInvoice)

      // Generate and download PDF
      await generateInvoicePDF(data)

      alert('Invoice created and PDF generated successfully!')
    } catch (error) {
      console.error('Error generating invoice:', error)
      alert('Failed to generate invoice. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {isGenerating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-700">Generating PDF...</span>
              </div>
            </div>
          </div>
        )}
        <InvoiceForm onSubmit={handleInvoiceSubmit} />
      </div>
    </div>
  )
}

export default App
