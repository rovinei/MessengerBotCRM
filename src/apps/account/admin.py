from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import ReadOnlyPasswordHashField
from django.utils.translation import ugettext_lazy as _
from src.apps.account.models import User, UserInfo
from src.apps.account.forms.register import RegistrationForm


class UserChangeForm(forms.ModelForm):
	"""A form for updating users. Includes all the fields on
    the user, but replaces the password field with admin's
    password hash display field.
    """
	password = ReadOnlyPasswordHashField()
	
	class Meta:
		model = User
		fields = (
			'username',
			'email',
			'is_verified',
			'password',
			'is_admin',
			'is_active'
		)
	
	def clean_password(self):
		"""
        Regardless of what the user provides, return the initial value.
        This is done here, rather than on the field, because the
        field does not have access to the initial value
        """
		return self.initial["password"]


class UserAdmin(BaseUserAdmin):

	# The forms to add and change user instances
	form = UserChangeForm
	add_form = RegistrationForm
	
	"""
    The fields to be used in displaying the User model.
    These override the definitions on the base UserAdmin
    that reference specific fields on auth.User.
    """
	list_display = ('username', 'email', 'is_admin')
	list_filter = ('is_admin', 'username', 'email')
	fieldsets = (
		(_('Personal info'), {'fields': ('username',)}),
		(_('Contact info'), {'fields': ('email',)}),
		(_('Permission'), {'fields': ('is_admin',)}),
		(_('Account status'), {'fields': ('is_active', 'is_verified',)}),
		(_('Security'), {'fields': ('password',)})
	)
	
	add_fieldsets = (
		(_('Personal info'), {'classes': 'wide', 'fields': ('username',)}),
		(_('Contact info'), {'classes': 'wide', 'fields': ('email',)}),
		(_('Permission'), {'classes': 'wide', 'fields': ('is_admin',)}),
		(_('Account status'), {'classes': 'wide', 'fields': ('is_active', 'is_verified',)}),
		(_('Security'), {'fields': ('password1', 'password2',)}),
	)
	ordering = ('username', 'joined')
	empty_value_display = '-empty-'


class UserInfoAdmin(admin.ModelAdmin):
	list_display = ('get_full_name', 'person',)
	ordering = ('firstname', 'lastname',)


admin.site.register(UserInfo, UserInfoAdmin)
admin.site.register(User, UserAdmin)
admin.site.unregister(Group)
