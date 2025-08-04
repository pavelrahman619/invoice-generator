from rest_framework import serializers
from .models import Company, Client, Invoice, InvoiceItem
import logging

logger = logging.getLogger(__name__)

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'
    
    def validate_name(self, value):
        if len(value) > 200:
            logger.warning(f"Company name exceeds 200 characters: {len(value)} characters")
            raise serializers.ValidationError("Company name cannot exceed 200 characters")
        return value
    
    def validate_city(self, value):
        if len(value) > 100:
            logger.warning(f"Company city exceeds 100 characters: {len(value)} characters")
            raise serializers.ValidationError("City cannot exceed 100 characters")
        return value
    
    def validate_state(self, value):
        if len(value) > 100:
            logger.warning(f"Company state exceeds 100 characters: {len(value)} characters")
            raise serializers.ValidationError("State cannot exceed 100 characters")
        return value
    
    def validate_zip_code(self, value):
        if len(value) > 20:
            logger.warning(f"Company zip code exceeds 20 characters: {len(value)} characters")
            raise serializers.ValidationError("ZIP code cannot exceed 20 characters")
        return value
    
    def validate_country(self, value):
        if len(value) > 100:
            logger.warning(f"Company country exceeds 100 characters: {len(value)} characters")
            raise serializers.ValidationError("Country cannot exceed 100 characters")
        return value
    
    def validate_phone(self, value):
        if len(value) > 20:
            logger.warning(f"Company phone exceeds 20 characters: {len(value)} characters")
            raise serializers.ValidationError("Phone number cannot exceed 20 characters")
        return value

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'
    
    def validate_name(self, value):
        if len(value) > 200:
            logger.warning(f"Client name exceeds 200 characters: {len(value)} characters")
            raise serializers.ValidationError("Client name cannot exceed 200 characters")
        return value
    
    def validate_city(self, value):
        if len(value) > 100:
            logger.warning(f"Client city exceeds 100 characters: {len(value)} characters")
            raise serializers.ValidationError("City cannot exceed 100 characters")
        return value
    
    def validate_state(self, value):
        if len(value) > 100:
            logger.warning(f"Client state exceeds 100 characters: {len(value)} characters")
            raise serializers.ValidationError("State cannot exceed 100 characters")
        return value
    
    def validate_zip_code(self, value):
        if len(value) > 20:
            logger.warning(f"Client zip code exceeds 20 characters: {len(value)} characters")
            raise serializers.ValidationError("ZIP code cannot exceed 20 characters")
        return value
    
    def validate_country(self, value):
        if len(value) > 100:
            logger.warning(f"Client country exceeds 100 characters: {len(value)} characters")
            raise serializers.ValidationError("Country cannot exceed 100 characters")
        return value
    
    def validate_phone(self, value):
        if len(value) > 20:
            logger.warning(f"Client phone exceeds 20 characters: {len(value)} characters")
            raise serializers.ValidationError("Phone number cannot exceed 20 characters")
        return value

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'rate', 'amount']
    
    def validate_description(self, value):
        if len(value) > 500:
            logger.warning(f"Invoice item description exceeds 500 characters: {len(value)} characters")
            raise serializers.ValidationError("Description cannot exceed 500 characters")
        if not value.strip():
            logger.warning("Empty description provided for invoice item")
            raise serializers.ValidationError("Description cannot be empty")
        return value
    
    def validate_quantity(self, value):
        if value <= 0:
            logger.warning(f"Invalid quantity provided: {value}")
            raise serializers.ValidationError("Quantity must be greater than 0")
        if value > 999999.99:
            logger.warning(f"Quantity exceeds maximum allowed: {value}")
            raise serializers.ValidationError("Quantity cannot exceed 999,999.99")
        return value
    
    def validate_rate(self, value):
        if value < 0:
            logger.warning(f"Negative rate provided: {value}")
            raise serializers.ValidationError("Rate cannot be negative")
        if value > 99999999.99:
            logger.warning(f"Rate exceeds maximum allowed: {value}")
            raise serializers.ValidationError("Rate cannot exceed 99,999,999.99")
        return value

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    company_details = CompanySerializer(source='company', read_only=True)
    client_details = ClientSerializer(source='client', read_only=True)
    
    class Meta:
        model = Invoice
        fields = [
            'id', 'invoice_number', 'company', 'client', 'invoice_date', 
            'due_date', 'status', 'subtotal', 'tax_rate', 'tax_amount', 
            'total', 'notes', 'items', 'company_details', 'client_details',
            'created_at', 'updated_at'
        ]
    
    def validate_invoice_number(self, value):
        if len(value) > 50:
            logger.warning(f"Invoice number exceeds 50 characters: {len(value)} characters - '{value}'")
            raise serializers.ValidationError("Invoice number cannot exceed 50 characters")
        if not value.strip():
            logger.warning("Empty invoice number provided")
            raise serializers.ValidationError("Invoice number cannot be empty")
        
        # Check for uniqueness if this is a new invoice or if the number changed
        instance = getattr(self, 'instance', None)
        if instance is None or instance.invoice_number != value:
            if Invoice.objects.filter(invoice_number=value).exists():
                logger.warning(f"Duplicate invoice number attempted: {value}")
                raise serializers.ValidationError("Invoice number must be unique")
        return value
    
    def validate_subtotal(self, value):
        if value < 0:
            logger.warning(f"Negative subtotal provided: {value}")
            raise serializers.ValidationError("Subtotal cannot be negative")
        if value > 99999999.99:
            logger.warning(f"Subtotal exceeds maximum allowed: {value}")
            raise serializers.ValidationError("Subtotal cannot exceed 99,999,999.99")
        return value
    
    def validate_tax_rate(self, value):
        if value < 0:
            logger.warning(f"Negative tax rate provided: {value}")
            raise serializers.ValidationError("Tax rate cannot be negative")
        if value > 100:
            logger.warning(f"Tax rate exceeds 100%: {value}")
            raise serializers.ValidationError("Tax rate cannot exceed 100%")
        return value
    
    def validate_total(self, value):
        if value < 0:
            logger.warning(f"Negative total provided: {value}")
            raise serializers.ValidationError("Total cannot be negative")
        if value > 99999999.99:
            logger.warning(f"Total exceeds maximum allowed: {value}")
            raise serializers.ValidationError("Total cannot exceed 99,999,999.99")
        return value
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        invoice = Invoice.objects.create(**validated_data)
        
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=invoice, **item_data)
        
        return invoice
    
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])
        
        # Update invoice fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update items
        instance.items.all().delete()
        for item_data in items_data:
            InvoiceItem.objects.create(invoice=instance, **item_data)
        
        return instance

