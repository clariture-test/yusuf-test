from django.db import models

class Question(models.Model):
    desc = models.CharField(max_length=255)

    def __unicode__(self):
        return self.desc


class Answer(models.Model):
    desc = models.CharField(max_length=255)
    no_time = models.IntegerField(default=0)
    question = models.ForeignKey(Question, db_index=True)
