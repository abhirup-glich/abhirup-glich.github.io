import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import StartupsSection from "../components/StartupsSection";
import Projects from "../components/Projects";
import Navbar from "../components/Navbar";
import { ALLOWED_ADMIN_EMAIL, DEFAULT_STARTUPS, fetchSession } from "../lib/api";
import * as loadingContext from "../lib/LoadingContext";

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

describe("2. Projects Section & Under Construction Loop", () => {
  it("renders the looping under construction state when there are zero published projects", async () => {
    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("PROJECTS")).toBeInTheDocument();
      expect(screen.getByText("Projects Are Taking Shape")).toBeInTheDocument();
      expect(screen.getByText(/Projects are taking shape\. Check back soon/i)).toBeInTheDocument();
      expect(screen.getByText("In Active Development")).toBeInTheDocument();
    });

    // Verify fake projects are not rendered
    expect(screen.queryByText("Photo Editing")).not.toBeInTheDocument();
    expect(screen.queryByText("Video Editing")).not.toBeInTheDocument();
  });
});

describe("3. Admin Authentication & Authorization Layer", () => {
  it("enforces abhirupsarkar2jp@gmail.com as the only allowed administrator", () => {
    expect(ALLOWED_ADMIN_EMAIL).toBe("abhirupsarkar2jp@gmail.com");
  });

  it("rejects unauthorized access when session is empty or unauthenticated", async () => {
    // Stub fetch to return 401 unauthorized session
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
    // Mock LoadingContext so Navbar is rendered (state === 'complete')
    vi.spyOn(loadingContext, "useLoading").mockReturnValue({
      state: "complete",
      setState: vi.fn(),
    });

    render(<Navbar />);

    // Navbar should have "ABHIRUP SARKAR."
    const ownerNameMatches = screen.getAllByText(/ABHIRUP SARKAR/i);
    expect(ownerNameMatches.length).toBeGreaterThan(0);

    // Verify rotating buttons match the two startups
    expect(screen.getByText("Virtual Valley →")).toBeInTheDocument();
  });
});
