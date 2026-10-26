
from django.urls import path
from . import views

urlpatterns = [
    path("", views.expense_list_create, name="expense-list-create"),
    path(
        "<int:expense_id>/review/",
        views.expense_review,
        name="expense-review",
    ),
]
