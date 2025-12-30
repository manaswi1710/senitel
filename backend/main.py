from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# Import the routes we defined in the API folder
from api.routes import router as api_router

app = FastAPI(title="Sentinel Security API")
origins = [
    "http://localhost:5174",  # your frontend origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Connect the API routes to the main app
app.include_router(api_router)

@app.get("/")
def home():
    return {"status": "Sentinel Core is Online 🛡️"}