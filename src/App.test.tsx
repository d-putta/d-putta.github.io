import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { profile } from './content/profile';

describe('App', () => {
  it('renders the hero headline and the name', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/Engineering the layer where/i);
    expect(heading).toHaveTextContent(/AI agents/i);
    expect(screen.getAllByText(profile.name).length).toBeGreaterThan(0);
  });

  it('exposes one navigation link per section', () => {
    render(<App />);
    const nav = screen.getByRole('navigation', { name: /primary/i });
    for (const link of profile.nav) {
      expect(nav).toContainElement(screen.getAllByRole('link', { name: link.label })[0] ?? null);
    }
  });

  it('builds a mailto link from the email parts', () => {
    render(<App />);
    const link = screen.getByRole('link', { name: /^email/i });
    expect(link).toHaveAttribute('href', expect.stringMatching(/^mailto:[^@\s]+@[^@\s]+\.[a-z]+/i));
  });

  it('never mentions the employer or city', () => {
    const { container } = render(<App />);
    expect(container.textContent).not.toMatch(/Lilly|Indianapolis/);
  });
});
