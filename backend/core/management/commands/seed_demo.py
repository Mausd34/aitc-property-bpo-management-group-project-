from django.core.management.base import BaseCommand
from core.models import Client,Property,Vendor,WorkOrder,Assignment
class Command(BaseCommand):
 def handle(self,*a,**k):
  c,_=Client.objects.get_or_create(email='demo@example.com',defaults={'name':'Demo U.S. Client','phone':'+1-555-0100','address':'New York, USA'})
  p,_=Property.objects.get_or_create(client=c,address='125 Demo Street, New York, USA',defaults={'property_type':'Residential'})
  v,_=Vendor.objects.get_or_create(email='vendor@example.com',defaults={'name':'Demo Vendor','phone':'+1-555-0200','service_area':'New York','rating':4.5})
  w,_=WorkOrder.objects.get_or_create(client=c,property=p,title='Demo Preservation Work',defaults={'description':'Demo work order','priority':'High','status':'Assigned'})
  Assignment.objects.get_or_create(work_order=w,vendor=v)
  self.stdout.write(self.style.SUCCESS('Demo data created.'))
