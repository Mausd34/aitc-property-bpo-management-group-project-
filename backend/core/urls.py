from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *
r=DefaultRouter(); r.register('clients',ClientViewSet); r.register('properties',PropertyViewSet); r.register('vendors',VendorViewSet); r.register('work-orders',WorkOrderViewSet); r.register('assignments',AssignmentViewSet); r.register('documents',DocumentViewSet); r.register('qa-reviews',QAReviewViewSet); r.register('notifications',NotificationViewSet); r.register('reports',ReportViewSet)
urlpatterns=[path('dashboard/',dashboard),path('',include(r.urls))]
