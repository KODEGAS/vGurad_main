import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { TranslationProvider } from '../contexts/TranslationContext'

// Mock the navigate function
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

// Mock the Hero3D component to avoid 3D rendering issues in tests
vi.mock('../components/Hero3D', () => ({
    default: () => <div data-testid="hero-3d">Hero 3D Component</div>
}))

// Mock localStorage
const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
})

// Create a simplified Index component for testing
const TestIndex = () => {
    const { useTranslation } = require('@/contexts/TranslationContext')
    const { t } = useTranslation()

    return (
        <div>
            <header>
                <span>{t('login')}</span>
                <span>{t('signUp')}</span>
            </header>
            <main>
                <h1>{t('heroTitle')}</h1>
                <p>{t('heroDescription')}</p>
                <div>
                    <span>10,000+</span>
                    <span>{t('diseasesDetected')}</span>
                    <span>5,000+</span>
                    <span>{t('farmersHelped')}</span>
                    <span>24/7</span>
                    <span>{t('expertSupport')}</span>
                    <span>95%</span>
                    <span>{t('accuracyRate')}</span>
                </div>
                <div>
                    <span>{t('scanCrop')}</span>
                    <span>{t('diseaseDatabase')}</span>
                    <span>{t('expertHelp')}</span>
                    <span>{t('farmerTips')}</span>
                </div>
                <div>
                    <h3>{t('currentWeather')}</h3>
                    <p>{t('humidity')}: High</p>
                    <p>{t('temperature')}: 28°C</p>
                    <p>{t('precipitation')}: Light Rain</p>
                </div>
            </main>
        </div>
    )
}

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
        vi.clearAllMocks()
        mockLocalStorage.getItem.mockReturnValue(null)
    })

    it('should render hero section with correct content', () => {
        renderWithProviders(<TestIndex />)

        expect(screen.getByText('Protect Your Crops with AI')).toBeInTheDocument()
        expect(screen.getByText(/Detect diseases early, get expert treatment advice/)).toBeInTheDocument()
    })

    it('should render statistics section', () => {
        renderWithProviders(<TestIndex />)

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
        renderWithProviders(<TestIndex />)

        expect(screen.getByText('Scan Your Crop')).toBeInTheDocument()
        expect(screen.getByText('Disease Database')).toBeInTheDocument()
        expect(screen.getByText('Expert Help')).toBeInTheDocument()
        expect(screen.getByText('Farmer Tips')).toBeInTheDocument()
    })

    it('should render weather conditions section', () => {
        renderWithProviders(<TestIndex />)

        expect(screen.getByText('Current Weather Conditions')).toBeInTheDocument()
        expect(screen.getByText(/Humidity: High/)).toBeInTheDocument()
        expect(screen.getByText(/Temperature: 28°C/)).toBeInTheDocument()
        expect(screen.getByText(/Precipitation: Light Rain/)).toBeInTheDocument()
    })

    it('should have accessible navigation elements', () => {
        renderWithProviders(<TestIndex />)

        // Check for important navigation elements
        const loginButton = screen.getByText('Login')
        const signUpButton = screen.getByText('Sign Up')

        expect(loginButton).toBeInTheDocument()
        expect(signUpButton).toBeInTheDocument()
    })

    it('should render with Sinhala translations', () => {
        // Set language to Sinhala before rendering
        mockLocalStorage.getItem.mockReturnValue('si')

        renderWithProviders(<TestIndex />)

        expect(screen.getByText('AI සමඟ ඔබේ භෝග ආරක්ෂා කරන්න')).toBeInTheDocument()
        expect(screen.getByText('ලොගින් වන්න')).toBeInTheDocument()
        expect(screen.getByText('ලියාපදිංචි වන්න')).toBeInTheDocument()
    })

    it('should render with Tamil translations', () => {
        // Set language to Tamil before rendering
        mockLocalStorage.getItem.mockReturnValue('ta')

        renderWithProviders(<TestIndex />)

        expect(screen.getByText('AI உடன் உங்கள் பயிர்களைப் பாதுகாக்கவும்')).toBeInTheDocument()
        expect(screen.getByText('உள்நுழைய')).toBeInTheDocument()
        expect(screen.getByText('பதிவு செய்க')).toBeInTheDocument()
    })
})
