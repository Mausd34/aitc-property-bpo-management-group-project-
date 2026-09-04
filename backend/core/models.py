from django.db import models
from django.contrib.auth.models import User
class Client(models.Model):
 name=models.CharField(max_length=150); email=models.EmailField(); phone=models.CharField(max_length=40,blank=True); address=models.TextField(blank=True); status=models.CharField(max_length=50,default='Active')
 def __str__(self): return self.name
class Property(models.Model):
 client=models.ForeignKey(Client,on_delete=models.CASCADE,related_name='properties'); address=models.TextField(); property_type=models.CharField(max_length=80,blank=True); details=models.TextField(blank=True); status=models.CharField(max_length=50,default='Active'); image=models.ImageField(upload_to='properties/',blank=True,null=True)
 def __str__(self): return self.address
class Vendor(models.Model):
 name=models.CharField(max_length=150); email=models.EmailField(blank=True); phone=models.CharField(max_length=40,blank=True); service_area=models.CharField(max_length=150,blank=True); status=models.CharField(max_length=50,default='Active')
 def __str__(self): return self.name
class WorkOrder(models.Model):
 STATUS=[('New','New'),('Assigned','Assigned'),('In Progress','In Progress'),('Completed','Completed'),('QA Review','QA Review'),('Approved','Approved'),('Rejected','Rejected'),('Closed','Closed')]
 client=models.ForeignKey(Client,on_delete=models.CASCADE,related_name='work_orders'); property=models.ForeignKey(Property,on_delete=models.CASCADE,related_name='work_orders'); title=models.CharField(max_length=200); work_type=models.CharField(max_length=100,blank=True); assigned_to=models.CharField(max_length=150,blank=True); description=models.TextField(blank=True); priority=models.CharField(max_length=20,default='Medium'); status=models.CharField(max_length=30,choices=STATUS,default='New'); created_date=models.DateTimeField(auto_now_add=True); due_date=models.DateField(null=True,blank=True)
 def __str__(self): return f'{self.id} - {self.title}'
class Assignment(models.Model):
 work_order=models.ForeignKey(WorkOrder,on_delete=models.CASCADE,related_name='assignments'); vendor=models.ForeignKey(Vendor,on_delete=models.CASCADE,related_name='assignments'); assigned_date=models.DateTimeField(auto_now_add=True); status=models.CharField(max_length=50,default='Assigned')
 class Meta:
  constraints=[models.UniqueConstraint(fields=['work_order','vendor'],name='unique_work_order_vendor_assignment')]
class Document(models.Model):
 work_order=models.ForeignKey(WorkOrder,on_delete=models.CASCADE,related_name='documents'); file_name=models.CharField(max_length=255); file_type=models.CharField(max_length=80,blank=True); file_path=models.FileField(upload_to='work_orders/',blank=True,null=True); upload_date=models.DateTimeField(auto_now_add=True)
class QAReview(models.Model):
 work_order=models.ForeignKey(WorkOrder,on_delete=models.CASCADE,related_name='qa_reviews'); reviewer=models.ForeignKey(User,on_delete=models.SET_NULL,null=True,related_name='qa_reviews'); review_date=models.DateTimeField(auto_now_add=True); status=models.CharField(max_length=30,default='Pending'); comments=models.TextField(blank=True)
class Notification(models.Model):
 user=models.ForeignKey(User,on_delete=models.CASCADE,related_name='notifications'); work_order=models.ForeignKey(WorkOrder,on_delete=models.CASCADE,related_name='notifications',null=True,blank=True); message=models.TextField(); sent_date=models.DateTimeField(auto_now_add=True); is_read=models.BooleanField(default=False)
class Report(models.Model):
 report_type=models.CharField(max_length=100); generated_by=models.ForeignKey(User,on_delete=models.SET_NULL,null=True,related_name='reports'); generated_date=models.DateTimeField(auto_now_add=True); file_path=models.CharField(max_length=500,blank=True)
