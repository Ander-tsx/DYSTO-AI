from django.contrib import admin

from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 0
    readonly_fields = ('subtotal_display',)

    def subtotal_display(self, obj):
        """Muestra el subtotal calculado del item."""
        return f'${obj.subtotal}'
    subtotal_display.short_description = 'Subtotal'


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at', 'updated_at')
    search_fields = ('user__email',)
    inlines = [CartItemInline]


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('cart', 'product', 'quantity', 'subtotal_display')
    list_filter = ('cart',)
    search_fields = ('product__title', 'cart__user__email')

    def subtotal_display(self, obj):
        """Muestra el subtotal calculado del item."""
        return f'${obj.subtotal}'
    subtotal_display.short_description = 'Subtotal'
