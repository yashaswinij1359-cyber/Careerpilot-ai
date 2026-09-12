import React, { useEffect, useState } from "react";

import {
  Activity,
  Bot,
  CheckCircle,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  Rocket,
  Send,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  User,
  Zap,
  ArrowLeft,
  Plus,
  ExternalLink
} from "lucide-react";

import {
  checkBackend,
  saveCareer,
  getCareer,
  getSkills,
  addSkill,
  deleteSkill,
  getProjects,
  addProject,
  deleteProject,
  getRoadmap,
  askCareerPilot,
  getInterviewFeedback
} from "./api";

function App() {
  const [page, setPage] = useState("Dashboard");

  const [online, setOnline] = useState(false);

  const [career, setCareer] = useState({
    goal: "",
    target_role: "AI / ML Engineer",
    role: "AI / ML Engineer",
    company: "",
    progress: 0
  });

  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [roadmap, setRoadmap] = useState([]);

  const [skill, setSkill] = useState("");

  const [question, setQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const [interviewAnswer, setInterviewAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);

  const [selectedProject, setSelectedProject] = useState(null);

  const [showProjectForm, setShowProjectForm] = useState(false);

  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    technology: "",
    status: "In Progress"
  });

  useEffect(() => {
    load();
  }, []);

  // =====================================================
  // LOAD DATA
  // =====================================================

  async function load() {
    try {
      const health = await checkBackend();

      setOnline(health?.status === "online");
    } catch (error) {
      console.error("Backend health error:", error);
      setOnline(false);
    }

    try {
      const careerData = await getCareer();

      const careerValue =
        careerData?.career || careerData;

      if (careerValue) {
        setCareer({
          goal: careerValue.goal || "",
          target_role:
            careerValue.target_role ||
            careerValue.role ||
            "AI / ML Engineer",
          role:
            careerValue.role ||
            careerValue.target_role ||
            "AI / ML Engineer",
          company: careerValue.company || "",
          progress:
            Number(careerValue.progress) || 0
        });
      }
    } catch (error) {
      console.error("Career loading error:", error);
    }

    try {
      const skillsData = await getSkills();

      const skillsValue =
        skillsData?.skills || skillsData;

      if (Array.isArray(skillsValue)) {
        setSkills(skillsValue);
      }
    } catch (error) {
      console.error("Skills loading error:", error);
    }

    try {
      const projectsData = await getProjects();

      const projectsValue =
        projectsData?.projects || projectsData;

      if (Array.isArray(projectsValue)) {
        setProjects(projectsValue);
      }
    } catch (error) {
      console.error("Projects loading error:", error);
    }

    try {
      const roadmapData = await getRoadmap();

      const roadmapValue =
        roadmapData?.roadmap || roadmapData;

      if (Array.isArray(roadmapValue)) {
        setRoadmap(roadmapValue);
      }
    } catch (error) {
      console.error("Roadmap loading error:", error);
    }
  }

  // =====================================================
  // NAVIGATION
  // =====================================================

  function navigate(targetPage) {
    setSelectedProject(null);
    setShowProjectForm(false);
    setPage(targetPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // =====================================================
  // CAREER
  // =====================================================

  async function handleCareer(e) {
    e.preventDefault();

    try {
      await saveCareer({
        goal: career.goal,
        target_role:
          career.target_role ||
          career.role,
        role:
          career.role ||
          career.target_role,
        company: career.company,
        progress: career.progress
      });

      alert("Career goal saved successfully!");

      await load();
    } catch (error) {
      alert(
        error.message ||
          "Unable to save career goal."
      );
    }
  }

  // =====================================================
  // SKILLS
  // =====================================================

  async function handleSkill() {
    if (!skill.trim()) return;

    try {
      await addSkill({
        name: skill.trim(),
        level: "Beginner",
        progress: 20
      });

      setSkill("");

      await load();
    } catch (error) {
      alert(
        error.message ||
          "Unable to add skill."
      );
    }
  }

  async function removeSkill(id) {
    try {
      await deleteSkill(id);

      await load();
    } catch (error) {
      alert(
        error.message ||
          "Unable to delete skill."
      );
    }
  }

  // =====================================================
  // PROJECTS
  // =====================================================

  async function handleProject() {
    if (!projectForm.name.trim()) {
      alert("Please enter a project name.");
      return;
    }

    try {
      await addProject({
        name: projectForm.name.trim(),
        description:
          projectForm.description.trim(),
        technology:
          projectForm.technology.trim(),
        status: projectForm.status
      });

      setProjectForm({
        name: "",
        description: "",
        technology: "",
        status: "In Progress"
      });

      setShowProjectForm(false);

      await load();

      alert("Project added successfully!");
    } catch (error) {
      alert(
        error.message ||
          "Unable to add project."
      );
    }
  }

  async function removeProject(id) {
    try {
      await deleteProject(id);

      setSelectedProject(null);

      await load();
    } catch (error) {
      alert(
        error.message ||
          "Unable to delete project."
      );
    }
  }

  // =====================================================
  // AI COACH
  // =====================================================

  async function askAI() {
    if (!question.trim()) return;

    setAiLoading(true);

    try {
      const result =
        await askCareerPilot(
          question.trim()
        );

      setAiAnswer(
        result?.answer ||
          "CareerPilot could not generate an answer."
      );

      setQuestion("");
    } catch (error) {
      console.error(error);

      setAiAnswer(
        "Unable to connect to CareerPilot AI. Please check your backend and Gemini API key."
      );
    } finally {
      setAiLoading(false);
    }
  }

  // =====================================================
  // INTERVIEW
  // =====================================================

  async function interview() {
    if (!interviewAnswer.trim()) return;

    try {
      const result =
        await getInterviewFeedback(
          "Tell me about yourself and your career goals.",
          interviewAnswer
        );

      setFeedback(result);
    } catch (error) {
      alert(
        error.message ||
          "Unable to get interview feedback."
      );
    }
  }

  // =====================================================
  // MENU
  // =====================================================

  const menu = [
    ["Dashboard", LayoutDashboard],
    ["Career", Target],
    ["Skills", Zap],
    ["Roadmap", TrendingUp],
    ["Projects", Rocket],
    ["Interview", MessageSquare],
    ["AI Coach", Bot]
  ];

  return (
    <div className="app">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            <Sparkles size={22} />
          </div>

          <div>
            <h2>CareerPilot</h2>
            <span>AI CAREER OS</span>
          </div>

        </div>

        <nav>

          {menu.map(([name, Icon]) => (
            <button
              key={name}
              onClick={() => navigate(name)}
              className={
                page === name
                  ? "nav active"
                  : "nav"
              }
            >
              <Icon size={18} />
              {name}
            </button>
          ))}

        </nav>

        <div className="sidebar-bottom">

          <div className="system">

            <span
              className={
                online
                  ? "dot online"
                  : "dot"
              }
            />

            <div>
              <b>AI System</b>

              <small>
                {online
                  ? "Online"
                  : "Offline"}
              </small>
            </div>

          </div>

          <div className="user">

            <User size={30} />

            <div>
              <b>Career Explorer</b>
              <small>Student</small>
            </div>

          </div>

        </div>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main>

        <header>

          <div>

            <span>CAREERPILOT AI</span>

            <h1>
              {selectedProject
                ? "Project Details"
                : page}
            </h1>

          </div>

          <div className="status">

            <Activity size={16} />

            {online
              ? "System Online"
              : "System Offline"}

          </div>

        </header>

        <div className="content">

          {/* =================================================
              DASHBOARD
          ================================================= */}

          {page === "Dashboard" && (
            <>
              <section className="hero">

                <div>

                  <label>
                    AI-POWERED CAREER GUIDANCE
                  </label>

                  <h2>
                    Build the career
                    <strong>
                      you actually want.
                    </strong>
                  </h2>

                  <p>
                    Turn your goals and skills
                    into a personalized career
                    strategy with CareerPilot AI.
                  </p>

                  <button
                    className="primary"
                    onClick={() =>
                      navigate("Career")
                    }
                  >
                    Start Your Journey
                    <Rocket size={17} />
                  </button>

                </div>

                <div className="hero-ai">
                  <Bot size={55} />
                  <span>AI</span>
                </div>

              </section>

              <div className="stats">

                <Stat
                  icon={<Target />}
                  title="Career Progress"
                  value={`${career.progress || 0}%`}
                />

                <Stat
                  icon={<Zap />}
                  title="Skills"
                  value={skills.length}
                />

                <Stat
                  icon={<Rocket />}
                  title="Projects"
                  value={projects.length}
                />

                <Stat
                  icon={<GraduationCap />}
                  title="Readiness"
                  value={
                    skills.length
                      ? "Growing"
                      : "Start"
                  }
                />

              </div>

              <div className="grid">

                <div className="card">

                  <label>
                    CURRENT TARGET
                  </label>

                  <h3>
                    {career.role ||
                      career.target_role ||
                      "Set your career target"}
                  </h3>

                  <div className="progress">

                    <div
                      style={{
                        width:
                          `${career.progress || 0}%`
                      }}
                    />

                  </div>

                  <small>
                    {career.progress || 0}%
                    complete
                  </small>

                  <button
                    className="secondary dashboard-button"
                    onClick={() =>
                      navigate("Career")
                    }
                  >
                    Edit Career Goal
                  </button>

                </div>

                <div className="card ai-card">

                  <Bot size={28} />

                  <label>
                    CAREERPILOT AI
                  </label>

                  <h3>
                    Your AI career coach
                  </h3>

                  <p>
                    Ask questions about skills,
                    jobs, interviews and roadmaps.
                  </p>

                  <button
                    className="secondary"
                    onClick={() =>
                      navigate("AI Coach")
                    }
                  >
                    Ask AI
                  </button>

                </div>

              </div>
            </>
          )}

          {/* =================================================
              CAREER
          ================================================= */}

          {page === "Career" && (
            <div className="card form-card">

              <label>
                CAREER GOAL
              </label>

              <h2>
                Define your destination
              </h2>

              <form onSubmit={handleCareer}>

                <textarea
                  value={career.goal || ""}
                  onChange={(e) =>
                    setCareer({
                      ...career,
                      goal: e.target.value
                    })
                  }
                  placeholder="Example: I want to become an AI/ML engineer..."
                />

                <input
                  value={
                    career.role ||
                    career.target_role ||
                    ""
                  }
                  onChange={(e) =>
                    setCareer({
                      ...career,
                      role: e.target.value,
                      target_role:
                        e.target.value
                    })
                  }
                  placeholder="Target role"
                />

                <input
                  value={career.company || ""}
                  onChange={(e) =>
                    setCareer({
                      ...career,
                      company:
                        e.target.value
                    })
                  }
                  placeholder="Target company"
                />

                <button
                  className="primary"
                  type="submit"
                >
                  Save Career Goal
                  <CheckCircle size={17} />
                </button>

              </form>

            </div>
          )}

          {/* =================================================
              SKILLS
          ================================================= */}

          {page === "Skills" && (
            <>
              <div className="page-title">

                <label>
                  SKILL TRACKER
                </label>

                <h2>
                  Build your skill stack
                </h2>

              </div>

              <div className="add">

                <input
                  value={skill}
                  onChange={(e) =>
                    setSkill(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSkill();
                    }
                  }}
                  placeholder="Enter a skill e.g. Python"
                />

                <button
                  className="primary"
                  onClick={handleSkill}
                >
                  <Plus size={17} />
                  Add Skill
                </button>

              </div>

              <div className="skill-grid">

                {skills.map((item, index) => (
                  <div
                    className="skill"
                    key={
                      item.id ||
                      `${item.name}-${index}`
                    }
                  >

                    <div className="skill-icon">
                      <Zap size={18} />
                    </div>

                    <h3>
                      {item.name}
                    </h3>

                    <small>
                      {item.level ||
                        "Beginner"}
                    </small>

                    <div className="progress">

                      <div
                        style={{
                          width:
                            `${item.progress || 20}%`
                        }}
                      />

                    </div>

                    {item.id && (
                      <button
                        className="delete"
                        onClick={() =>
                          removeSkill(item.id)
                        }
                        title="Delete skill"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}

                  </div>
                ))}

                {!skills.length && (
                  <div className="empty">

                    <Zap size={30} />

                    <h3>
                      No skills yet
                    </h3>

                    <p>
                      Add your first skill above.
                    </p>

                  </div>
                )}

              </div>
            </>
          )}

          {/* =================================================
              ROADMAP
          ================================================= */}

          {page === "Roadmap" && (
            <div>

              <div className="page-title">

                <label>
                  CAREER ROADMAP
                </label>

                <h2>
                  Your path to success
                </h2>

              </div>

              <div className="roadmap">

                {roadmap.length > 0 ? (
                  roadmap.map((item, index) => (
                    <Road
                      key={
                        item.id ||
                        index
                      }
                      number={String(
                        index + 1
                      ).padStart(2, "0")}
                      title={
                        item.title ||
                        `Roadmap Step ${index + 1}`
                      }
                      text={
                        item.description ||
                        item.text ||
                        item.status ||
                        "Career development step."
                      }
                    />
                  ))
                ) : (
                  <>
                    <Road
                      number="01"
                      title="Master the fundamentals"
                      text="Learn programming, problem solving and core computer science."
                    />

                    <Road
                      number="02"
                      title="Build technical skills"
                      text="Develop skills relevant to your chosen career."
                    />

                    <Road
                      number="03"
                      title="Build real projects"
                      text="Create portfolio projects that demonstrate your abilities."
                    />

                    <Road
                      number="04"
                      title="Prepare for interviews"
                      text="Practice technical and behavioral interview questions."
                    />

                    <Road
                      number="05"
                      title="Apply for opportunities"
                      text="Start applying for internships and jobs."
                    />
                  </>
                )}

              </div>

            </div>
          )}

          {/* =================================================
              PROJECTS
          ================================================= */}

          {page === "Projects" &&
            !selectedProject && (
              <div>

                <div className="project-header">

                  <div className="page-title">

                    <label>
                      PROJECT LAB
                    </label>

                    <h2>
                      Build your portfolio
                    </h2>

                    <p>
                      Create and explore projects
                      that strengthen your career profile.
                    </p>

                  </div>

                  <button
                    className="primary"
                    onClick={() =>
                      setShowProjectForm(
                        !showProjectForm
                      )
                    }
                  >
                    <Plus size={17} />
                    Add Project
                  </button>

                </div>

                {showProjectForm && (
                  <div className="card project-form">

                    <h3>
                      Add Your Project
                    </h3>

                    <input
                      value={
                        projectForm.name
                      }
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          name: e.target.value
                        })
                      }
                      placeholder="Project name"
                    />

                    <textarea
                      value={
                        projectForm.description
                      }
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          description:
                            e.target.value
                        })
                      }
                      placeholder="Project description"
                    />

                    <input
                      value={
                        projectForm.technology
                      }
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          technology:
                            e.target.value
                        })
                      }
                      placeholder="Technologies e.g. React, Python, FastAPI"
                    />

                    <select
                      value={
                        projectForm.status
                      }
                      onChange={(e) =>
                        setProjectForm({
                          ...projectForm,
                          status:
                            e.target.value
                        })
                      }
                    >
                      <option>
                        In Progress
                      </option>

                      <option>
                        Completed
                      </option>

                      <option>
                        Planned
                      </option>
                    </select>

                    <div className="form-actions">

                      <button
                        className="secondary"
                        onClick={() =>
                          setShowProjectForm(false)
                        }
                      >
                        Cancel
                      </button>

                      <button
                        className="primary"
                        onClick={handleProject}
                      >
                        Save Project
                      </button>

                    </div>

                  </div>
                )}

                <div className="project-grid">

                  <Project
                    title="AI Career Assistant"
                    text="Build an AI chatbot that provides personalized career guidance."
                    technology="React • FastAPI • Gemini"
                    onExplore={() =>
                      setSelectedProject({
                        id: "default-1",
                        name:
                          "AI Career Assistant",
                        description:
                          "An AI-powered career assistant that helps students choose careers, identify important skills and create personalized learning plans.",
                        technology:
                          "React • FastAPI • Google Gemini",
                        status:
                          "Recommended"
                      })
                    }
                  />

                  <Project
                    title="Resume Analyzer"
                    text="Create an AI system that analyzes resumes and suggests improvements."
                    technology="Python • AI • NLP"
                    onExplore={() =>
                      setSelectedProject({
                        id: "default-2",
                        name:
                          "Resume Analyzer",
                        description:
                          "Analyze resumes, identify missing skills and provide practical suggestions to improve a candidate profile.",
                        technology:
                          "Python • NLP • Gemini",
                        status:
                          "Recommended"
                      })
                    }
                  />

                  <Project
                    title="Skill Gap Analyzer"
                    text="Compare current skills with the skills required for a target role."
                    technology="React • Python • AI"
                    onExplore={() =>
                      setSelectedProject({
                        id: "default-3",
                        name:
                          "Skill Gap Analyzer",
                        description:
                          "Compare your existing skills with the skills required for a selected career and create a personalized improvement plan.",
                        technology:
                          "React • FastAPI • AI",
                        status:
                          "Recommended"
                      })
                    }
                  />

                  <Project
                    title="Interview Coach"
                    text="Build an AI-powered interview practice platform."
                    technology="React • Gemini"
                    onExplore={() =>
                      setSelectedProject({
                        id: "default-4",
                        name:
                          "Interview Coach",
                        description:
                          "Practice technical and behavioral interview questions and receive AI-powered feedback.",
                        technology:
                          "React • FastAPI • Google Gemini",
                        status:
                          "Recommended"
                      })
                    }
                  />

                  {projects.map(
                    (project) => (
                      <Project
                        key={project.id}
                        title={
                          project.name
                        }
                        text={
                          project.description ||
                          "Your personal career project."
                        }
                        technology={
                          project.technology ||
                          "Technology not specified"
                        }
                        userProject
                        onExplore={() =>
                          setSelectedProject({
                            ...project,
                            userProject: true
                          })
                        }
                        onDelete={() =>
                          removeProject(
                            project.id
                          )
                        }
                      />
                    )
                  )}

                </div>

              </div>
            )}

          {/* =================================================
              PROJECT DETAILS
          ================================================= */}

          {page === "Projects" &&
            selectedProject && (
              <div className="project-detail">

                <button
                  className="back-button"
                  onClick={() =>
                    setSelectedProject(null)
                  }
                >
                  <ArrowLeft size={17} />
                  Back to Projects
                </button>

                <div className="card project-detail-card">

                  <div className="detail-icon">
                    <Rocket size={35} />
                  </div>

                  <label>
                    PROJECT DETAILS
                  </label>

                  <h2>
                    {selectedProject.name ||
                      selectedProject.title}
                  </h2>

                  <p className="detail-description">
                    {selectedProject.description ||
                      selectedProject.text}
                  </p>

                  <div className="detail-grid">

                    <div>
                      <small>
                        TECHNOLOGY
                      </small>

                      <strong>
                        {selectedProject.technology ||
                          "Not specified"}
                      </strong>
                    </div>

                    <div>
                      <small>
                        STATUS
                      </small>

                      <strong>
                        {selectedProject.status ||
                          "In Progress"}
                      </strong>
                    </div>

                  </div>

                  <div className="detail-actions">

                    <button
                      className="primary"
                      onClick={() => {
                        setQuestion(
                          `How can I build the ${selectedProject.name || selectedProject.title} project?`
                        );
                        setPage("AI Coach");
                        setSelectedProject(null);
                      }}
                    >
                      Ask AI About This Project
                      <Bot size={17} />
                    </button>

                    {selectedProject.userProject && (
                      <button
                        className="danger-button"
                        onClick={() =>
                          removeProject(
                            selectedProject.id
                          )
                        }
                      >
                        <Trash2 size={16} />
                        Delete Project
                      </button>
                    )}

                  </div>

                </div>

              </div>
            )}

          {/* =================================================
              INTERVIEW
          ================================================= */}

          {page === "Interview" && (
            <div className="card interview">

              <label>
                AI INTERVIEW PRACTICE
              </label>

              <h2>
                Tell me about yourself.
              </h2>

              <textarea
                value={interviewAnswer}
                onChange={(e) =>
                  setInterviewAnswer(
                    e.target.value
                  )
                }
                placeholder="Write your interview answer..."
              />

              <button
                className="primary"
                onClick={interview}
              >
                Get Feedback
                <MessageSquare size={17} />
              </button>

              {feedback && (
                <div className="feedback">

                  <div className="score">
                    {feedback.score ||
                      "AI"}
                  </div>

                  <div>

                    <label>
                      AI FEEDBACK
                    </label>

                    <p>
                      {feedback.feedback ||
                        feedback.answer ||
                        "Feedback received."}
                    </p>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* =================================================
              AI COACH
          ================================================= */}

          {page === "AI Coach" && (
            <div className="ai-page">

              <div className="ai-heading">

                <div className="big-ai">
                  <Bot size={35} />
                </div>

                <label>
                  CAREERPILOT INTELLIGENCE
                </label>

                <h2>
                  Your AI career coach.
                </h2>

                <p>
                  Ask me anything about your
                  career journey.
                </p>

              </div>

              <div className="chat">

                <div className="answer">

                  <Bot size={20} />

                  <div>

                    <b>
                      CareerPilot AI
                    </b>

                    <p>
                      {aiAnswer ||
                        "Hi! I'm CareerPilot AI. How can I help with your career?"}
                    </p>

                  </div>

                </div>

                <div className="chat-input">

                  <input
                    value={question}
                    onChange={(e) =>
                      setQuestion(
                        e.target.value
                      )
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.shiftKey
                      ) {
                        e.preventDefault();
                        askAI();
                      }
                    }}
                    placeholder="Ask about careers, skills, projects..."
                  />

                  <button
                    onClick={askAI}
                    disabled={aiLoading}
                  >
                    {aiLoading
                      ? "..."
                      : <Send size={18} />}
                  </button>

                </div>

              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}


// =====================================================
// STAT COMPONENT
// =====================================================

function Stat({
  icon,
  title,
  value
}) {
  return (
    <div className="stat">

      <div className="stat-icon">
        {icon}
      </div>

      <div>

        <small>
          {title}
        </small>

        <strong>
          {value}
        </strong>

      </div>

    </div>
  );
}


// =====================================================
// ROADMAP COMPONENT
// =====================================================

function Road({
  number,
  title,
  text
}) {
  return (
    <div className="road">

      <div className="road-number">
        {number}
      </div>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
}


// =====================================================
// PROJECT COMPONENT
// =====================================================

function Project({
  title,
  text,
  technology,
  onExplore,
  onDelete,
  userProject
}) {
  return (
    <div className="project">

      <div className="project-icon">
        <Rocket size={20} />
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

      {technology && (
        <small className="project-tech">
          {technology}
        </small>
      )}

      <div className="project-actions">

        <button
          className="secondary"
          onClick={onExplore}
        >
          Explore
          <ExternalLink size={14} />
        </button>

        {userProject &&
          onDelete && (
            <button
              className="delete-project"
              onClick={onDelete}
              title="Delete project"
            >
              <Trash2 size={15} />
            </button>
          )}

      </div>

    </div>
  );
}


export default App;