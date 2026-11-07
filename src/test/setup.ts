import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

// jsdom lacks these browser APIs; the components treat them as optional.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => false,
  }),
});

class ObserverStub {
  observe() {
    return undefined;
  }
  unobserve() {
    return undefined;
  }
  disconnect() {
    return undefined;
  }
  takeRecords() {
    return [];
  }
}
vi.stubGlobal('IntersectionObserver', ObserverStub);
vi.stubGlobal('ResizeObserver', ObserverStub);

const noContext = (() => null) as typeof HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = noContext;
Element.prototype.scrollIntoView = () => undefined;
window.scrollTo = () => undefined;
