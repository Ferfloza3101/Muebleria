# Generated by Django 5.2.1 on 2025-06-05 20:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0002_categoria_producto_categoria'),
    ]

    operations = [
        migrations.AddField(
            model_name='producto',
            name='imagen',
            field=models.ImageField(default='productos/default.jpg', upload_to='productos/'),
        ),
    ]
