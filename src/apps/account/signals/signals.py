from django.db.models.signals import post_save
from src.apps.account.models import User, UserInfo
from django.dispatch import receiver


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	if created:
		print('Creating user profile')
		UserInfo.objects.get_or_create(person=instance)
	else:
		print('Not creating user profile')

