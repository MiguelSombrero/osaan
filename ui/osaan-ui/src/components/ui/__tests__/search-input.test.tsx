import { describe, it, expect } from 'vitest';
import { useState } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SearchInput } from '../search-input';

// Simulates a parent whose onChange round-trip is asynchronous (e.g. driven by
// react-hook-form + an async zodResolver), instead of an immediate setState.
function DelayedEchoHarness({ echoDelayMs }: { echoDelayMs: number }) {
  const [value, setValue] = useState('');
  const handleChange = (v: string) => {
    setTimeout(() => setValue(v), echoDelayMs);
  };
  return <SearchInput value={value} onChange={handleChange} debounceMs={0} />;
}

async function typeSlowly(input: HTMLElement, text: string, interKeyDelayMs: number) {
  let current = '';
  for (const ch of text) {
    current += ch;
    fireEvent.change(input, { target: { value: current } });
    await new Promise((resolve) => setTimeout(resolve, interKeyDelayMs));
  }
}

describe('SearchInput', () => {
  it('does not lose keystrokes typed while an earlier debounced onChange is still echoing back as the value prop', async () => {
    render(<DelayedEchoHarness echoDelayMs={15} />);
    const input = screen.getByRole('searchbox');
    fireEvent.focus(input);

    await typeSlowly(input, 'Java', 5);

    await waitFor(() => expect(input).toHaveValue('Java'), { timeout: 2000 });

    // A late-arriving echo of an earlier keystroke must not regress the value.
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(input).toHaveValue('Java');
  });
});
