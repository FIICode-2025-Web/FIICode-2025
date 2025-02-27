# In order to run the backend:
- Add the .env file in every backend folder
- Create a .venv file in every backend and install the requirements.txt folder by running
  - python -m venv .venv
  - .venv\Scripts\activate
  - pip install -r .\requirements.txt 
- Run each service:
  -  AuthService: uvicorn main:app --host 127.0.0.1 --port 8000 --reload
  -  Authorities: uvicorn main:app --host 127.0.0.1 --port 8001 --reload
  -  Users: uvicorn main:app --host 127.0.0.1 --port 8002 --reload

