from django.shortcuts import render_to_response
from django.template.context import RequestContext
from django.views.generic.base import View

from survey.models import Question, Answer


class SurveyView(View):
    template_name = 'index.html'

    def get(self, request, *args, **kwargs):
        context = self.get_context_data()
        return render_to_response(self.template_name, context, context_instance=RequestContext(request))

    def get_context_data(self, **kwargs):
        context = {}
        question = Question.objects.get(id=1)
        context['question'] = question
        answer_list = Answer.objects.filter(question=question)
        context['answer_list'] = answer_list
        return context

def post(self, request, *args, **kwargs):
        """
        If the form is valid, redirect to the supplied URL.
        """
        answer_id = self.request.POST.get('answer_id')
        answer = Answer.objects.get(id=answer_id)
        answer.no_time += 1;
        answer.save()
        return HttpResponseRedirect()


