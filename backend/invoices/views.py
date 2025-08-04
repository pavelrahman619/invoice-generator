from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
import logging

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.shortcuts import get_object_or_404
from .models import Company, Client, Invoice, InvoiceItem
from .serializers import (
    CompanySerializer, ClientSerializer, InvoiceSerializer, 
    InvoiceCreateSerializer
)

logger = logging.getLogger(__name__)

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

@csrf_exempt
@api_view(['POST'])
def create_invoice_from_form(request):
    """Create invoice from frontend form data with comprehensive validation"""
    try:
        logger.info(f"Received invoice creation request from IP: {request.META.get('REMOTE_ADDR', 'unknown')}")
        logger.info(f"Request data keys: {list(request.data.keys())}")
        
        # Log field lengths for debugging
        if 'invoice_number' in request.data:
            logger.info(f"Invoice number length: {len(request.data['invoice_number'])} characters")
        if 'company_name' in request.data:
            logger.info(f"Company name length: {len(request.data['company_name'])} characters")
        if 'client_name' in request.data:
            logger.info(f"Client name length: {len(request.data['client_name'])} characters")
        
        # Log item descriptions for validation
        items = request.data.get('items', [])
        for idx, item in enumerate(items):
            if 'description' in item:
                logger.info(f"Item {idx+1} description length: {len(item['description'])} characters")
        
        serializer = InvoiceCreateSerializer(data=request.data)
        
        if serializer.is_valid():
            data = serializer.validated_data
            logger.info(f"Validation successful for invoice: {data['invoice_number']}")
            
            # Get or create company with overflow protection
            try:
                company, created = Company.objects.get_or_create(
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
                if created:
                    logger.info(f"Created new company: {company.name}")
                else:
                    logger.info(f"Using existing company: {company.name}")
            except Exception as e:
                logger.error(f"Company creation failed: {str(e)}")
                return Response(
                    {"success": False, "message": f"Company data validation failed: {str(e)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get or create client with overflow protection
            try:
                client, created = Client.objects.get_or_create(
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
                if created:
                    logger.info(f"Created new client: {client.name}")
                else:
                    logger.info(f"Using existing client: {client.name}")
            except Exception as e:
                logger.error(f"Client creation failed: {str(e)}")
                return Response(
                    {"success": False, "message": f"Client data validation failed: {str(e)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create invoice with validation
            try:
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
                logger.info(f"Created invoice: {invoice.invoice_number} with ID: {invoice.id}")
            except Exception as e:
                logger.error(f"Invoice creation failed: {str(e)}")
                return Response(
                    {"success": False, "message": f"Invoice creation failed: {str(e)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Create invoice items with validation
            try:
                created_items = []
                for idx, item_data in enumerate(data['items']):
                    item = InvoiceItem.objects.create(
                        invoice=invoice,
                        description=item_data['description'],
                        quantity=item_data['quantity'],
                        rate=item_data['rate'],
                        amount=item_data['amount'],
                    )
                    created_items.append(item)
                    logger.info(f"Created item {idx+1}: {item.description[:50]}...")
            except Exception as e:
                logger.error(f"Invoice item creation failed: {str(e)}")
                # Clean up created invoice if items fail
                invoice.delete()
                return Response(
                    {"success": False, "message": f"Invoice items creation failed: {str(e)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            response_serializer = InvoiceSerializer(invoice)
            logger.info(f"Successfully created invoice {invoice.invoice_number} with {len(created_items)} items")
            
            return Response(
                {"success": True, "data": response_serializer.data}, 
                status=status.HTTP_201_CREATED
            )
        
        # Log validation errors in detail
        logger.error(f"Validation failed for invoice creation:")
        for field, errors in serializer.errors.items():
            logger.error(f"  {field}: {errors}")
        
        return Response(
            {"success": False, "message": "Validation failed", "errors": serializer.errors}, 
            status=status.HTTP_400_BAD_REQUEST
        )
        
    except Exception as error:
        logger.error(f'Unexpected error in create_invoice_from_form: {error}', exc_info=True)
        return Response(
            {"success": False, "message": f"Internal server error: {str(error)}"}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

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
