import { describe, it, expect, vi } from 'vitest';
import { renderWithProviders, screen, userEvent, waitFor } from '@/test/renderWithProviders';
import { SkillFilter } from '../skill-filter';

describe('SkillFilter', () => {
  it('disables submit while the form is empty', () => {
    renderWithProviders(<SkillFilter onSearch={vi.fn()} />);
    expect(screen.getByRole('button', { name: /hae työntekijöitä/i })).toBeDisabled();
  });

  it('blocks submit when only the skill query is filled in', async () => {
    const onSearch = vi.fn();
    renderWithProviders(<SkillFilter onSearch={onSearch} />);

    const skillInput = screen.getByPlaceholderText(/hae osaamisia/i);
    await userEvent.type(skillInput, 'Java');
    await waitFor(() => expect(skillInput).toHaveValue('Java'));

    expect(screen.getByRole('button', { name: /hae työntekijöitä/i })).toBeDisabled();
    expect(onSearch).not.toHaveBeenCalled();
  });

  it('shows an inline error after the skill query is emptied out', async () => {
    renderWithProviders(<SkillFilter onSearch={vi.fn()} />);

    const skillInput = screen.getByPlaceholderText(/hae osaamisia/i);
    await userEvent.type(skillInput, 'Java');
    await waitFor(() => expect(skillInput).toHaveValue('Java'));
    await userEvent.clear(skillInput);

    expect(await screen.findByText(/anna osaamisen nimi/i)).toBeInTheDocument();
  });

  it('submits with a valid skill name and rating', async () => {
    const onSearch = vi.fn();
    renderWithProviders(<SkillFilter onSearch={onSearch} />);

    const skillInput = screen.getByPlaceholderText(/hae osaamisia/i);
    await userEvent.type(skillInput, 'Java');
    await waitFor(() => expect(skillInput).toHaveValue('Java'));

    await userEvent.click(screen.getByRole('button', { name: /3 — Osaava/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /hae työntekijöitä/i })).toBeEnabled();
    });

    await userEvent.click(screen.getByRole('button', { name: /hae työntekijöitä/i }));

    expect(onSearch).toHaveBeenCalledWith({ skillName: 'Java', minRating: 3 });
  });
});
