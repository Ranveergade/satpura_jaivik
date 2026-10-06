from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.authentication.urls')),
    path('api/users/', include('apps.users.urls')),
    path('api/farmers/', include('apps.farmers.urls')),
    path('api/projects/', include('apps.projects.urls')),
    path('api/expenses/', include('apps.expenses.urls')),
    path('api/work-logs/', include('apps.work_logs.urls')),
    path('api/media/', include('apps.media.urls')),
    path('api/cctv/', include('apps.cctv.urls')),
    path('api/iot/', include('apps.iot.urls')),
    path('api/chat/', include('apps.chat.urls')),
    path('api/notifications/', include('apps.notifications.urls')),
    path('api/audit/', include('apps.audit.urls')),
]
