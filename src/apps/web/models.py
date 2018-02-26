from django.db import models
from src.apps.account.models import User

FIELD_TYPE = (
        ('textarea', 'Textarea'),
        ('text', 'Text'),
        ('email', 'Email'),
        ('password', 'Password'),
        ('richtext', 'Richtext Box'),
        ('radio', 'Radio'),
        ('checkbox', 'Checkbox'),
        ('select', 'Dropdown select')
    )


class PromotionField(models.Model):
    """
    Fields for promotional record
    """
    filed_name = models.SlugField(max_length=60, blank=False, null=False, unique=True)
    label = models.CharField(max_length=250, blank=False, null=False)
    placeholder = models.CharField(max_length=500, default='')
    type = models.CharField(max_length=20, choices=FIELD_TYPE)
    meta_options = models.TextField(default='{}')
    order = models.IntegerField(unique=True)
    is_enabled = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)


class Promotion(models.Model):
    """
    promotions data which business owner create for marketing promotional.
    """
    owner = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=500, blank=False, null=False)
    display_name = models.CharField(max_length=500, blank=False, null=False)
    is_enabled = models.BooleanField(default=True)
    is_valid = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)


class PromotionInfo(models.Model):
    """
    Promotional information related to promotion and which field
    """
    promotion = models.ForeignKey(Promotion, on_delete=models.CASCADE)
    field = models.ForeignKey(PromotionField, on_delete=models.CASCADE)
    value = models.TextField(default='')
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=False, auto_now=True)
