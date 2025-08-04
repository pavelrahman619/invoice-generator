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

  const validationRules = {
    companyName: {
      required: 'Company name is required',
      maxLength: { value: 200, message: 'Company name cannot exceed 200 characters' }
    },
    billTo: {
      required: 'Bill to name is required',
      maxLength: { value: 200, message: 'Client name cannot exceed 200 characters' }
    },
    invoiceNumber: {
      required: 'Invoice number is required',
      maxLength: { value: 50, message: 'Invoice number cannot exceed 50 characters' }
    },
    city: {
      maxLength: { value: 100, message: 'City cannot exceed 100 characters' }
    },
    state: {
      maxLength: { value: 100, message: 'State cannot exceed 100 characters' }
    },
    zipCode: {
      maxLength: { value: 20, message: 'ZIP code cannot exceed 20 characters' }
    },
    country: {
      maxLength: { value: 100, message: 'Country cannot exceed 100 characters' }
    },
    phone: {
      maxLength: { value: 20, message: 'Phone number cannot exceed 20 characters' }
    },
    itemDescription: {
      required: 'Description is required',
      maxLength: { value: 500, message: 'Description cannot exceed 500 characters' }
    },
    quantity: {
      required: 'Quantity is required',
      min: { value: 0.01, message: 'Quantity must be greater than 0' },
      max: { value: 999999.99, message: 'Quantity cannot exceed 999,999.99' }
    },
    rate: {
      required: 'Rate is required',
      min: { value: 0, message: 'Rate cannot be negative' },
      max: { value: 99999999.99, message: 'Rate cannot exceed 99,999,999.99' }
    },
    taxRate: {
      min: { value: 0, message: 'Tax rate cannot be negative' },
      max: { value: 100, message: 'Tax rate cannot exceed 100%' }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="text-center border-b pb-6">
          <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">From</h2>
            <div className="space-y-3">
              <div>
                <input
                  {...register('companyDetails.name', validationRules.companyName)}
                  placeholder="Company Name"
                  maxLength={200}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.companyDetails?.name && (
                  <p className="text-red-500 text-sm">{errors.companyDetails.name.message}</p>
                )}
              </div>
              <textarea
                {...register('companyDetails.address')}
                placeholder="Address"
                rows={2}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    {...register('companyDetails.city', validationRules.city)}
                    placeholder="City"
                    maxLength={100}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {errors.companyDetails?.city && (
                    <p className="text-red-500 text-xs">{errors.companyDetails.city.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('companyDetails.state', validationRules.state)}
                    placeholder="State"
                    maxLength={100}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {errors.companyDetails?.state && (
                    <p className="text-red-500 text-xs">{errors.companyDetails.state.message}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    {...register('companyDetails.zipCode', validationRules.zipCode)}
                    placeholder="ZIP Code"
                    maxLength={20}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {errors.companyDetails?.zipCode && (
                    <p className="text-red-500 text-xs">{errors.companyDetails.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('companyDetails.country', validationRules.country)}
                    placeholder="Country"
                    maxLength={100}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {errors.companyDetails?.country && (
                    <p className="text-red-500 text-xs">{errors.companyDetails.country.message}</p>
                  )}
                </div>
              </div>
              <input
                {...register('companyDetails.email')}
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <div>
                <input
                  {...register('companyDetails.phone', validationRules.phone)}
                  placeholder="Phone"
                  maxLength={20}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.companyDetails?.phone && (
                  <p className="text-red-500 text-sm">{errors.companyDetails.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Invoice Details</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Invoice Number</label>
                <input
                  {...register('invoiceNumber', validationRules.invoiceNumber)}
                  maxLength={50}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.invoiceNumber && (
                  <p className="text-red-500 text-sm">{errors.invoiceNumber.message}</p>
                )}
                <p className="text-gray-500 text-xs mt-1">Maximum 50 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Invoice Date</label>
                <input
                  {...register('invoiceDate', { required: 'Invoice date is required' })}
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.invoiceDate && (
                  <p className="text-red-500 text-sm">{errors.invoiceDate.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
                <input
                  {...register('dueDate', { required: 'Due date is required' })}
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.dueDate && (
                  <p className="text-red-500 text-sm">{errors.dueDate.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Bill To</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <input
                  {...register('billingInfo.billTo', validationRules.billTo)}
                  placeholder="Client Name"
                  maxLength={200}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.billingInfo?.billTo && (
                  <p className="text-red-500 text-sm">{errors.billingInfo.billTo.message}</p>
                )}
              </div>
              <textarea
                {...register('billingInfo.address')}
                placeholder="Address"
                rows={2}
                className="w-full p-2 border border-gray-300 rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    {...register('billingInfo.city', validationRules.city)}
                    placeholder="City"
                    maxLength={100}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {errors.billingInfo?.city && (
                    <p className="text-red-500 text-xs">{errors.billingInfo.city.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('billingInfo.state', validationRules.state)}
                    placeholder="State"
                    maxLength={100}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {errors.billingInfo?.state && (
                    <p className="text-red-500 text-xs">{errors.billingInfo.state.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <input
                    {...register('billingInfo.zipCode', validationRules.zipCode)}
                    placeholder="ZIP Code"
                    maxLength={20}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {errors.billingInfo?.zipCode && (
                    <p className="text-red-500 text-xs">{errors.billingInfo.zipCode.message}</p>
                  )}
                </div>
                <div>
                  <input
                    {...register('billingInfo.country', validationRules.country)}
                    placeholder="Country"
                    maxLength={100}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                  {errors.billingInfo?.country && (
                    <p className="text-red-500 text-xs">{errors.billingInfo.country.message}</p>
                  )}
                </div>
              </div>
              <input
                {...register('billingInfo.email')}
                type="email"
                placeholder="Email"
                className="w-full p-2 border border-gray-300 rounded"
              />
              <div>
                <input
                  {...register('billingInfo.phone', validationRules.phone)}
                  placeholder="Phone"
                  maxLength={20}
                  className="w-full p-2 border border-gray-300 rounded"
                />
                {errors.billingInfo?.phone && (
                  <p className="text-red-500 text-sm">{errors.billingInfo.phone.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Items</h2>
            <button 
              type="button" 
              onClick={addItem} 
              className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
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
                        {...register(`items.${index}.description` as const, validationRules.itemDescription)}
                        placeholder="Item description"
                        maxLength={500}
                        className="w-full p-2 border-0 focus:ring-0 focus:outline-none"
                      />
                      {errors.items?.[index]?.description && (
                        <p className="text-red-500 text-xs mt-1">{errors.items[index]?.description?.message}</p>
                      )}
                      <p className="text-gray-400 text-xs">Max 500 chars</p>
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        {...register(`items.${index}.quantity` as const, {
                          ...validationRules.quantity,
                          valueAsNumber: true
                        })}
                        type="number"
                        step="0.01"
                        min="0.01"
                        max="999999.99"
                        className="w-full p-2 border-0 focus:ring-0 focus:outline-none text-center"
                      />
                      {errors.items?.[index]?.quantity && (
                        <p className="text-red-500 text-xs mt-1">{errors.items[index]?.quantity?.message}</p>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <input
                        {...register(`items.${index}.rate` as const, {
                          ...validationRules.rate,
                          valueAsNumber: true
                        })}
                        type="number"
                        step="0.01"
                        min="0"
                        max="99999999.99"
                        className="w-full p-2 border-0 focus:ring-0 focus:outline-none text-center"
                      />
                      {errors.items?.[index]?.rate && (
                        <p className="text-red-500 text-xs mt-1">{errors.items[index]?.rate?.message}</p>
                      )}
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      <span className="font-medium">
                        ${((watchedItems[index]?.quantity || 0) * (watchedItems[index]?.rate || 0)).toFixed(2)}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2 text-center">
                      {fields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-full md:w-1/2 space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Subtotal:</span>
              <span>${watch('subtotal')?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium">Tax Rate (%):</span>
              <input
                {...register('taxRate', {
                  ...validationRules.taxRate,
                  valueAsNumber: true
                })}
                type="number"
                step="0.01"
                min="0"
                max="100"
                className="w-20 p-1 text-right border border-gray-300 rounded"
              />
            </div>
            {errors.taxRate && (
              <p className="text-red-500 text-sm">{errors.taxRate.message}</p>
            )}
            <div className="flex justify-between">
              <span className="font-medium">Tax Amount:</span>
              <span>${watch('taxAmount')?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <span>${watch('total')?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-lg font-semibold mb-3 text-gray-700">Notes</label>
          <textarea
            {...register('notes')}
            placeholder="Additional notes or payment terms"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          >
            Generate Invoice
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
