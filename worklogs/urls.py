
from django.urls import path
from . import views

urlpatterns = [
    path("", views.daily_work_log_list_create, name="work-log-list-create"),
    path("<int:log_id>/", views.daily_work_log_detail, name="work-log-detail"),

    path(
        "attendance/",
        views.labour_attendance_list_create,
        name="labour-attendance-list-create",
    ),
    path(
        "attendance/<int:attendance_id>/",
        views.labour_attendance_detail,
        name="labour-attendance-detail",
    ),
    path(
        "workers/",
        views.WorkerListCreateView.as_view(),
        name="worker-list-create",
            ),
    path(
        "workers/<int:pk>/",
        views.WorkerDetailView.as_view(),
        name="worker-detail",   
            ),

    path(
        "assignments/",
        views.ProjectWorkerAssignmentListCreateView.as_view(),
        name="worker-assignment-list-create",
        ),
    path(
        "assignments/<int:pk>/",
        views.ProjectWorkerAssignmentDetailView.as_view(),
        name="worker-assignment-detail",
        ),
    path(
        "projects/labour-summary/",
        views.ProjectLabourSummaryView.as_view(),
        name="project-labour-summary",
            ),

]
