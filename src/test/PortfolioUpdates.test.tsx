import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import StartupsSection from "../components/StartupsSection";
import Projects from "../components/Projects";
import Navbar from "../components/Navbar";
import { ALLOWED_ADMIN_EMAIL, DEFAULT_STARTUPS, fetchSession } from "../lib/api";
import * as loadingContext from "../lib/LoadingContext";
import { projectsData, TOTAL_PROJECTS_COUNT } from "../data/projects";

// Stub IntersectionObserver & matchMedia for jsdom
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
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
});

describe("1. Startups Section Target Requirements", () => {
  it("renders only Virtual Valley and TipFlow with verified links and status microhighlights", () => {
    render(<StartupsSection />);

    // Check Virtual Valley
    expect(screen.getByText("Virtual Valley")).toBeInTheDocument();
    expect(screen.getByText("Established")).toBeInTheDocument();
    const vvLink = screen.getByRole("link", { name: /Visit Virtual Valley/i });
    expect(vvLink).toHaveAttribute("href", "https://virtual-valley.vercel.app");

    // Check TipFlow
    expect(screen.getByText("TipFlow")).toBeInTheDocument();
    expect(screen.getByText("Under Establishment")).toBeInTheDocument();
    const tipflowLink = screen.getByRole("link", { name: /Visit TipFlow/i });
    expect(tipflowLink).toHaveAttribute("href", "https://tipflowapp.vercel.app");

    // Ensure removed obsolete startups are not present
    expect(screen.queryByText("Buggy But Brilliant")).not.toBeInTheDocument();
    expect(screen.queryByText("AbSa Studio")).not.toBeInTheDocument();
    expect(screen.queryByText("AbSa Digitals")).not.toBeInTheDocument();
    expect(screen.queryByText("AbSa Wearables")).not.toBeInTheDocument();
  });

  it("DEFAULT_STARTUPS contains only the 2 target startups", () => {
    expect(DEFAULT_STARTUPS).toHaveLength(2);
    expect(DEFAULT_STARTUPS[0].name).toBe("Virtual Valley");
    expect(DEFAULT_STARTUPS[0].status).toBe("Established");
    expect(DEFAULT_STARTUPS[0].link).toBe("https://virtual-valley.vercel.app");

    expect(DEFAULT_STARTUPS[1].name).toBe("TipFlow");
    expect(DEFAULT_STARTUPS[1].status).toBe("Under Establishment");
    expect(DEFAULT_STARTUPS[1].link).toBe("https://tipflowapp.vercel.app");
  });
});

describe("2. Project Explorer & 47 Projects Data Integrity", () => {
  it("contains exactly 47 unique projects in the dataset", () => {
    expect(TOTAL_PROJECTS_COUNT).toBe(47);
    expect(projectsData).toHaveLength(47);

    const ids = new Set(projectsData.map((p) => p.id));
    expect(ids.size).toBe(47);

    const slugs = new Set(projectsData.map((p) => p.slug));
    expect(slugs.size).toBe(47);

    // Verify video/photo editing standalone projects have been completely eliminated
    expect(ids.has("personal-photo-portrait-editing")).toBe(false);
    expect(ids.has("brill-chocolate-ad")).toBe(false);
    expect(ids.has("brill-hotel-story")).toBe(false);
  });

  it("prioritizes exactly 10 featured projects", () => {
    const featuredProjects = projectsData.filter((p) => p.featured);
    expect(featuredProjects).toHaveLength(10);

    const featuredSlugs = featuredProjects.map((p) => p.slug);
    expect(featuredSlugs).toContain("tipflow");
    expect(featuredSlugs).toContain("glo-desktop-companion");
    expect(featuredSlugs).toContain("fast-facial-attendance-system");
    expect(featuredSlugs).toContain("parakotha");
    expect(featuredSlugs).toContain("hotel-simvo-website");
    expect(featuredSlugs).toContain("snapodr");
    expect(featuredSlugs).toContain("virtual-valley");
    expect(featuredSlugs).toContain("abhirup-personal-portfolio");
    expect(featuredSlugs).toContain("network-device-management-poc");
    expect(featuredSlugs).toContain("omnidimension-calling-automation");
  });

  it("renders the new Project Explorer with correct heading, subtitle, and live count", () => {
    const onProjectClick = vi.fn();
    render(<Projects onProjectClick={onProjectClick} />);

    expect(screen.getByText("SELECTED WORK & EXPERIMENTS")).toBeInTheDocument();
    expect(
      screen.getByText(/From intelligent desktop applications and computer vision/i)
    ).toBeInTheDocument();

    // Verify old Under Construction state is completely removed
    expect(screen.queryByText("Projects Are Taking Shape")).not.toBeInTheDocument();
    expect(screen.queryByText("In Active Development")).not.toBeInTheDocument();
  });

  it("filters projects by search query in the Project Explorer", () => {
    const onProjectClick = vi.fn();
    render(<Projects onProjectClick={onProjectClick} initialCategory="All" />);

    const searchInput = screen.getByPlaceholderText(/Search by project name/i);
    fireEvent.change(searchInput, { target: { value: "MediaPipe" } });

    // TipFlow uses MediaPipe and should be displayed
    expect(screen.getByText("TipFlow")).toBeInTheDocument();

    // Unrelated project should not be visible
    expect(screen.queryByText("Hotel Simvo Website")).not.toBeInTheDocument();
  });

  it("filters projects by category", () => {
    const onProjectClick = vi.fn();
    render(<Projects onProjectClick={onProjectClick} initialCategory="All" />);

    // Click Cybersecurity & Networking category button
    const cyberButton = screen.getByRole("button", { name: "Cybersecurity & Networking" });
    fireEvent.click(cyberButton);

    expect(screen.getByText("Network Device Management PoC")).toBeInTheDocument();
    expect(screen.queryByText("Hotel Simvo Website")).not.toBeInTheDocument();
  });
});

describe("3. Admin Authentication & Authorization Layer", () => {
  it("enforces abhirupsarkar2jp@gmail.com as the only allowed administrator", () => {
    expect(ALLOWED_ADMIN_EMAIL).toBe("abhirupsarkar2jp@gmail.com");
  });

  it("rejects unauthorized access when session is empty or unauthenticated", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({ error: "Unauthorized" }),
      })
    );

    const session = await fetchSession();
    expect(session).toBeNull();
  });
});

describe("4. Navbar Updates", () => {
  it("displays Abhirup Sarkar as the portfolio owner name", () => {
    vi.spyOn(loadingContext, "useLoading").mockReturnValue({
      state: "complete",
      setState: vi.fn(),
    });

    render(<Navbar />);

    const ownerNameMatches = screen.getAllByText(/ABHIRUP SARKAR/i);
    expect(ownerNameMatches.length).toBeGreaterThan(0);
    expect(screen.getByText("Virtual Valley →")).toBeInTheDocument();
  });
});
