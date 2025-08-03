import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { InvoiceForm as InvoiceFormType } from '../types/invoice';

interface Props {
  onSubmit: (data: InvoiceFormType) => void;
}

const InvoiceForm: React.FC<Props> = ({ onSubmit }) => {
  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<InvoiceFormType>({
    defaultValues: {
      companyDetails: {
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        email: '',
        phone: ''
      },
      billingInfo: {
        billTo: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        email: '',
        phone: ''
      },
      invoiceNumber: `INV-${Date.now()}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      items: [{ id: '1', description: '', quantity: 1, rate: 0, amount: 0 }],
      notes: '',
      subtotal: 0,
      taxRate: 0,
      taxAmount: 0,
      total: 0
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  });

  const watchedItems = watch('items');
  const watchedTaxRate = watch('taxRate');

  // Calculate totals
  useEffect(() => {
    const items = watchedItems || [];
    const subtotal = items.reduce((sum, item) => {
      const amount = (item.quantity || 0) * (item.rate || 0);
      return sum + amount;
    }, 0);

    const taxAmount = (subtotal * (watchedTaxRate || 0)) / 100;
    const total = subtotal + taxAmount;

    setValue('subtotal', subtotal);
    setValue('taxAmount', taxAmount);
    setValue('total', total);

    // Update individual item amounts
    items.forEach((item, index) => {
      const amount = (item.quantity || 0) * (item.rate || 0);
      setValue(`items.${index}.amount`, amount);
    });
  }, [watchedItems, watchedTaxRate, setValue]);

  const addItem = () => {
    append({
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
        </div>

        {/* Company Details and Invoice Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Company Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">From</h2>
            <div className="space-y-3">
              <input
                {...register('companyDetails.name', { required: 'Company name is required' })}
                placeholder="Company Name"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.companyDetails?.name && (
                <p className="text-red-500 text-sm">{errors.companyDetails.name.message}</p>
              )}
              
              <input
                {...register('companyDetails.address')}
                placeholder="Address"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  {...register('companyDetails.city')}
                  placeholder="City"
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  {...register('companyDetails.state')}
                  placeholder="State"
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  {...register('companyDetails.zipCode')}
                  placeholder="ZIP Code"
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  {...register('companyDetails.country')}
                  placeholder="Country"
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <input
                {...register('companyDetails.email')}
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <input
                {...register('companyDetails.phone')}
                placeholder="Phone"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Invoice Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Invoice Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Invoice Number</label>
                <input
                  {...register('invoiceNumber', { required: 'Invoice number is required' })}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.invoiceNumber && (
                  <p className="text-red-500 text-sm">{errors.invoiceNumber.message}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Invoice Date</label>
                <input
                  {...register('invoiceDate', { required: 'Invoice date is required' })}
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
                <input
                  {...register('dueDate', { required: 'Due date is required' })}
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Bill To</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <input
                {...register('billingInfo.billTo', { required: 'Bill to name is required' })}
                placeholder="Client Name"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.billingInfo?.billTo && (
                <p className="text-red-500 text-sm">{errors.billingInfo.billTo.message}</p>
              )}
              
              <input
                {...register('billingInfo.address')}
                placeholder="Address"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  {...register('billingInfo.city')}
                  placeholder="City"
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  {...register('billingInfo.state')}
                  placeholder="State"
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <input
                  {...register('billingInfo.zipCode')}
                  placeholder="ZIP Code"
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  {...register('billingInfo.country')}
                  placeholder="Country"
                  className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <input
                {...register('billingInfo.email')}
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              
              <input
                {...register('billingInfo.phone')}
                placeholder="Phone"
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Add Item
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 p-3 text-left">Description</th>
                  <th className="border border-gray-300 p-3 text-center w-24">Qty</th>
                  <th className="border border-gray-300 p-3 text-center w-32">Rate</th>
                  <th className="border border-gray-300 p-3 text-center w-32">Amount</th>
                  <th className="border border-gray-300 p-3 text-center w-16">Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id}>
                    <td className="border border-gray-300 p-2">
                      <input
                        {...register(`items.${index}.description` as const, { required: 'Description is required' })}
                        placeholder="Item description"
                        className="w-full p-2 border-0 focus:ring-0 focus:outline-none"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        {...register(`items.${index}.quantity` as const, { 
                          required: 'Quantity is required',
                          valueAsNumber: true,
                          min: { value: 0.01, message: 'Quantity must be greater than 0' }
                        })}
                        type="number"
                        step="0.01"
                        min="0.01"
                        className="w-full p-2 border-0 focus:ring-0 focus:outline-none text-center"
                      />
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        {...register(`items.${index}.rate` as const, { 
                          required: 'Rate is required',
                          valueAsNumber: true,
                          min: { value: 0, message: 'Rate must be 0 or greater' }
                        })}
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full p-2 border-0 focus:ring-0 focus:outline-none text-center"
                      />
                    </td>
                    <td className="border border-gray-300 p-2 text-center font-medium">
                      ${((watchedItems?.[index]?.quantity || 0) * (watchedItems?.[index]?.rate || 0)).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        disabled={fields.length === 1}
                        className="text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                      >
                        ×
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-80 space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${watch('subtotal')?.toFixed(2) || '0.00'}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <label className="text-gray-600">Tax Rate (%):</label>
              <input
                {...register('taxRate', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Tax rate must be 0 or greater' },
                  max: { value: 100, message: 'Tax rate cannot exceed 100%' }
                })}
                type="number"
                step="0.01"
                min="0"
                max="100"
                className="w-20 p-1 border border-gray-300 rounded text-center"
              />
            </div>
            
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Tax Amount:</span>
              <span className="font-medium">${watch('taxAmount')?.toFixed(2) || '0.00'}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 text-lg font-bold">
              <span>Total:</span>
              <span>${watch('total')?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-lg font-semibold mb-3 text-gray-700">Notes</label>
          <textarea
            {...register('notes')}
            placeholder="Additional notes or payment terms..."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-3 bg-green-600 text-white text-lg font-semibold rounded hover:bg-green-700 transition-colors"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
