from django.contrib import admin
from .models import *
for m in [Client,Property,Vendor,WorkOrder,Assignment,Document,QAReview,Notification,Report]: admin.site.register(m)
