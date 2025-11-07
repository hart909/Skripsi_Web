FROM python:3.10

WORKDIR /app

COPY backend/requirements.txt /app/

RUN pip install --no-cache-dir -r requirements.txt

COPY backend /app/

ENV PYTHONUNBUFFERED=1

CMD ["gunicorn", "webskripsi.wsgi:application", "--chdir", "skripsi"]
