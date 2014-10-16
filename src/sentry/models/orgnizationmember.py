"""
sentry.models.organizationmember
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

:copyright: (c) 2010-2014 by the Sentry Team, see AUTHORS for more details.
:license: BSD, see LICENSE for more details.
"""
from __future__ import absolute_import, print_function

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _

from sentry.db.models import Model, BoundedPositiveIntegerField, BaseManager, sane_repr


# TODO(dcramer): pull in enum library
class OrganizationMemberType(object):
    ADMIN = 0
    MEMBER = 50
    BOT = 100


class OrganizationMember(Model):
    """
    Identifies relationships between teams and users.

    Users listed as team members are considered to have access to all projects
    and could be thought of as team owners (though their access level may not)
    be set to ownership.
    """
    organization = models.ForeignKey('sentry.Organization', related_name="member_set")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="sentry_orgmember_set")
    type = BoundedPositiveIntegerField(choices=(
        (OrganizationMemberType.MEMBER, _('Member')),
        (OrganizationMemberType.ADMIN, _('Admin')),
        (OrganizationMemberType.BOT, _('Bot')),
    ), default=OrganizationMemberType.MEMBER)
    date_added = models.DateTimeField(default=timezone.now)

    objects = BaseManager()

    class Meta:
        app_label = 'sentry'
        db_table = 'sentry_organizationmember'
        unique_together = (('organization', 'user'),)

    __repr__ = sane_repr('organization_id', 'user_id', 'type')
