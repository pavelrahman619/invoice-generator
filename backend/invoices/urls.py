from django.urls import path
from . import views

urlpatterns = [
    path('companies/', views.CompanyListCreateView.as_view(), name='company-list-create'),
    path('clients/', views.ClientListCreateView.as_view(), name='client-list-create'),
    path('invoices/', views.InvoiceListView.as_view(), name='invoice-list'),
    path('invoices/<uuid:pk>/', views.InvoiceDetailView.as_view(), name='invoice-detail'),
    path('invoices/create-from-form/', views.create_invoice_from_form, name='create-invoice-from-form'),
    path('stats/', views.invoice_stats, name='invoice-stats'),
]