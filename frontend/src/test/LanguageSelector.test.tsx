import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TranslationProvider } from '../contexts/TranslationContext'
import { LanguageSelector } from '../components/LanguageSelector'

// Mock localStorage
const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
}

// @ts-ignore
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
})

// Mock the translation context
vi.mock('../contexts/TranslationContext', async () => {
    const actual = await vi.importActual('../contexts/TranslationContext')
    return {
        ...actual,
        TranslationProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
        useTranslation: () => ({
            language: 'en',
            setLanguage: vi.fn(),
            t: (key: string) => key,
        })
    }
})

describe('LanguageSelector Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockLocalStorage.getItem.mockReturnValue('en')
    })

    it('should render language selector component', () => {
        render(
            <TranslationProvider>
                <LanguageSelector />
            </TranslationProvider>
        )

        expect(screen.getByLabelText('Language selector')).toBeInTheDocument()
    })

    it('should show English as default language', () => {
        render(
            <TranslationProvider>
                <LanguageSelector />
            </TranslationProvider>
        )

        // Check for English text - the flag might not render properly in tests
        expect(screen.getByText('English')).toBeInTheDocument()
    })

    it('should show Sinhala when language preference is set to si', () => {
        // Mock useTranslation to return Sinhala
        vi.doMock('../contexts/TranslationContext', async () => {
            const actual = await vi.importActual('../contexts/TranslationContext')
            return {
                ...actual,
                useTranslation: () => ({
                    language: 'si',
                    setLanguage: vi.fn(),
                    t: (key: string) => key,
                })
            }
        })

        render(
            <TranslationProvider>
                <LanguageSelector />
            </TranslationProvider>
        )

        expect(screen.getByText('සිංහල')).toBeInTheDocument()
    })

    it('should show Tamil when language preference is set to ta', () => {
        // Mock useTranslation to return Tamil
        vi.doMock('../contexts/TranslationContext', async () => {
            const actual = await vi.importActual('../contexts/TranslationContext')
            return {
                ...actual,
                useTranslation: () => ({
                    language: 'ta',
                    setLanguage: vi.fn(),
                    t: (key: string) => key,
                })
            }
        })

        render(
            <TranslationProvider>
                <LanguageSelector />
            </TranslationProvider>
        )

        expect(screen.getByText('தமிழ்')).toBeInTheDocument()
    })

    it('should have language icon', () => {
        render(
            <TranslationProvider>
                <LanguageSelector />
            </TranslationProvider>
        )

        // Check for the Languages icon (lucide-react icon)
        expect(document.querySelector('.lucide-languages')).toBeInTheDocument()
    })
})
