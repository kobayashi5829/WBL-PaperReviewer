FROM python:3.13

COPY requirements.txt .
RUN pip install -r requirements.txt

CMD ["python", "/app/manage.py", "runserver", "0.0.0.0:8000"]