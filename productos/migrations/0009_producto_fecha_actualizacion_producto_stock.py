# Generated by Django 5.2.1 on 2025-06-12 17:08

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('productos', '0008_remove_producto_stock_pedido_detallepedido'),
    ]

    operations = [
        migrations.AddField(
            model_name='producto',
            name='fecha_actualizacion',
            field=models.DateTimeField(auto_now=True),
        ),
        migrations.AddField(
            model_name='producto',
            name='stock',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
