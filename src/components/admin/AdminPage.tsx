import { useState, useEffect } from "react";
import { 
  ALLOWED_ADMIN_EMAIL, 
  DEFAULT_STARTUPS,
  type ProjectItem, 
  type StartupItem,
  type AuthSession,
  fetchSession,
  signInWithGoogle,
  signOutAdmin,
  fetchAdminProjects,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  fetchAdminStartups,
  updateAdminStartup
} from "../../lib/api";
import { 
  Shield, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  ArrowLeft, 
  ExternalLink, 
  Layers, 
  Briefcase, 
  Eye,
  EyeOff,
  RefreshCw,
  Info
} from "lucide-react";

export default function AdminPage() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Active Tab: 'projects' | 'startups'
  const [activeTab, setActiveTab] = useState<"projects" | "startups">("projects");

  // Projects state
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [editingProject, setEditingProject] = useState<Partial<ProjectItem> | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // Startups state
  const [startups, setStartups] = useState<StartupItem[]>(DEFAULT_STARTUPS);
  const [savingStartupId, setSavingStartupId] = useState<string | null>(null);

  // Ensure native mouse cursor is active in the administrative portal
  useEffect(() => {
    document.body.classList.add("admin-mode");
    return () => {
      document.body.classList.remove("admin-mode");
    };
  }, []);

  // 1. Check Session & Handle OAuth Callbacks on Mount
  useEffect(() => {
    // Check if redirected with an Auth.js error
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get("error");
    if (errorParam === "AccessDenied" || errorParam === "OAuthSignin") {
      setErrorMessage(
        "Server Authorization Rejection: Only the authorized administrator account is permitted to access administrative data. Sign-in with any other account is rejected at the server level."
      );
    }

    const checkAuth = async () => {
      setSessionLoading(true);
      try {
        const activeSession = await fetchSession();
        if (activeSession?.user?.email) {
          if (activeSession.user.email.toLowerCase() === ALLOWED_ADMIN_EMAIL.toLowerCase()) {
            setSession(activeSession);
            await loadAdminData();
          } else {
            // Non-admin session detected
            setErrorMessage("Access denied: You are not authorized to access this administration portal.");
            await signOutAdmin();
          }
        }
      } catch (err) {
        console.warn("Session check error:", err);
      } finally {
        setSessionLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [projs, starts] = await Promise.all([
        fetchAdminProjects().catch((err) => {
          console.warn("Admin projects fetch warning:", err);
          return [];
        }),
        fetchAdminStartups().catch((err) => {
          console.warn("Admin startups fetch warning:", err);
          return DEFAULT_STARTUPS;
        }),
      ]);

      setProjects(projs);
      if (starts && starts.length > 0) {
        setStartups(starts);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load administrative data.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 2. Project Management Actions
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    if (!editingProject.title?.trim() || !editingProject.description?.trim()) {
      setErrorMessage("Project Title and Description are required.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: editingProject.title.trim(),
        description: editingProject.description.trim(),
        category: editingProject.category?.trim() || "Dev",
        link: editingProject.link?.trim() || undefined,
        logo_url: editingProject.logo_url?.trim() || undefined,
        logo_type: editingProject.logo_type || "vector",
        display_order: Number(editingProject.display_order ?? 0),
        is_published: Boolean(editingProject.is_published),
      };

      if (editingProject.id) {
        const updated = await updateAdminProject({ ...payload, id: editingProject.id });
        setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        setSuccessMessage(`Project "${payload.title}" updated successfully.`);
      } else {
        const created = await createAdminProject(payload);
        setProjects((prev) => [...prev, created]);
        setSuccessMessage(`Project "${payload.title}" created successfully.`);
      }

      setIsProjectModalOpen(false);
      setEditingProject(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save project.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (project: ProjectItem) => {
    setLoading(true);
    try {
      const updatedStatus = !project.is_published;
      const updated = await updateAdminProject({ id: project.id, is_published: updatedStatus });
      setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      setSuccessMessage(`Project "${project.title}" is now ${updatedStatus ? "Published" : "Draft"}.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update project status.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (project: ProjectItem) => {
    if (!window.confirm(`Are you sure you want to delete project "${project.title}"?`)) return;

    setLoading(true);
    try {
      await deleteAdminProject(project.id);
      setProjects((prev) => prev.filter((p) => p.id !== project.id));
      setSuccessMessage(`Project "${project.title}" deleted.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete project.";
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // 3. Startup Management Actions
  const handleSaveStartup = async (startup: StartupItem) => {
    setSavingStartupId(startup.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updated = await updateAdminStartup(startup);
      setStartups((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      setSuccessMessage(`Startup "${startup.name}" saved successfully.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save startup changes.";
      setErrorMessage(msg);
    } finally {
      setSavingStartupId(null);
    }
  };

  const handleStartupFieldChange = (id: string, field: keyof StartupItem, val: string) => {
    setStartups((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  // =========================================================================
  // VIEW: AUTHENTICATION FORM (Google Sign-In with Auth.js)
  // =========================================================================
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest text-white/50 admin-mode">
        Verifying Administrative Session...
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-4 md:p-8 font-sans admin-mode">
        <div className="max-w-md w-full glass-dark rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shadow-xl">
              <Shield size={32} />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight text-white">
              Private Admin Portal
            </h1>
            <p className="text-gray-400 text-xs">
              Google Sign-in powered by Auth.js. Server-enforced authorization.
            </p>
          </div>

          {/* Feedback Messages */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs leading-relaxed flex items-start gap-3">
              <XCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs leading-relaxed flex items-start gap-3">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Google Sign-in Action */}
          <div className="space-y-4">
            <button
              onClick={() => signInWithGoogle("/admin")}
              className="w-full py-4 px-6 rounded-2xl bg-white text-black font-black uppercase tracking-[0.15em] text-xs shadow-xl hover:bg-gray-100 active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer group"
            >
              {/* Google Brand SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-[11px] text-gray-400">
              <div className="flex items-center gap-2 text-white font-bold">
                <Info size={14} className="text-orange-400" />
                <span>Security Notice</span>
              </div>
              <p>
                Only the verified administrator account is authorized to sign in. Authentication and access restrictions are strictly enforced on the server for all routes and mutations.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors font-bold uppercase tracking-wider"
            >
              <ArrowLeft size={14} /> Back to Public Portfolio
            </a>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW: AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans p-4 md:p-8 admin-mode">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Navbar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-dark p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Shield size={24} />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
                Portfolio Admin{" "}
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Verified Google Session
                </span>
              </h1>
              <p className="text-gray-400 text-xs font-mono">
                {session?.user?.name ? `Logged in as ${session.user.name}` : "Administrator Session Active"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              className="px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <span>View Site</span>
              <ExternalLink size={14} />
            </a>
            <button
              onClick={() => signOutAdmin()}
              className="px-5 py-2.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-widest hover:bg-red-500/20 transition-all flex items-center gap-2"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Global Notifications */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <XCircle size={16} />
              <span>{errorMessage}</span>
            </div>
            <button onClick={() => setErrorMessage(null)} className="text-red-400 hover:text-white">✕</button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successMessage}</span>
            </div>
            <button onClick={() => setSuccessMessage(null)} className="text-emerald-300 hover:text-white">✕</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
              activeTab === "projects"
                ? "bg-white text-black shadow-lg"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Layers size={16} />
            <span>Projects ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("startups")}
            className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
              activeTab === "startups"
                ? "bg-white text-black shadow-lg"
                : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <Briefcase size={16} />
            <span>Startups (2)</span>
          </button>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: PROJECTS MANAGEMENT */}
        {/* =================================================================== */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-white">
                  Manage Projects
                </h2>
                <p className="text-gray-400 text-xs">
                  Published projects replace the looping Under Construction animation on your public site.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loadAdminData}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  title="Refresh Data"
                >
                  <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
                </button>
                <button
                  onClick={() => {
                    setEditingProject({
                      title: "",
                      description: "",
                      category: "Dev",
                      link: "",
                      logo_url: "",
                      display_order: projects.length,
                      is_published: true,
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-black text-xs uppercase tracking-widest hover:bg-orange-600 transition-all flex items-center gap-2 shadow-xl shadow-orange-500/20"
                >
                  <Plus size={16} />
                  <span>Add New Project</span>
                </button>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="glass-dark rounded-3xl p-12 text-center border border-white/5 space-y-4">
                <p className="text-gray-400 text-sm">
                  Zero projects in database. The public portfolio is currently showing the looping <strong>Under Construction</strong> state.
                </p>
                <button
                  onClick={() => {
                    setEditingProject({
                      title: "",
                      description: "",
                      category: "Dev",
                      link: "",
                      logo_url: "",
                      display_order: 0,
                      is_published: true,
                    });
                    setIsProjectModalOpen(true);
                  }}
                  className="px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
                >
                  + Add First Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="glass-dark rounded-3xl p-6 border border-white/5 relative group hover:border-white/15 transition-all space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-[9px] font-black uppercase tracking-wider text-gray-300">
                            {proj.category}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                              proj.is_published
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}
                          >
                            {proj.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight text-white">
                          {proj.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleTogglePublish(proj)}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title={proj.is_published ? "Unpublish (Make Draft)" : "Publish Project"}
                        >
                          {proj.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingProject(proj);
                            setIsProjectModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Edit Project"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(proj)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-400 text-xs line-clamp-2 leading-relaxed">
                      {proj.description}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-gray-500 pt-3 border-t border-white/5">
                      <span>Order: #{proj.display_order}</span>
                      {proj.link && (
                        <a
                          href={proj.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:underline flex items-center gap-1"
                        >
                          <span>{proj.link.substring(0, 30)}...</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: STARTUPS MANAGEMENT */}
        {/* =================================================================== */}
        {activeTab === "startups" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-white">
                Manage Startups
              </h2>
              <p className="text-gray-400 text-xs">
                Edit names, links, accent colours, descriptions, metrics, and microhighlights for Virtual Valley and TipFlow.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {startups.map((startup) => (
                <div
                  key={startup.id}
                  className="glass-dark rounded-3xl p-6 md:p-8 border border-white/10 space-y-6 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-400">
                      ID: {startup.id}
                    </span>
                    <button
                      onClick={() => handleSaveStartup(startup)}
                      disabled={savingStartupId === startup.id}
                      className="px-5 py-2 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all disabled:opacity-50"
                    >
                      {savingStartupId === startup.id ? "Saving..." : "Save Changes"}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Name & Status */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                          Startup Name
                        </label>
                        <input
                          type="text"
                          value={startup.name}
                          onChange={(e) => handleStartupFieldChange(startup.id, "name", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                          Status Microhighlight
                        </label>
                        <input
                          type="text"
                          value={startup.status}
                          onChange={(e) => handleStartupFieldChange(startup.id, "status", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                        />
                      </div>
                    </div>

                    {/* Link & Accent Color */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                          Website Link
                        </label>
                        <input
                          type="url"
                          value={startup.link}
                          onChange={(e) => handleStartupFieldChange(startup.id, "link", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 font-mono text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                          Accent Colour
                        </label>
                        <select
                          value={startup.accent_color}
                          onChange={(e) => handleStartupFieldChange(startup.id, "accent_color", e.target.value)}
                          className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                        >
                          <option value="monochrome">Monochrome / Silver</option>
                          <option value="orange">Orange Accent</option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                        Description
                      </label>
                      <textarea
                        value={startup.description}
                        onChange={(e) => handleStartupFieldChange(startup.id, "description", e.target.value)}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50 leading-relaxed"
                      />
                    </div>

                    {/* Metric 1 & Metric 2 */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Metric 1 Label</label>
                        <input
                          type="text"
                          value={startup.view1_name}
                          onChange={(e) => handleStartupFieldChange(startup.id, "view1_name", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Metric 1 Value</label>
                        <input
                          type="text"
                          value={startup.view1_value}
                          onChange={(e) => handleStartupFieldChange(startup.id, "view1_value", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Metric 2 Label</label>
                        <input
                          type="text"
                          value={startup.view2_name}
                          onChange={(e) => handleStartupFieldChange(startup.id, "view2_name", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-black uppercase tracking-widest text-gray-500">Metric 2 Value</label>
                        <input
                          type="text"
                          value={startup.view2_value}
                          onChange={(e) => handleStartupFieldChange(startup.id, "view2_value", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white"
                        />
                      </div>
                    </div>

                    {/* Button Text */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                        Button Label
                      </label>
                      <input
                        type="text"
                        value={startup.button_text}
                        onChange={(e) => handleStartupFieldChange(startup.id, "button_text", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* MODAL: ADD / EDIT PROJECT */}
        {/* =================================================================== */}
        {isProjectModalOpen && editingProject && (
          <div className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="max-w-xl w-full glass-dark rounded-3xl p-6 md:p-8 border border-white/15 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-black uppercase tracking-tight text-white">
                  {editingProject.id ? "Edit Project" : "Add New Project"}
                </h3>
                <button
                  onClick={() => {
                    setIsProjectModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="text-gray-400 hover:text-white p-1"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    placeholder="e.g. TipFlow Assistant"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Category *</label>
                    <select
                      value={editingProject.category || "Dev"}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                    >
                      <option value="Dev">Dev / Web</option>
                      <option value="AI">AI & Automation</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                      <option value="Design">UI/UX Design</option>
                      <option value="Apps">Applications & Software</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Display Order</label>
                    <input
                      type="number"
                      value={editingProject.display_order ?? 0}
                      onChange={(e) => setEditingProject({ ...editingProject, display_order: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={editingProject.description || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    placeholder="Brief description of the project, architecture and impact..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-orange-500/50 leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Project Link (Optional)</label>
                  <input
                    type="url"
                    value={editingProject.link || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                    placeholder="https://github.com/... or https://..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 font-mono text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Logo Asset URL (Optional)</label>
                  <input
                    type="url"
                    value={editingProject.logo_url || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, logo_url: e.target.value })}
                    placeholder="https://... (leave blank to use animated category vector graphic)"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50 font-mono text-xs"
                  />
                  <p className="text-[10px] text-gray-500">
                    If omitted, an animated themed category vector graphic will be displayed.
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProject.is_published)}
                      onChange={(e) => setEditingProject({ ...editingProject, is_published: e.target.checked })}
                      className="w-4 h-4 rounded accent-orange-500"
                    />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Publish Immediately</span>
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProjectModalOpen(false);
                        setEditingProject(null);
                      }}
                      className="px-4 py-2 rounded-xl bg-white/5 text-gray-400 text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-600 text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-98 transition-all disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Project"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
