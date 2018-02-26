from __future__ import unicode_literals
from django.apps import AppConfig
from django.db.models.signals import post_save
from django.utils.translation import ugettext_lazy as _
from src.apps.account.models import User


class AccountConfig(AppConfig):
	name = 'account'
	verbose_name = _('account')

