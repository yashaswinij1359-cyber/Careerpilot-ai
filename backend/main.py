import os
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai

from database import init_db


# =====================================================
# ENVIRONMENT
# =====================================================

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")


# =====================================================
# GEMINI
# =====================================================

client = None

if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)


# =====================================================
# FASTAPI
# =====================================================

app = FastAPI(
    title="CareerPilot AI",
    description="AI-powered career guidance platform",
    version="1.0.0"
)


# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",

        # Your Vercel frontend
        "https://careerpilot-green.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =====================================================
# DATABASE
# =====================================================

@app.on_event("startup")
def startup():
    try:
        init_db()
        print("Database initialized successfully")
    except Exception as error:
        print("Database initialization warning:", error)


# =====================================================
# TEMPORARY DATA STORAGE
# =====================================================
# These allow the frontend routes to work immediately.
# They can later be connected permanently to your database.


career_data = {
    "target_role": "AI / ML Engineer",
    "goal": "Become an AI / ML Engineer",
    "progress": 0
}


skills_data = [
    {
        "id": 1,
        "name": "Python",
        "level": "Intermediate"
    },
    {
        "id": 2,
        "name": "C",
        "level": "Beginner"
    },
    {
        "id": 3,
        "name": "SQL",
        "level": "Beginner"
    },
    {
        "id": 4,
        "name": "Git",
        "level": "Beginner"
    },
    {
        "id": 5,
        "name": "React",
        "level": "Beginner"
    }
]


projects_data = []


# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():
    return {
        "message": "CareerPilot AI Backend is Running",
        "status": "online",
        "provider": "Google Gemini"
    }


# =====================================================
# HEALTH
# =====================================================

@app.get("/api/health")
def health():
    return {
        "status": "online",
        "gemini": client is not None,
        "provider": "Google Gemini"
    }


# =====================================================
# CAREER MODELS
# =====================================================

class CareerData(BaseModel):
    target_role: Optional[str] = None
    goal: Optional[str] = None
    progress: Optional[int] = 0


# =====================================================
# GET CAREER
# =====================================================

@app.get("/api/career")
def get_career():
    return {
        "success": True,
        "career": career_data
    }


# =====================================================
# SAVE CAREER
# =====================================================

@app.post("/api/career")
def save_career(data: CareerData):

    if data.target_role is not None:
        career_data["target_role"] = data.target_role

    if data.goal is not None:
        career_data["goal"] = data.goal

    if data.progress is not None:
        career_data["progress"] = data.progress

    return {
        "success": True,
        "message": "Career information saved",
        "career": career_data
    }


# =====================================================
# SKILLS
# =====================================================

@app.get("/api/skills")
def get_skills():
    return {
        "success": True,
        "skills": skills_data
    }


class SkillData(BaseModel):
    name: str
    level: Optional[str] = "Beginner"


@app.post("/api/skills")
def add_skill(data: SkillData):

    new_id = (
        max([skill["id"] for skill in skills_data], default=0)
        + 1
    )

    new_skill = {
        "id": new_id,
        "name": data.name,
        "level": data.level
    }

    skills_data.append(new_skill)

    return {
        "success": True,
        "message": "Skill added successfully",
        "skill": new_skill,
        "skills": skills_data
    }


@app.delete("/api/skills/{skill_id}")
def delete_skill(skill_id: int):

    global skills_data

    original_length = len(skills_data)

    skills_data = [
        skill
        for skill in skills_data
        if skill["id"] != skill_id
    ]

    if len(skills_data) == original_length:
        return {
            "success": False,
            "message": "Skill not found"
        }

    return {
        "success": True,
        "message": "Skill deleted successfully",
        "skills": skills_data
    }


# =====================================================
# PROJECTS
# =====================================================

class ProjectData(BaseModel):
    name: str
    description: Optional[str] = ""
    technology: Optional[str] = ""
    status: Optional[str] = "In Progress"


@app.get("/api/projects")
def get_projects():
    return {
        "success": True,
        "projects": projects_data
    }


@app.post("/api/projects")
def add_project(data: ProjectData):

    new_id = (
        max([project["id"] for project in projects_data], default=0)
        + 1
    )

    new_project = {
        "id": new_id,
        "name": data.name,
        "description": data.description,
        "technology": data.technology,
        "status": data.status
    }

    projects_data.append(new_project)

    return {
        "success": True,
        "message": "Project added successfully",
        "project": new_project,
        "projects": projects_data
    }


