import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TranslationProvider } from '../contexts/TranslationContext'
import { LanguageSelector } from '../components/LanguageSelector'

const renderWithTranslation = (component: React.ReactElement) => {
  return render(
    <TranslationProvider>
      {component}
    </TranslationProvider>
  )
}

describe('LanguageSelector Component', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render language selector with default English', () => {
    renderWithTranslation(<LanguageSelector />)
    
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByText('🇬🇧 English')).toBeInTheDocument()
  })

  it('should show language options when clicked', async () => {
    renderWithTranslation(<LanguageSelector />)
    
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    
    await waitFor(() => {
      expect(screen.getByText('🇱🇰 සිංහල')).toBeInTheDocument()
      expect(screen.getByText('🇮🇳 தமிழ்')).toBeInTheDocument()
    })
  })

  it('should change language when option is selected', async () => {
    renderWithTranslation(<LanguageSelector />)
    
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    
    await waitFor(() => {
      const sinhalaOption = screen.getByText('🇱🇰 සිංහල')
      fireEvent.click(sinhalaOption)
    })

    await waitFor(() => {
      expect(screen.getByText('🇱🇰 සිංහල')).toBeInTheDocument()
    })
    
    expect(localStorage.getItem('vguard_language')).toBe('si')
  })

  it('should persist selected language', () => {
    localStorage.setItem('vguard_language', 'ta')
    
    renderWithTranslation(<LanguageSelector />)
    
    expect(screen.getByText('🇮🇳 தமிழ்')).toBeInTheDocument()
  })

  it('should show correct flag and language name for each language', async () => {
    renderWithTranslation(<LanguageSelector />)
    
    const trigger = screen.getByRole('combobox')
    fireEvent.click(trigger)
    
    await waitFor(() => {
      // Check English
      expect(screen.getByText('🇬🇧 English')).toBeInTheDocument()
      // Check Sinhala
      expect(screen.getByText('🇱🇰 සිංහල')).toBeInTheDocument()
      // Check Tamil
      expect(screen.getByText('🇮🇳 தமிழ்')).toBeInTheDocument()
    })
  })
})
