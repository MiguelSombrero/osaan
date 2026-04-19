import { NavBar } from './nav-bar';
import { Container } from './container';

interface AppShellProps {
  children: React.ReactNode;
  containerClassName?: string;
}

function AppShell({ children, containerClassName }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col">
      <NavBar />
      <main className="flex-1 py-8">
        <Container className={containerClassName}>{children}</Container>
      </main>
    </div>
  );
}

export { AppShell };
