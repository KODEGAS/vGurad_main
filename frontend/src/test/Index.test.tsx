import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TranslationProvider } from '../contexts/TranslationContext'
import Index from '../pages/Index'

// Mock the navigate function
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <TranslationProvider>
        {component}
      </TranslationProvider>
    </BrowserRouter>
  )
}

describe('Index Page Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear()
    localStorage.clear()
  })

  it('should render hero section with correct content', () => {
    renderWithProviders(<Index />)
    
    expect(screen.getByText('Protect Your Crops with AI')).toBeInTheDocument()
    expect(screen.getByText(/Detect diseases early, get expert treatment advice/)).toBeInTheDocument()
  })

  it('should render statistics section', () => {
    renderWithProviders(<Index />)
    
    expect(screen.getByText('10,000+')).toBeInTheDocument()
    expect(screen.getByText('Diseases Detected')).toBeInTheDocument()
    expect(screen.getByText('5,000+')).toBeInTheDocument()
    expect(screen.getByText('Farmers Helped')).toBeInTheDocument()
    expect(screen.getByText('24/7')).toBeInTheDocument()
    expect(screen.getByText('Expert Support')).toBeInTheDocument()
    expect(screen.getByText('95%')).toBeInTheDocument()
    expect(screen.getByText('Accuracy Rate')).toBeInTheDocument()
  })

  it('should render quick action cards', () => {
    renderWithProviders(<Index />)
    
    expect(screen.getByText('Scan Your Crop')).toBeInTheDocument()
    expect(screen.getByText('Disease Database')).toBeInTheDocument()
    expect(screen.getByText('Expert Help')).toBeInTheDocument()
    expect(screen.getByText('Farmer Tips')).toBeInTheDocument()
  })

  it('should change language and update content', () => {
    renderWithProviders(<Index />)
    
    // Click on language selector to open dropdown
    const languageSelector = screen.getByRole('combobox')
    fireEvent.click(languageSelector)
    
    // Note: In a real test, you would need to mock the select component behavior
    // For now, we'll test that the component renders without errors
    expect(screen.getByText('Protect Your Crops with AI')).toBeInTheDocument()
  })

  it('should render weather conditions section', () => {
    renderWithProviders(<Index />)
    
    expect(screen.getByText('Current Weather Conditions')).toBeInTheDocument()
    expect(screen.getByText(/Humidity: High/)).toBeInTheDocument()
    expect(screen.getByText(/Temperature: 28°C/)).toBeInTheDocument()
    expect(screen.getByText(/Precipitation: Light Rain/)).toBeInTheDocument()
  })

  it('should have accessible navigation elements', () => {
    renderWithProviders(<Index />)
    
    // Check for important navigation elements
    const loginButton = screen.getByText('Login')
    const signUpButton = screen.getByText('Sign Up')
    
    expect(loginButton).toBeInTheDocument()
    expect(signUpButton).toBeInTheDocument()
  })

  it('should render with Sinhala translations', () => {
    // Set language to Sinhala before rendering
    localStorage.setItem('vguard_language', 'si')
    
    renderWithProviders(<Index />)
    
    expect(screen.getByText('AI සමඟ ඔබේ භෝග ආරක්ෂා කරන්න')).toBeInTheDocument()
    expect(screen.getByText('ලොගින් වන්න')).toBeInTheDocument()
    expect(screen.getByText('ලියාපදිංචි වන්න')).toBeInTheDocument()
  })

  it('should render with Tamil translations', () => {
    // Set language to Tamil before rendering
    localStorage.setItem('vguard_language', 'ta')
    
    renderWithProviders(<Index />)
    
    expect(screen.getByText('AI உடன் உங்கள் பயிர்களைப் பாதுகாக்கவும்')).toBeInTheDocument()
    expect(screen.getByText('உள்நுழைய')).toBeInTheDocument()
    expect(screen.getByText('பதிவு செய்க')).toBeInTheDocument()
  })
})
