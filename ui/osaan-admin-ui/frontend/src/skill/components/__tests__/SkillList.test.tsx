import { describe, it, expect, beforeEach } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/renderWithProviders';
import { SkillList } from '../SkillList';
import { server } from '@/test/mocks/server';
import { setMockSkills, skillsErrorHandler, deleteSkillErrorHandler } from '@/test/mocks/handlers';
import { mockSkills } from '@/test/mocks/data';
import type { Skill } from '@/api/generated/api';
import { useSkillStore } from '../../store/store';

describe('SkillList', () => {
  beforeEach(() => {
    useSkillStore.setState({ order: 'asc', searchTerm: '' });
  });

  describe('rendering skills', () => {
    it('displays all skills from the API', async () => {
      setMockSkills(mockSkills);

      renderWithProviders(<SkillList />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      for (const skill of mockSkills) {
        expect(screen.getByText(skill.name!)).toBeInTheDocument();
      }
    });

    it('displays skills in a table with name and delete columns', async () => {
      setMockSkills([{ id: '1', name: 'React' }]);

      renderWithProviders(<SkillList />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      expect(screen.getByText('Osaamisen nimi')).toBeInTheDocument(); // skillName in Finnish
      expect(screen.getByText('Poista')).toBeInTheDocument(); // delete in Finnish
    });

    it('shows empty state when no skills exist', async () => {
      setMockSkills([]);

      renderWithProviders(<SkillList />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Ei osaamisia')).toBeInTheDocument(); // noSkills in Finnish
    });

    it('shows loading state while fetching', () => {
      renderWithProviders(<SkillList />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('allows sorting by skill name', async () => {
      const skills: Skill[] = [
        { id: '1', name: 'Zebra' },
        { id: '2', name: 'Apple' },
        { id: '3', name: 'Mango' },
      ];
      setMockSkills(skills);

      renderWithProviders(<SkillList />, { initialRoute: '/skills?order=asc' });

      // Wait for initial load with ascending order
      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // Verify ascending order: Apple, Mango, Zebra
      const getSkillNames = () =>
        screen
          .getAllByRole('row')
          .slice(1)
          .map(row => row.textContent?.replace(/\s+/g, ' ').trim());

      let skillNames = getSkillNames();
      expect(skillNames[0]).toContain('Apple');
      expect(skillNames[1]).toContain('Mango');
      expect(skillNames[2]).toContain('Zebra');

      // Click to toggle to descending order
      const sortButton = screen.getByRole('button', { name: /osaamisen nimi/i });
      await userEvent.click(sortButton);

      // Wait for descending order: Zebra, Mango, Apple
      await waitFor(() => {
        const names = getSkillNames();
        expect(names[0]).toContain('Zebra');
      });

      skillNames = getSkillNames();
      expect(skillNames[0]).toContain('Zebra');
      expect(skillNames[1]).toContain('Mango');
      expect(skillNames[2]).toContain('Apple');
    });

    it('shows sort direction indicator', async () => {
      setMockSkills(mockSkills);

      renderWithProviders(<SkillList />, { initialRoute: '/skills?order=asc' });

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      // TableSortLabel should be present and active
      const sortLabel = screen.getByRole('button', { name: /osaamisen nimi/i });
      expect(sortLabel).toBeInTheDocument();
    });
  });

  describe('filtering/search', () => {
    it('shows "no results" message when search has no matches', async () => {
      setMockSkills(mockSkills);

      // Simulate a search that will return no results
      // Need to wait for debounce (500ms) to take effect
      renderWithProviders(<SkillList />, { initialRoute: '/skills?search=nonexistent&order=asc' });

      // Wait for debounce + query + render cycle
      await waitFor(
        () => {
          expect(screen.getByText('Ei vastaavia osaamisia')).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });

    it('displays filtered skills when search matches', async () => {
      const skills: Skill[] = [
        { id: '1', name: 'TypeScript' },
        { id: '2', name: 'JavaScript' },
        { id: '3', name: 'Python' },
      ];
      setMockSkills(skills);

      renderWithProviders(<SkillList />, { initialRoute: '/skills?search=script&order=asc' });

      // Wait for filter to take effect - Python should disappear after debounce
      // This confirms both: data loaded AND filter applied
      await waitFor(
        () => {
          expect(screen.getByText('TypeScript')).toBeInTheDocument();
          expect(screen.queryByText('Python')).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );

      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });
  });

  describe('delete functionality', () => {
    it('has a delete button for each skill', async () => {
      setMockSkills([
        { id: '1', name: 'React' },
        { id: '2', name: 'Vue' },
      ]);

      renderWithProviders(<SkillList />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole('button', { name: 'Poista' }); // Delete buttons with aria-label
      expect(deleteButtons.length).toBe(2);
    });

    it('removes skill from list after successful delete', async () => {
      setMockSkills([
        { id: '1', name: 'React' },
        { id: '2', name: 'Vue' },
      ]);

      renderWithProviders(<SkillList />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const reactRow = screen.getByText('React').closest('tr')!;
      const deleteButton = within(reactRow).getByRole('button');

      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.queryByText('React')).not.toBeInTheDocument();
      });

      expect(screen.getByText('Vue')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('displays error alert when API returns an error', async () => {
      // Use 400 error (client error) to avoid retry logic
      server.use(skillsErrorHandler(400, 'Bad Request'));

      renderWithProviders(<SkillList />);

      await waitFor(
        () => {
          expect(screen.getByRole('alert')).toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });

    it('displays delete error when deletion fails', async () => {
      setMockSkills([{ id: '1', name: 'React' }]);

      renderWithProviders(<SkillList />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      server.use(deleteSkillErrorHandler(500, 'Cannot delete skill'));

      const deleteButton = screen.getByRole('button', { name: 'Poista' });
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });

    it('allows dismissing delete error', async () => {
      setMockSkills([{ id: '1', name: 'React' }]);

      renderWithProviders(<SkillList />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      server.use(deleteSkillErrorHandler(500, 'Cannot delete skill'));

      const deleteButton = screen.getByRole('button', { name: 'Poista' });
      await userEvent.click(deleteButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      const closeButton = within(screen.getByRole('alert')).getByRole('button');
      await userEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      });
    });
  });
});
