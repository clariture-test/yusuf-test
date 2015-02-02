from django.conf.urls import patterns, include, url
from django.contrib import admin

from survey.views import SurveyView


admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'clariture.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', SurveyView.as_view(), name='survey-index'),
)
