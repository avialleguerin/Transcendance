from django.http import HttpResponse

def auth(request):
	return HttpResponse("<h1>Bonjour</h1>")