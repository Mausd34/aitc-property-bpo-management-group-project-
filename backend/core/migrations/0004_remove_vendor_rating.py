from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0003_workorder_fields'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='vendor',
            name='rating',
        ),
    ]