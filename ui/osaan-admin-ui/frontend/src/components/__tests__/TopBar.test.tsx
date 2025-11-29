import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/utils/renderWithProviders';
import TopBar from '../TopBar';
import { setMockAuthState } from '@/test/mocks/handlers';
import { mockAdminUser, mockUnauthenticated, mockAuthDisabled } from '@/test/mocks/data';

describe('TopBar', () => {
  describe('authentication states', () => {
    it('shows logout button when user is authenticated', async () => {
      setMockAuthState(mockAdminUser);

      renderWithProviders(<TopBar />);

      await waitFor(() => {
        // Finnish translation for 'logout'
        expect(screen.getByText('Kirjaudu ulos')).toBeInTheDocument();
      });
    });

    it('shows login button when user is not authenticated', async () => {
      setMockAuthState(mockUnauthenticated);

      renderWithProviders(<TopBar />);

      await waitFor(() => {
        // Finnish translation for 'login'
        expect(screen.getByText('Kirjaudu')).toBeInTheDocument();
      });
    });

    it('hides auth buttons when auth is disabled', async () => {
      setMockAuthState(mockAuthDisabled);

      renderWithProviders(<TopBar />);

      // Wait for auth state to load
      await waitFor(() => {
        expect(screen.queryByText('Kirjaudu')).not.toBeInTheDocument();
        expect(screen.queryByText('Kirjaudu ulos')).not.toBeInTheDocument();
      });
    });
  });

  describe('login action', () => {
    it('redirects to login endpoint when login button is clicked', async () => {
      setMockAuthState(mockUnauthenticated);

      renderWithProviders(<TopBar />);

      const loginButton = await screen.findByText('Kirjaudu');
      await userEvent.click(loginButton);

      expect(window.location.assign).toHaveBeenCalledWith('/api/login');
    });
  });

  describe('logout action', () => {
    it('redirects to logout endpoint when logout button is clicked', async () => {
      setMockAuthState(mockAdminUser);

      renderWithProviders(<TopBar />);

      const logoutButton = await screen.findByText('Kirjaudu ulos');
      await userEvent.click(logoutButton);

      expect(window.location.assign).toHaveBeenCalledWith('/api/logout');
    });
  });

  describe('language switching', () => {
    it('shows language menu button', async () => {
      setMockAuthState(mockAdminUser);

      renderWithProviders(<TopBar />);

      await waitFor(() => {
        expect(screen.getByLabelText('change language')).toBeInTheDocument();
      });
    });

    it('opens language menu when clicked', async () => {
      setMockAuthState(mockAdminUser);

      renderWithProviders(<TopBar />);

      const languageButton = await screen.findByLabelText('change language');
      await userEvent.click(languageButton);

      // Menu should show both language options
      expect(screen.getByText('Suomi')).toBeInTheDocument();
      expect(screen.getByText('English')).toBeInTheDocument();
    });

    it('changes language to English when selected', async () => {
      setMockAuthState(mockAdminUser);

      renderWithProviders(<TopBar />);

      // Open language menu
      const languageButton = await screen.findByLabelText('change language');
      await userEvent.click(languageButton);

      // Click English option
      const englishOption = screen.getByText('English');
      await userEvent.click(englishOption);

      // After language change, UI text should update
      // Logout button should now say "Logout" instead of "Kirjaudu ulos"
      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });
    });

    it('language change persists across re-renders', async () => {
      setMockAuthState(mockAdminUser);

      const { rerender } = renderWithProviders(<TopBar />);

      // Change to English
      const languageButton = await screen.findByLabelText('change language');
      await userEvent.click(languageButton);
      await userEvent.click(screen.getByText('English'));

      await waitFor(() => {
        expect(screen.getByText('Logout')).toBeInTheDocument();
      });

      // Re-render the component
      rerender(<TopBar />);

      // Should still be in English
      expect(screen.getByText('Logout')).toBeInTheDocument();
    });
  });

  describe('branding', () => {
    it('displays app title', async () => {
      setMockAuthState(mockAdminUser);

      renderWithProviders(<TopBar />);

      expect(screen.getByText('Osaan Admin')).toBeInTheDocument();
    });
  });
});
