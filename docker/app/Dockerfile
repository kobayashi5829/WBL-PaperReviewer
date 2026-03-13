FROM python:3.13

COPY requirements.txt .
RUN pip install -r requirements.txt

CMD ["sh", "-c", "python /app/manage.py makemigrations && python /app/manage.py migrate && python /app/manage.py runserver 0.0.0.0:8000"]