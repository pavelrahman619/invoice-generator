from rest_framework import serializers
from .models import Company, Client, Invoice, InvoiceItem

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceItem
        fields = ['id', 'description', 'quantity', 'rate', 'amount']

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
    # Company details
    company_name = serializers.CharField(max_length=200)
    company_address = serializers.CharField(required=False, allow_blank=True)
    company_city = serializers.CharField(required=False, allow_blank=True)
    company_state = serializers.CharField(required=False, allow_blank=True)
    company_zip_code = serializers.CharField(required=False, allow_blank=True)
    company_country = serializers.CharField(required=False, allow_blank=True)
    company_email = serializers.EmailField(required=False, allow_blank=True)
    company_phone = serializers.CharField(required=False, allow_blank=True)
    
    # Client details
    client_name = serializers.CharField(max_length=200)
    client_address = serializers.CharField(required=False, allow_blank=True)
    client_city = serializers.CharField(required=False, allow_blank=True)
    client_state = serializers.CharField(required=False, allow_blank=True)
    client_zip_code = serializers.CharField(required=False, allow_blank=True)
    client_country = serializers.CharField(required=False, allow_blank=True)
    client_email = serializers.EmailField(required=False, allow_blank=True)
    client_phone = serializers.CharField(required=False, allow_blank=True)
    
    # Invoice details
    invoice_number = serializers.CharField(max_length=50)
    invoice_date = serializers.DateField()
    due_date = serializers.DateField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)
    tax_rate = serializers.DecimalField(max_digits=5, decimal_places=2)
    tax_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    total = serializers.DecimalField(max_digits=10, decimal_places=2)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    # Items
    items = InvoiceItemSerializer(many=True)