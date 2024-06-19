FROM python:3.10-slim-bullseye
WORKDIR /app
COPY requirements.txt .
COPY app.py .
COPY dynamicModel.keras .
RUN pip install -r requirements.txt

EXPOSE 8501
CMD ["python3", "app.py"]