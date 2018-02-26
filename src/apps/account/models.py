from __future__ import unicode_literals
import uuid
import string
import random
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.dispatch import receiver
from django.db.models.signals import post_save
from datetime import datetime

today = datetime.today()


def random_string(length, chars=string.ascii_uppercase + string.ascii_lowercase + string.digits):
	return ''.join(random.choice(chars) for x in range(length))


def handle_upload_profile(instance, filename):
	filename_string = random_string(30, string.ascii_lowercase + string.digits) + ".png"
	return "{}/{}/{}/{}".format(instance.id, 'profile', today.strftime('%Y/%m/%d'),
	                            str(instance.uuid) + filename_string)


def handle_upload_cover(instance, filename):
	filename_string = random_string(30, string.ascii_lowercase + string.digits) + ".png"
	return "{}/{}/{}/{}".format(instance.id, 'backgroundcover', today.strftime('%Y/%m/%d'),
	                            str(instance.uuid) + filename_string)


Gender = (
	('M', 'Male'),
	('F', 'Female'),
	('Other', 'Other'),
)


class AccountUserManager(BaseUserManager):
	def create_user(self, username, password=None, **kwargs):
		if not username:
			raise ValueError('User must have a username')
		user = self.model(
			username=username,
			**kwargs
		)
		user.set_password(password)
		user.save(using=self._db)
		return user
	
	def create_superuser(self, username, password, **kwargs):
		user = self.create_user(username, password=password, **kwargs)
		user.is_admin = True
		user.save(using=self._db)
		return user


class User(AbstractBaseUser, PermissionsMixin):
	"""
    Custom user model
    """
	uuid = models.UUIDField(default=uuid.uuid4, editable=False)
	username = models.CharField(max_length=100, blank=False, null=False, unique=True, db_index=True)
	email = models.EmailField(max_length=150, unique=True, blank=True, null=True)
	joined = models.DateTimeField(auto_now_add=True, auto_now=False)
	updated = models.DateTimeField(auto_now_add=False, auto_now=True)
	is_active = models.BooleanField(default=True)
	is_verified = models.BooleanField(default=False)
	is_admin = models.BooleanField(default=False)
	objects = AccountUserManager()
	
	USERNAME_FIELD = 'username'
	
	def __unicode__(self):
		return self.username
	
	def __str__(self):
		return self.username
	
	def get_profile_pic(self):
		if self.profilepic and hasattr(self.profilepic, 'url'):
			return self.profilepic.url
		else:
			return '/images/default_user_profile.png'
	
	def get_timeline_url(self):
		return '/account/user/{}/profile'.format(self.id)
	
	def get_short_name(self):
		return self.username
	
	# @property
	# def is_superuser(self):
	# return self.is_admin
	
	@property
	def is_staff(self):
		return self.is_admin
	
	@property
	def is_superadmin(self):
		return self.is_admin
	
	def has_perm(self, perm, obj=None):
		return self.is_admin
	
	def has_module_perms(self, app_label):
		return self.is_admin


class UserInfo(models.Model):
	"""
    User detail information profile
    """
	person = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
	firstname = models.CharField(max_length=50, default='')
	lastname = models.CharField(max_length=50, default='')
	address = models.CharField(max_length=200, default='')
	country = models.CharField(max_length=200, default='')
	country_code = models.CharField(max_length=5, blank=True, null=True)
	phonenumber = models.IntegerField(blank=True, null=True)
	profilepic = models.ImageField(upload_to=handle_upload_profile, default='/images/default_user_profile.png')
	gender = models.CharField(max_length=6, choices=Gender, default='Other')
	auth_data = models.TextField(default='{}')
	is_authorized_app = models.BooleanField(default=False)
	
	def __unicode__(self):
		return self.firstname + self.lastname
	
	def __str__(self):
		return self.firstname + self.lastname
	
	def get_full_name(self):
		return str(self.firstname + self.lastname)
	
	
@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
	if created:
		print('Creating user profile')
		UserInfo.objects.get_or_create(person=instance)
	else:
		print('Not creating user profile')
