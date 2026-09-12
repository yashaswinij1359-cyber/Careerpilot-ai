// ============================================================
// CAREERPILOT API
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://careerpilot-ai-41hl.onrender.com";


// ============================================================
// GENERIC REQUEST
// ============================================================

async function request(endpoint, options = {}) {

  try {

    const response = await fetch(
      `${API_URL}${endpoint}`,
      {
        ...options,

        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        }
      }
    );


    const text =
      await response.text();


    let data = {};

    try {
      data = text
        ? JSON.parse(text)
        : {};
    } catch {
      data = {
        message: text
      };
    }


    if (!response.ok) {

      throw new Error(
        `API Error ${response.status}: ${
          data.detail ||
          data.message ||
          text ||
          "Request failed"
        }`
      );

    }


    return data;

  } catch (error) {

    console.error(
      `Request failed: ${endpoint}`,
      error
    );

    throw error;

  }

}


// ============================================================
// HEALTH
// ============================================================

export async function checkBackend() {

  return request(
    "/api/health"
  );

}


// ============================================================
// CAREER
// ============================================================

export async function getCareer() {

  return request(
    "/api/career"
  );

}


export async function saveCareer(data) {

  return request(
    "/api/career",
    {
      method: "POST",

      body: JSON.stringify(data)
    }
  );

}


export async function analyzeCareer(
  target_role,
  skills
) {

  return request(
    "/api/career/analyze",
    {
      method: "POST",

      body: JSON.stringify({
        target_role,
        skills
      })
    }
  );

}


// ============================================================
// SKILLS
// ============================================================

export async function getSkills() {

  return request(
    "/api/skills"
  );

}


export async function addSkill(data) {

  return request(
    "/api/skills",
    {
      method: "POST",

      body: JSON.stringify(data)
    }
  );

}


export async function deleteSkill(id) {

  return request(
    `/api/skills/${id}`,
    {
      method: "DELETE"
    }
  );

}


// ============================================================
// PROJECTS
// ============================================================

export async function getProjects() {

  return request(
    "/api/projects"
  );

}


export async function addProject(data) {

  return request(
    "/api/projects",
    {
      method: "POST",

      body: JSON.stringify(data)
    }
  );

}


export async function deleteProject(id) {

  return request(
    `/api/projects/${id}`,
    {
      method: "DELETE"
    }
  );

}


// ============================================================
// ROADMAP
// ============================================================

export async function getRoadmap() {

  return request(
    "/api/roadmap"
  );

}


// ============================================================
// AI COACH
// ============================================================

export async function askCareerPilot(
  message
) {

  return request(
    "/api/ai",
    {
      method: "POST",

      body: JSON.stringify({
        message
      })
    }
  );

}


// ============================================================
// INTERVIEW
// ============================================================

export async function getInterviewFeedback(
  question,
  answer
) {

  return request(
    "/api/interview",
    {
      method: "POST",

      body: JSON.stringify({
        question,
        answer
      })
    }
  );

}


// ============================================================
// EXPORT API URL
// ============================================================

export {
  API_URL
};