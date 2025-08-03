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
      
      // Generate and download PDF
      await generateInvoicePDF(data)
      
      // Optional: Save to localStorage for future reference
      const invoiceHistory = JSON.parse(localStorage.getItem('invoiceHistory') || '[]')
      const newInvoice = {
        ...data,
        generatedAt: new Date().toISOString()
      }
      invoiceHistory.push(newInvoice)
      localStorage.setItem('invoiceHistory', JSON.stringify(invoiceHistory))
      
      alert('Invoice PDF generated successfully!')
    } catch (error) {
      console.error('Error generating invoice:', error)
      alert('Failed to generate invoice PDF. Please try again.')
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
