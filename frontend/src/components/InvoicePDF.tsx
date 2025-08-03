import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import { format } from 'date-fns';
import type { InvoiceForm as InvoiceFormType } from '../types/invoice';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Helvetica',
    fontSize: 10,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  section: {
    marginBottom: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  leftColumn: {
    flexDirection: 'column',
    flex: 1,
    marginRight: 20,
  },
  rightColumn: {
    flexDirection: 'column',
    flex: 1,
    marginLeft: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
    borderBottom: '1 solid #cccccc',
    paddingBottom: 3,
  },
  text: {
    fontSize: 10,
    marginBottom: 3,
    color: '#333333',
  },
  boldText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 3,
    color: '#333333',
  },
  table: {
    marginTop: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottom: '1 solid #cccccc',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1 solid #eeeeee',
    paddingVertical: 6,
    paddingHorizontal: 5,
    minHeight: 25,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    textAlign: 'left',
  },
  tableCellCenter: {
    flex: 1,
    fontSize: 9,
    textAlign: 'center',
  },
  tableCellRight: {
    flex: 1,
    fontSize: 9,
    textAlign: 'right',
  },
  descriptionCell: {
    flex: 3,
    fontSize: 9,
    textAlign: 'left',
  },
  quantityCell: {
    flex: 1,
    fontSize: 9,
    textAlign: 'center',
  },
  rateCell: {
    flex: 1,
    fontSize: 9,
    textAlign: 'right',
  },
  amountCell: {
    flex: 1,
    fontSize: 9,
    textAlign: 'right',
  },
  totalsSection: {
    marginTop: 20,
    alignItems: 'flex-end',
  },
  totalsContainer: {
    width: 200,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 2,
  },
  totalRowFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingVertical: 4,
    borderTop: '2 solid #333333',
    fontWeight: 'bold',
    fontSize: 12,
  },
  notes: {
    marginTop: 30,
    padding: 10,
    backgroundColor: '#f9f9f9',
    border: '1 solid #eeeeee',
  },
  notesTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333333',
  },
  notesText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: '#555555',
  },
});

interface InvoicePDFProps {
  invoiceData: InvoiceFormType;
}

const InvoicePDF: React.FC<InvoicePDFProps> = ({ invoiceData }) => {
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), 'MMMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toFixed(2)}`;
  };

  const formatAddress = (details: any): string => {
    const parts = [
      details.address,
      [details.city, details.state].filter(Boolean).join(', '),
      details.zipCode,
      details.country
    ].filter(Boolean);
    
    return parts.join('\n');
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>INVOICE</Text>
        </View>

        {/* Company and Invoice Details */}
        <View style={styles.row}>
          {/* Company Details */}
          <View style={styles.leftColumn}>
            <Text style={styles.sectionTitle}>From</Text>
            <Text style={styles.boldText}>{invoiceData.companyDetails.name}</Text>
            {invoiceData.companyDetails.address && (
              <Text style={styles.text}>{formatAddress(invoiceData.companyDetails)}</Text>
            )}
            {invoiceData.companyDetails.email && (
              <Text style={styles.text}>{invoiceData.companyDetails.email}</Text>
            )}
            {invoiceData.companyDetails.phone && (
              <Text style={styles.text}>{invoiceData.companyDetails.phone}</Text>
            )}
          </View>

          {/* Invoice Details */}
          <View style={styles.rightColumn}>
            <Text style={styles.sectionTitle}>Invoice Details</Text>
            <View style={styles.totalRow}>
              <Text style={styles.text}>Invoice Number:</Text>
              <Text style={styles.boldText}>{invoiceData.invoiceNumber}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.text}>Invoice Date:</Text>
              <Text style={styles.text}>{formatDate(invoiceData.invoiceDate)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.text}>Due Date:</Text>
              <Text style={styles.text}>{formatDate(invoiceData.dueDate)}</Text>
            </View>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text style={styles.boldText}>{invoiceData.billingInfo.billTo}</Text>
          {invoiceData.billingInfo.address && (
            <Text style={styles.text}>{formatAddress(invoiceData.billingInfo)}</Text>
          )}
          {invoiceData.billingInfo.email && (
            <Text style={styles.text}>{invoiceData.billingInfo.email}</Text>
          )}
          {invoiceData.billingInfo.phone && (
            <Text style={styles.text}>{invoiceData.billingInfo.phone}</Text>
          )}
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.descriptionCell}>Description</Text>
            <Text style={styles.quantityCell}>Qty</Text>
            <Text style={styles.rateCell}>Rate</Text>
            <Text style={styles.amountCell}>Amount</Text>
          </View>

          {/* Table Rows */}
          {invoiceData.items.map((item, index) => (
            <View key={item.id || index} style={styles.tableRow}>
              <Text style={styles.descriptionCell}>{item.description}</Text>
              <Text style={styles.quantityCell}>{item.quantity}</Text>
              <Text style={styles.rateCell}>{formatCurrency(item.rate)}</Text>
              <Text style={styles.amountCell}>{formatCurrency(item.amount)}</Text>
            </View>
          ))}
        </View>

        {/* Totals */}
        <View style={styles.totalsSection}>
          <View style={styles.totalsContainer}>
            <View style={styles.totalRow}>
              <Text style={styles.text}>Subtotal:</Text>
              <Text style={styles.text}>{formatCurrency(invoiceData.subtotal)}</Text>
            </View>
            
            {invoiceData.taxRate > 0 && (
              <>
                <View style={styles.totalRow}>
                  <Text style={styles.text}>Tax ({invoiceData.taxRate}%):</Text>
                  <Text style={styles.text}>{formatCurrency(invoiceData.taxAmount)}</Text>
                </View>
              </>
            )}
            
            <View style={styles.totalRowFinal}>
              <Text style={styles.boldText}>Total:</Text>
              <Text style={styles.boldText}>{formatCurrency(invoiceData.total)}</Text>
            </View>
          </View>
        </View>

        {/* Notes */}
        {invoiceData.notes && (
          <View style={styles.notes}>
            <Text style={styles.notesTitle}>Notes</Text>
            <Text style={styles.notesText}>{invoiceData.notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

// Function to generate and download PDF
export const generateInvoicePDF = async (invoiceData: InvoiceFormType): Promise<void> => {
  try {
    const doc = <InvoicePDF invoiceData={invoiceData} />;
    const pdfBlob = await pdf(doc).toBlob();
    
    // Create download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${invoiceData.invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
};

export default InvoicePDF;