class InvoiceCreateSerializer(serializers.Serializer):
    # Company details with validation
    company_name = serializers.CharField(max_length=200)
    company_address = serializers.CharField(required=False, allow_blank=True)
    company_city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    company_state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    company_zip_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    company_country = serializers.CharField(max_length=100, required=False, allow_blank=True)
    company_email = serializers.EmailField(required=False, allow_blank=True)
    company_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    # Client details with validation
    client_name = serializers.CharField(max_length=200)
    client_address = serializers.CharField(required=False, allow_blank=True)
    client_city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    client_state = serializers.CharField(max_length=100, required=False, allow_blank=True)
    client_zip_code = serializers.CharField(max_length=20, required=False, allow_blank=True)
    client_country = serializers.CharField(max_length=100, required=False, allow_blank=True)
    client_email = serializers.EmailField(required=False, allow_blank=True)
    client_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    # Invoice details with validation
    invoice_number = serializers.CharField(max_length=50)
    invoice_date = serializers.DateField()
    due_date = serializers.DateField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    tax_rate = serializers.DecimalField(max_digits=5, decimal_places=2, min_value=0, max_value=100)
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, min_value=0)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    # Items
    items = InvoiceItemSerializer(many=True)
    
    def validate_invoice_number(self, value):
        if len(value) > 50:
            logger.error(f"Invoice number validation failed: {len(value)} characters (max 50) - '{value}'")
            raise serializers.ValidationError("Invoice number cannot exceed 50 characters")
        if not value.strip():
            logger.error("Empty invoice number provided")
            raise serializers.ValidationError("Invoice number cannot be empty")
        if Invoice.objects.filter(invoice_number=value).exists():
            logger.error(f"Duplicate invoice number attempted: {value}")
            raise serializers.ValidationError("Invoice number already exists")
        return value
    
    def validate_company_name(self, value):
        if len(value) > 200:
            logger.error(f"Company name validation failed: {len(value)} characters (max 200)")
            raise serializers.ValidationError("Company name cannot exceed 200 characters")
        if not value.strip():
            logger.error("Empty company name provided")
            raise serializers.ValidationError("Company name cannot be empty")
        return value
    
    def validate_client_name(self, value):
        if len(value) > 200:
            logger.error(f"Client name validation failed: {len(value)} characters (max 200)")
            raise serializers.ValidationError("Client name cannot exceed 200 characters")
        if not value.strip():
            logger.error("Empty client name provided")
            raise serializers.ValidationError("Client name cannot be empty")
        return value
    
    def validate_items(self, value):
        if not value:
            logger.error("No items provided for invoice")
            raise serializers.ValidationError("Invoice must have at least one item")
        
        for idx, item in enumerate(value):
            if len(item.get('description', '')) > 500:
                logger.error(f"Item {idx+1} description exceeds 500 characters: {len(item.get('description', ''))}")
                raise serializers.ValidationError(f"Item {idx+1} description cannot exceed 500 characters")
            if not item.get('description', '').strip():
                logger.error(f"Item {idx+1} has empty description")
                raise serializers.ValidationError(f"Item {idx+1} description cannot be empty")
        
        return value
    
    def validate(self, data):
        # Cross-field validation
        if data['invoice_date'] > data['due_date']:
            logger.error(f"Due date {data['due_date']} is before invoice date {data['invoice_date']}")
            raise serializers.ValidationError("Due date cannot be before invoice date")
        
        # Validate calculated totals
        items = data.get('items', [])
        calculated_subtotal = sum(item['quantity'] * item['rate'] for item in items)
        calculated_tax = (calculated_subtotal * data['tax_rate']) / 100
        calculated_total = calculated_subtotal + calculated_tax
        
        # Allow small rounding differences (within 0.01)
        if abs(calculated_subtotal - data['subtotal']) > 0.01:
            logger.error(f"Subtotal mismatch: calculated {calculated_subtotal}, provided {data['subtotal']}")
            raise serializers.ValidationError("Subtotal calculation doesn't match items")
        
        if abs(calculated_tax - data['tax_amount']) > 0.01:
            logger.error(f"Tax amount mismatch: calculated {calculated_tax}, provided {data['tax_amount']}")
            raise serializers.ValidationError("Tax amount calculation doesn't match tax rate")
        
        if abs(calculated_total - data['total']) > 0.01:
            logger.error(f"Total mismatch: calculated {calculated_total}, provided {data['total']}")
            raise serializers.ValidationError("Total calculation doesn't match subtotal and tax")
        
        return data