import { render } from '@testing-library/react';
import axe from 'axe-core';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('accessibility', () => {
  it('has no axe violations at rest', async () => {
    const { container } = render(<App />);
    const results = await axe.run(container, {
      rules: {
        // Color contrast needs real rendering; it is checked manually in a browser.
        'color-contrast': { enabled: false },
      },
    });
    const summary = results.violations.map((v) => `${v.id}: ${String(v.nodes.length)}`);
    expect(summary).toEqual([]);
  });
});