@app.delete("/api/projects/{project_id}")
def delete_project(project_id: int):

    global projects_data

    original_length = len(projects_data)

    projects_data = [
        project
        for project in projects_data
        if project["id"] != project_id
    ]

    if len(projects_data) == original_length:
        return {
            "success": False,
            "message": "Project not found"
        }

    return {
        "success": True,
        "message": "Project deleted successfully",
        "projects": projects_data
    }


# =====================================================
# ROADMAP
# =====================================================

@app.get("/api/roadmap")
def get_roadmap():

    return {
        "success": True,
        "roadmap": [
            {
                "id": 1,
                "title": "Python Fundamentals",
                "status": "Completed"
            },
            {
                "id": 2,
                "title": "Data Structures and Algorithms",
                "status": "In Progress"
            },
            {
                "id": 3,
                "title": "Machine Learning",
                "status": "Upcoming"
            },
            {
                "id": 4,
                "title": "Deep Learning",
                "status": "Upcoming"
            },
            {
                "id": 5,
                "title": "AI Projects",
                "status": "Upcoming"
            }
        ]
    }


# =====================================================
# CAREER ANALYSIS
# =====================================================

class CareerAnalysisRequest(BaseModel):
    target_role: str
    skills: list[str] = []


@app.post("/api/career/analyze")
def analyze_career(data: CareerAnalysisRequest):

    skills_text = ", ".join(data.skills)

    if client is None:
        return {
            "success": False,
            "message": "Gemini API key is missing.",
            "analysis": "Please configure GEMINI_API_KEY on the backend."
        }

    prompt = f"""
You are CareerPilot AI.

Analyze this student's career profile.

Target role:
{data.target_role}

Current skills:
{skills_text}

Give:

1. Career readiness
2. Matching skills
3. Missing skills
4. Recommended technologies
5. Recommended projects
6. Learning roadmap
7. Internship preparation

Keep the answer simple and practical for an engineering student.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return {
            "success": True,
            "analysis": response.text
        }

    except Exception as error:

        print("Career analysis error:", error)

        return {
            "success": False,
            "analysis": "Unable to generate career analysis right now."
        }


# =====================================================
# AI REQUEST
# =====================================================

class AIRequest(BaseModel):
    message: str


@app.post("/api/ai")
def career_ai(request: AIRequest):

    if not request.message.strip():
        return {
            "success": False,
            "answer": "Please enter your question."
        }

    if client is None:
        return {
            "success": False,
            "answer": "Gemini API key is missing on the backend."
        }

    prompt = f"""
You are CareerPilot AI, an intelligent career coach.

Help students with:

- Career selection
- Career planning
- Skill development
- Skill-gap analysis
- Learning roadmaps
- Projects
- Resume preparation
- Interview preparation
- Internship preparation
- Job preparation
- AI and Machine Learning
- Software Engineering
- Data Science
- Cloud Computing
- Cybersecurity
- Web Development

Give simple, practical and beginner-friendly answers.

Use bullet points and step-by-step explanations when useful.

User question:

{request.message}
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return {
            "success": True,
            "answer": response.text
        }

    except Exception as error:

        print("Gemini Error:", error)

        return {
            "success": False,
            "answer": "Gemini could not process your request."
        }


# =====================================================
# INTERVIEW
# =====================================================

class InterviewRequest(BaseModel):
    question: str
    answer: str


@app.post("/api/interview")
def interview_feedback(data: InterviewRequest):

    if client is None:
        return {
            "success": False,
            "feedback": "Gemini API key is missing."
        }

    prompt = f"""
You are an AI interview coach.

Interview question:
{data.question}

Student answer:
{data.answer}

Evaluate the answer.

Give:

1. Score out of 10
2. What was good
3. What needs improvement
4. Better answer
5. Interview tip

Keep it beginner-friendly.
"""

    try:

        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt
        )

        return {
            "success": True,
            "feedback": response.text
        }

    except Exception as error:

        print("Interview Error:", error)

        return {
            "success": False,
            "feedback": "Unable to generate interview feedback."
        }