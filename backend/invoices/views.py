from django.shortcuts import render

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import Company, Client, Invoice, InvoiceItem
from .serializers import (
    CompanySerializer, ClientSerializer, InvoiceSerializer, 
    InvoiceCreateSerializer
)

class CompanyListCreateView(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class ClientListCreateView(generics.ListCreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class InvoiceListView(generics.ListAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

class InvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

@api_view(['POST'])
def create_invoice_from_form(request):
    """Create invoice from frontend form data"""
    serializer = InvoiceCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        data = serializer.validated_data
        
        # Get or create company
        company, _ = Company.objects.get_or_create(
            name=data['company_name'],
            defaults={
                'address': data.get('company_address', ''),
                'city': data.get('company_city', ''),
                'state': data.get('company_state', ''),
                'zip_code': data.get('company_zip_code', ''),
                'country': data.get('company_country', ''),
                'email': data.get('company_email', ''),
                'phone': data.get('company_phone', ''),
            }
        )
        
        # Get or create client
        client, _ = Client.objects.get_or_create(
            name=data['client_name'],
            defaults={
                'address': data.get('client_address', ''),
                'city': data.get('client_city', ''),
                'state': data.get('client_state', ''),
                'zip_code': data.get('client_zip_code', ''),
                'country': data.get('client_country', ''),
                'email': data.get('client_email', ''),
                'phone': data.get('client_phone', ''),
            }
        )
        
        # Create invoice
        invoice = Invoice.objects.create(
            invoice_number=data['invoice_number'],
            company=company,
            client=client,
            invoice_date=data['invoice_date'],
            due_date=data['due_date'],
            subtotal=data['subtotal'],
            tax_rate=data['tax_rate'],
            tax_amount=data['tax_amount'],
            total=data['total'],
            notes=data.get('notes', ''),
        )
        
        # Create invoice items
        for item_data in data['items']:
            InvoiceItem.objects.create(
                invoice=invoice,
                description=item_data['description'],
                quantity=item_data['quantity'],
                rate=item_data['rate'],
                amount=item_data['amount'],
            )
        
        response_serializer = InvoiceSerializer(invoice)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def invoice_stats(request):
    """Get basic invoice statistics"""
    total_invoices = Invoice.objects.count()
    draft_invoices = Invoice.objects.filter(status='draft').count()
    paid_invoices = Invoice.objects.filter(status='paid').count()
    total_revenue = sum(invoice.total for invoice in Invoice.objects.filter(status='paid'))
    
    return Response({
        'total_invoices': total_invoices,
        'draft_invoices': draft_invoices,
        'paid_invoices': paid_invoices,
        'total_revenue': float(total_revenue),
    })
