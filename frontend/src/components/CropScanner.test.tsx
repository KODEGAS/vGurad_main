import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CropScanner } from './CropScanner';
import { TranslationProvider, useTranslation } from '@/contexts/TranslationContext';

// Mocking the TranslationContext and its hook
vi.mock('@/contexts/TranslationContext', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    TranslationProvider: ({ children }: { children: React.ReactNode }) => (
      <TranslationProvider>{children}</TranslationProvider>
    ),
    useTranslation: () => ({
      t: (key: string) => key, // Simple mock for translation function
    }),
  };
});

// Mocking the sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockOnBack = vi.fn();

const renderWithProviders = (component: React.ReactElement) => {
  return render(<TranslationProvider>{component}</TranslationProvider>);
};

describe('CropScanner', () => {
  let fetchSpy: vi.SpyInstance;

  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();

    // Mock the global fetch API using vi.spyOn
    fetchSpy = vi.spyOn(global, 'fetch');

    // Mock the fetch implementation for each test
    fetchSpy.mockImplementation(async (url: string) => {
      if (url.includes('/predict')) {
        return {
          ok: true,
          json: async () => ({ predicted_class: 'Blight', confidence: 0.95 }),
        };
      } else if (url.includes('/disease-info/BLIGHT')) {
        return {
          ok: true,
          json: async () => ({
            info: {
              description: 'A common plant disease.',
              symptoms: ['Yellow spots', 'Wilting'],
              caused_by: 'Fungus',
              prevention: ['Use resistant varieties', 'Crop rotation'],
            },
          }),
        };
      } else if (url.includes('/disease-medicines?name=BLIGHT')) {
        return {
          ok: true,
          json: async () => ({
            recommended_medicines: [
              { name: 'Fungicide A', application_rate: '2ml/L', frequency: 'Weekly' },
            ],
          }),
        };
      } else if (url === 'https://placehold.co/600x400/8B4513/FFFFFF?text=Infected+Crop') {
        // Mocking the demo image fetch
        const blob = new Blob([''], { type: 'image/png' });
        return {
          ok: true,
          blob: async () => blob,
        };
      }
      return { ok: false, json: async () => ({}) };
    });
  });

  afterEach(() => {
    // Restore the original fetch implementation after each test
    fetchSpy.mockRestore();
  });

  it('renders correctly with upload section visible', () => {
    renderWithProviders(<CropScanner onBack={mockOnBack} />);
    expect(screen.getByText('uploadImage')).toBeInTheDocument();
    expect(screen.getByText('analysisResults')).toBeInTheDocument();
    expect(screen.queryByText('analyzing')).not.toBeInTheDocument();
  });

  it('handles image upload and displays the image', () => {
    renderWithProviders(<CropScanner onBack={mockOnBack} />);
    const file = new File(['(⌐■_■)'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    // Mocking the file input's files property
    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);

    expect(screen.getByAltText('Selected crop')).toBeInTheDocument();
    expect(screen.getByText('analyzeCrop')).toBeEnabled();
  });

  it('calls onBack when the back button is clicked', () => {
    renderWithProviders(<CropScanner onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('back'));
    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it('analyzes the crop and displays results', async () => {
    renderWithProviders(<CropScanner onBack={mockOnBack} />);
    const file = new File(['(⌐■_■)'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);
    fireEvent.click(screen.getByText('analyzeCrop'));

    await waitFor(() => {
      expect(screen.getByText('BLIGHT')).toBeInTheDocument();
      expect(screen.getByText('95%')).toBeInTheDocument();
      expect(screen.getByText('A common plant disease.')).toBeInTheDocument();
      expect(screen.getByText('Fungus')).toBeInTheDocument();
      expect(screen.getByText('Use resistant varieties')).toBeInTheDocument();
      expect(screen.getByText('Fungicide A')).toBeInTheDocument();
    });
  });

  it('shows an error message if analysis fails', async () => {
    // Use mockFetch.mockImplementationOnce for a single call mock
    mockFetch.mockImplementationOnce(async (url: string) => {
      if (url.includes('/predict')) {
        return { ok: false, statusText: 'Internal Server Error' };
      }
      return { ok: false, json: async () => ({}) };
    });

    renderWithProviders(<CropScanner onBack={mockOnBack} />);
    const file = new File(['(⌐■_■)'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);
    fireEvent.click(screen.getByText('analyzeCrop'));

    await waitFor(() => {
      expect(screen.getByText('Failed to analyze crop. Please try again.')).toBeInTheDocument();
      expect(screen.getByText('Analysis Failed')).toBeInTheDocument();
    });
  });

  it('handles demo photo capture', async () => {
    renderWithProviders(<CropScanner onBack={mockOnBack} />);
    fireEvent.click(screen.getByText('useDemoPhoto'));

    await waitFor(() => {
      expect(screen.getByAltText('Selected crop')).toBeInTheDocument();
      expect(screen.getByText('analyzeCrop')).toBeEnabled();
    });
  });

  it('clears the selected image and analysis result', () => {
    renderWithProviders(<CropScanner onBack={mockOnBack} />);
    const file = new File(['(⌐■_■)'], 'test.png', { type: 'image/png' });
    const input = screen.getByTestId('file-input') as HTMLInputElement;

    Object.defineProperty(input, 'files', {
      value: [file],
    });

    fireEvent.change(input);
    fireEvent.click(screen.getByText('clear'));

    expect(screen.queryByAltText('Selected crop')).not.toBeInTheDocument();
    expect(screen.queryByText('analyzeCrop')).not.toBeInTheDocument();
  });
});
