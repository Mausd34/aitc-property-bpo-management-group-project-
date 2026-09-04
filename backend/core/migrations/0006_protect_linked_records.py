from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0005_client_status_assignment_unique'),
    ]

    operations = [
        migrations.AlterField(
            model_name='property',
            name='client',
            field=models.ForeignKey(on_delete=models.PROTECT, related_name='properties', to='core.client'),
        ),
        migrations.AlterField(
            model_name='workorder',
            name='client',
            field=models.ForeignKey(on_delete=models.PROTECT, related_name='work_orders', to='core.client'),
        ),
        migrations.AlterField(
            model_name='workorder',
            name='property',
            field=models.ForeignKey(on_delete=models.PROTECT, related_name='work_orders', to='core.property'),
        ),
        migrations.AlterField(
            model_name='assignment',
            name='vendor',
            field=models.ForeignKey(on_delete=models.PROTECT, related_name='assignments', to='core.vendor'),
        ),
    ]
