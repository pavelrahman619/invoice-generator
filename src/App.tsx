import InvoiceForm from './components/InvoiceForm'
import type { InvoiceForm as InvoiceFormType } from './types/invoice'
import './App.css'

function App() {
  const handleInvoiceSubmit = (data: InvoiceFormType) => {
    console.log('Invoice Data:', data)
    // Here you could implement PDF generation, save to localStorage, etc.
    alert('Invoice generated! Check console for data.')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <InvoiceForm onSubmit={handleInvoiceSubmit} />
      </div>
    </div>
  )
}

export default App
