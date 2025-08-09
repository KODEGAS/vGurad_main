import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(cb: any) {
    this.callback = cb;
  }
  callback: any;
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any
