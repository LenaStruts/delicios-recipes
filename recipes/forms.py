from django import forms
from django.forms import ModelForm
from django.forms import inlineformset_factory
from .models import Recipe, Ingredients, Instructions
from django.forms.widgets import TextInput
from django.utils.dateparse import parse_duration

class DurationInput(TextInput):

    def _format_value(self, value):
        duration = parse_duration(value)

        seconds = duration.seconds

        minutes = seconds // 60
        seconds = seconds % 60

        minutes = minutes % 60
        hours = minutes // 60
        hours = hours % 60

        return '{:02d}:{:02d}:{:02d}'.format(hours,minutes,seconds)

class RecipeForm(ModelForm):

    class Meta:
        model = Recipe
        exclude = ('author',)
        widgets = {
            'time': DurationInput(attrs={'placeholder': 'HH:MM:SS'})
        }


class IngredientForm(ModelForm):
    class Meta:
        model = Ingredients
        fields = '__all__'


class InstructionForm(ModelForm):

    class Meta:
        model = Instructions
        fields = '__all__'
        widgets = {
            'time': DurationInput(attrs={'placeholder': 'HH:MM:SS'})
        }
        

IngredientFormSet = inlineformset_factory(Recipe, Ingredients, form=IngredientForm, extra=1)
InstructionFormSet = inlineformset_factory(Recipe, Instructions, form=InstructionForm, extra=1)
