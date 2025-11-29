import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils/renderWithProviders';
import { RequireRole } from '../RequireRole';
import { RequireAdmin } from '../RequireAdmin';
import { RequireAuth } from '../RequireAuth';
import { setMockAuthState } from '@/test/mocks/handlers';
import {
  mockAdminUser,
  mockRegularUser,
  mockUnauthenticated,
  mockAuthDisabled,
} from '@/test/mocks/data';

describe('RequireRole', () => {
  describe('when user is authenticated with required role', () => {
    it('renders children', async () => {
      setMockAuthState(mockAdminUser);

      renderWithProviders(
        <RequireRole role="ADMIN">
          <div>Protected Content</div>
        </RequireRole>
      );

      expect(await screen.findByText('Protected Content')).toBeInTheDocument();
    });
  });

  describe('when user is authenticated without required role', () => {
    it('renders nothing', async () => {
      setMockAuthState(mockRegularUser);

      renderWithProviders(
        <RequireRole role="ADMIN">
          <div>Protected Content</div>
        </RequireRole>
      );

      // Wait for auth query to resolve
      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('when user is unauthenticated', () => {
    it('redirects to login', async () => {
      setMockAuthState(mockUnauthenticated);

      renderWithProviders(
        <RequireRole role="ADMIN">
          <div>Protected Content</div>
        </RequireRole>
      );

      await waitFor(() => {
        expect(window.location.assign).toHaveBeenCalledWith('/api/login');
      });
    });

    it('does not render children', async () => {
      setMockAuthState(mockUnauthenticated);

      renderWithProviders(
        <RequireRole role="ADMIN">
          <div>Protected Content</div>
        </RequireRole>
      );

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('when auth is disabled (local dev mode)', () => {
    it('renders children regardless of role', async () => {
      setMockAuthState(mockAuthDisabled);

      renderWithProviders(
        <RequireRole role="ADMIN">
          <div>Protected Content</div>
        </RequireRole>
      );

      expect(await screen.findByText('Protected Content')).toBeInTheDocument();
    });

    it('does not redirect to login', async () => {
      setMockAuthState(mockAuthDisabled);

      renderWithProviders(
        <RequireRole role="ADMIN">
          <div>Protected Content</div>
        </RequireRole>
      );

      await waitFor(() => {
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      });

      expect(window.location.assign).not.toHaveBeenCalled();
    });
  });

  describe('when no role is required (just authentication)', () => {
    it('renders for any authenticated user', async () => {
      setMockAuthState(mockRegularUser);

      renderWithProviders(
        <RequireRole>
          <div>Auth Only Content</div>
        </RequireRole>
      );

      expect(await screen.findByText('Auth Only Content')).toBeInTheDocument();
    });
  });
});

describe('RequireAdmin', () => {
  it('renders children for admin users', async () => {
    setMockAuthState(mockAdminUser);

    renderWithProviders(
      <RequireAdmin>
        <div>Admin Content</div>
      </RequireAdmin>
    );

    expect(await screen.findByText('Admin Content')).toBeInTheDocument();
  });

  it('does not render for non-admin users', async () => {
    setMockAuthState(mockRegularUser);

    renderWithProviders(
      <RequireAdmin>
        <div>Admin Content</div>
      </RequireAdmin>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});

describe('RequireAuth', () => {
  it('renders children for any authenticated user', async () => {
    setMockAuthState(mockRegularUser);

    renderWithProviders(
      <RequireAuth>
        <div>Authenticated Content</div>
      </RequireAuth>
    );

    expect(await screen.findByText('Authenticated Content')).toBeInTheDocument();
  });

  it('redirects unauthenticated users to login', async () => {
    setMockAuthState(mockUnauthenticated);

    renderWithProviders(
      <RequireAuth>
        <div>Authenticated Content</div>
      </RequireAuth>
    );

    await waitFor(() => {
      expect(window.location.assign).toHaveBeenCalledWith('/api/login');
    });
  });
});
