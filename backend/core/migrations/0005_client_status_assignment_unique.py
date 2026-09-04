from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0004_remove_vendor_rating'),
    ]

    operations = [
        migrations.AddField(
            model_name='client',
            name='status',
            field=models.CharField(default='Active', max_length=50),
        ),
        migrations.AddConstraint(
            model_name='assignment',
            constraint=models.UniqueConstraint(fields=('work_order', 'vendor'), name='unique_work_order_vendor_assignment'),
        ),
    ]