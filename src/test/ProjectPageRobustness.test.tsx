import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ProjectPage from '../components/ProjectPage';

// Helper to create a mock response
const createMockResponse = (data: unknown, ok = true, status = 200) => ({
  ok,
  status,
  json: () => Promise.resolve(data),
});

describe('ProjectPage Component Robustness', () => {
  const onBackMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Stub IntersectionObserver as it's not in JSDOM
    vi.stubGlobal('IntersectionObserver', class {
      observe = vi.fn();
      disconnect = vi.fn();
      unobserve = vi.fn();
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('renders loading state correctly and then displays projects', async () => {
    const mockData = [
      { title: 'Project 1', description: 'Desc 1', category: 'Coding', image: 'img1.jpg', video: 'vid1' },
      { title: 'Project 2', description: 'Desc 2', category: 'Design', image: 'img2.jpg', video: 'vid2' }
    ];

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createMockResponse(mockData)));

    render(<ProjectPage onBack={onBackMock} />);

    // Verify loading skeletons are present
    expect(document.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0);

    // Wait for projects to load
    await waitFor(() => {
      expect(screen.getByText('Project 1')).toBeInTheDocument();
      expect(screen.getByText('Project 2')).toBeInTheDocument();
    });

    // Check category filter buttons (using getAllByText because 'Coding' appears in filter button, select option, and card tag)
    expect(screen.getAllByText('Coding').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Design').length).toBeGreaterThan(0);
  });

  it('handles fetch errors gracefully and shows error message', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createMockResponse(null, false, 500)));

    render(<ProjectPage onBack={onBackMock} />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch projects/i)).toBeInTheDocument();
    });

    // Verify "Try Again" button exists
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });

  it('filters projects by search query', async () => {
    const mockData = [
      { title: 'Unique App', description: 'Desc 1', category: 'Coding', image: 'img1.jpg', video: 'vid1' },
      { title: 'Other Tool', description: 'Desc 2', category: 'Design', image: 'img2.jpg', video: 'vid2' }
    ];

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createMockResponse(mockData)));

    render(<ProjectPage onBack={onBackMock} />);

    await waitFor(() => {
      expect(screen.getByText('Unique App')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Search projects/i);
    fireEvent.change(searchInput, { target: { value: 'Unique' } });

    expect(screen.getByText('Unique App')).toBeInTheDocument();
    expect(screen.queryByText('Other Tool')).not.toBeInTheDocument();
  });

  it('handles category filtering', async () => {
    const mockData = [
      { title: 'Coding Project', description: 'Desc 1', category: 'Coding', image: 'img1.jpg', video: 'vid1' },
      { title: 'Design Project', description: 'Desc 2', category: 'Design', image: 'img2.jpg', video: 'vid2' }
    ];

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(createMockResponse(mockData)));

    render(<ProjectPage onBack={onBackMock} />);

    await waitFor(() => {
      expect(screen.getByText('Coding Project')).toBeInTheDocument();
    });

    // Find and click Design filter button
    const designButton = screen.getByRole('button', { name: 'Design' });
    fireEvent.click(designButton);

    expect(screen.getByText('Design Project')).toBeInTheDocument();
    expect(screen.queryByText('Coding Project')).not.toBeInTheDocument();
  });
});
