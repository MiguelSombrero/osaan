import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/renderWithProviders';
import { SubscriptionComposer } from '../subscription-composer';

describe('SubscriptionComposer', () => {
  it('disables submit while the form is empty', () => {
    renderWithProviders(<SubscriptionComposer onCreate={vi.fn()} />);
    expect(screen.getByRole('button', { name: /avaa vahti/i })).toBeDisabled();
  });

  it('blocks submit when only skill is filled in', async () => {
    const onCreate = vi.fn();
    renderWithProviders(<SubscriptionComposer onCreate={onCreate} />);

    await userEvent.type(screen.getByPlaceholderText(/kirjoita osaamisen nimi/i), 'Java');

    expect(screen.getByRole('button', { name: /avaa vahti/i })).toBeDisabled();
    expect(onCreate).not.toHaveBeenCalled();
  });

  it('shows an inline error after the skill field is emptied out', async () => {
    renderWithProviders(<SubscriptionComposer onCreate={vi.fn()} />);

    const skillInput = screen.getByPlaceholderText(/kirjoita osaamisen nimi/i);
    await userEvent.type(skillInput, 'Java');
    await userEvent.clear(skillInput);

    expect(await screen.findByText(/anna osaamisen nimi/i)).toBeInTheDocument();
  });

  it('submits with valid skill + rating', async () => {
    const onCreate = vi.fn();
    renderWithProviders(<SubscriptionComposer onCreate={onCreate} />);

    await userEvent.type(screen.getByPlaceholderText(/kirjoita osaamisen nimi/i), 'Java');
    await userEvent.click(screen.getByRole('button', { name: /3 — Osaava/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /avaa vahti/i })).toBeEnabled();
    });

    await userEvent.click(screen.getByRole('button', { name: /avaa vahti/i }));

    expect(onCreate).toHaveBeenCalledWith({ skill: 'Java', rating: 3 });
  });
});
