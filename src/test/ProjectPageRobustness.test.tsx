import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import ProjectDetail from "../components/ProjectDetail";
import ProjectPage from "../components/ProjectPage";
import { projectsData } from "../data/projects";

describe("ProjectPage and ProjectDetail Robustness", () => {
  const onBackMock = vi.fn();
  const onSelectMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe = vi.fn();
        disconnect = vi.fn();
        unobserve = vi.fn();
      }
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders project detail information accurately without crashing", () => {
    const tipflow = projectsData.find((p) => p.slug === "tipflow")!;
    expect(tipflow).toBeDefined();

    render(
      <ProjectDetail
        project={tipflow}
        onBack={onBackMock}
        onSelectProject={onSelectMock}
      />
    );

    // Verify Title, Category, and Overview
    expect(screen.getByRole("heading", { name: "TipFlow", level: 1 })).toBeInTheDocument();
    expect(screen.getAllByText("Applications & Software").length).toBeGreaterThan(0);
    expect(screen.getByText("Project Overview")).toBeInTheDocument();

    // Verify Implemented Features are shown
    expect(screen.getByText("Key Features")).toBeInTheDocument();
    expect(
      screen.getByText(/Real-time webcam hand tracking and landmark extraction/i)
    ).toBeInTheDocument();

    // Verify verified external links are rendered
    const liveLink = screen.getByRole("link", { name: /Visit Live Website/i });
    expect(liveLink).toHaveAttribute("href", "https://tipflowapp.vercel.app/");

    // Verify unverified GitHub link is NOT rendered
    expect(screen.queryByRole("link", { name: /View Repository/i })).not.toBeInTheDocument();
  });

  it("omits live website and repository buttons when no verified links exist", () => {
    // F.A.S.T. prototype has no public URL
    const fastProject = projectsData.find(
      (p) => p.slug === "fast-facial-attendance-system"
    )!;
    expect(fastProject).toBeDefined();

    render(
      <ProjectDetail
        project={fastProject}
        onBack={onBackMock}
        onSelectProject={onSelectMock}
      />
    );

    expect(screen.getByRole("heading", { name: "F.A.S.T. — Facial Attendance System", level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Visit Live Website/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /View Repository/i })).not.toBeInTheDocument();
  });

  it("triggers back navigation on clicking the back button", () => {
    const project = projectsData[0];
    render(
      <ProjectDetail
        project={project}
        onBack={onBackMock}
        onSelectProject={onSelectMock}
      />
    );

    const backButton = screen.getByRole("button", { name: /Back to projects/i });
    fireEvent.click(backButton);

    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  it("renders all 47 projects cleanly through ProjectPage wrapper without runtime exceptions", () => {
    projectsData.forEach((proj) => {
      const { unmount } = render(
        <ProjectPage project={proj} onBack={onBackMock} />
      );
      expect(screen.getByRole("heading", { name: proj.title, level: 1 })).toBeInTheDocument();
      unmount();
    });
  });
});
