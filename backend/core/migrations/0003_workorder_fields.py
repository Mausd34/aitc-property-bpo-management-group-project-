from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0002_property_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='workorder',
            name='assigned_to',
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AddField(
            model_name='workorder',
            name='work_type',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]