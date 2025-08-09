import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { TranslationProvider, useTranslation } from '../contexts/TranslationContext'
import { translations } from '../translations'

// Test component to check translation functionality
const TestComponent = () => {
  const { t, language, setLanguage } = useTranslation()

  return (
    <div>
      <span data-testid="hero-title">{t('heroTitle')}</span>
      <span data-testid="login-text">{t('login')}</span>
      <span data-testid="current-language">{language}</span>
      <button onClick={() => setLanguage('en')} data-testid="en-button">English</button>
      <button onClick={() => setLanguage('si')} data-testid="si-button">Sinhala</button>
      <button onClick={() => setLanguage('ta')} data-testid="ta-button">Tamil</button>
    </div>
  )
}

const renderWithTranslation = (component: React.ReactElement) => {
  return render(
    <TranslationProvider>
      {component}
    </TranslationProvider>
  )
}

describe('TranslationContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
  })

  it('should provide default language as English', () => {
    renderWithTranslation(<TestComponent />)
    
    expect(screen.getByTestId('current-language')).toHaveTextContent('en')
    expect(screen.getByTestId('hero-title')).toHaveTextContent(translations.en.heroTitle)
    expect(screen.getByTestId('login-text')).toHaveTextContent(translations.en.login)
  })

  it('should change language to Sinhala when setLanguage is called', () => {
    renderWithTranslation(<TestComponent />)
    
    fireEvent.click(screen.getByTestId('si-button'))
    
    expect(screen.getByTestId('current-language')).toHaveTextContent('si')
    expect(screen.getByTestId('hero-title')).toHaveTextContent(translations.si.heroTitle)
    expect(screen.getByTestId('login-text')).toHaveTextContent(translations.si.login)
  })

  it('should change language to Tamil when setLanguage is called', () => {
    renderWithTranslation(<TestComponent />)
    
    fireEvent.click(screen.getByTestId('ta-button'))
    
    expect(screen.getByTestId('current-language')).toHaveTextContent('ta')
    expect(screen.getByTestId('hero-title')).toHaveTextContent(translations.ta.heroTitle)
    expect(screen.getByTestId('login-text')).toHaveTextContent(translations.ta.login)
  })

  it('should persist language preference in localStorage', () => {
    renderWithTranslation(<TestComponent />)
    
    fireEvent.click(screen.getByTestId('si-button'))
    
    expect(localStorage.getItem('vguard_language')).toBe('si')
  })

  it('should load language preference from localStorage', () => {
    localStorage.setItem('vguard_language', 'ta')
    
    renderWithTranslation(<TestComponent />)
    
    expect(screen.getByTestId('current-language')).toHaveTextContent('ta')
    expect(screen.getByTestId('hero-title')).toHaveTextContent(translations.ta.heroTitle)
    expect(screen.getByTestId('login-text')).toHaveTextContent(translations.ta.login)
  })

  it('should fallback to English for invalid language codes', () => {
    localStorage.setItem('vguard_language', 'invalid')
    
    renderWithTranslation(<TestComponent />)
    
    expect(screen.getByTestId('current-language')).toHaveTextContent('en')
    expect(screen.getByTestId('hero-title')).toHaveTextContent(translations.en.heroTitle)
    expect(screen.getByTestId('login-text')).toHaveTextContent(translations.en.login)
  })

  it('should return key if translation is missing', () => {
    const TestMissingKey = () => {
      const { t } = useTranslation()
      return <span data-testid="missing-key">{t('nonExistentKey' as any)}</span>
    }

    renderWithTranslation(<TestMissingKey />)
    
    expect(screen.getByTestId('missing-key')).toHaveTextContent('nonExistentKey')
  })
})

describe('Translation Files', () => {
  it('should have all required languages', () => {
    expect(translations).toHaveProperty('en')
    expect(translations).toHaveProperty('si')
    expect(translations).toHaveProperty('ta')
  })

  it('should have consistent keys across all languages', () => {
    const englishKeys = Object.keys(translations.en)
    const sinhalaKeys = Object.keys(translations.si)
    const tamilKeys = Object.keys(translations.ta)

    expect(sinhalaKeys.sort()).toEqual(englishKeys.sort())
    expect(tamilKeys.sort()).toEqual(englishKeys.sort())
  })

  it('should have non-empty translations for all keys', () => {
    Object.values(translations).forEach((lang) => {
      Object.values(lang).forEach((value) => {
        expect(value).toBeTruthy()
        expect(typeof value).toBe('string')
        expect(value.trim().length).toBeGreaterThan(0)
      })
    })
  })

  it('should have specific required keys', () => {
    const requiredKeys = [
      'login',
      'signUp',
      'heroTitle',
      'heroDescription',
      'cropScanner',
      'diseaseDatabase',
      'expertHelp',
      'farmerTips',
      'language',
      'english',
      'sinhala',
      'tamil'
    ]

    requiredKeys.forEach(key => {
      expect(translations.en).toHaveProperty(key)
      expect(translations.si).toHaveProperty(key)
      expect(translations.ta).toHaveProperty(key)
    })
  })
})
