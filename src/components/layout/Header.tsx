import { Link, NavLink } from 'react-router-dom';

import { ROUTES } from '@constants/routes';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { logout, selectIsAuthenticated, selectCurrentUser } from '@features/auth/store/authSlice';
import { Button } from '@components/ui';
import { cn } from '@utils/cn';
import { env } from '@config/env';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-custom px-3 py-2 text-sm font-semibold transition-all border border-transparent',
    isActive
      ? 'bg-obsidian-container text-white border-obsidian-border shadow-sm shadow-black/10'
      : 'text-obsidian-text-dim hover:text-white hover:bg-obsidian-surface-bright/40',
  );

export const Header = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  return (
    <header className="border-b border-obsidian-border bg-obsidian-surface/95 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to={ROUTES.HOME} className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>{env.APP_NAME}</span>
        </Link>

        <nav className="flex items-center gap-1.5">
          <NavLink to={ROUTES.HOME} className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to={ROUTES.COUNTER} className={navLinkClass}>
            Counter
          </NavLink>
          <NavLink to={ROUTES.VIDEO_CREATION} className={navLinkClass}>
            Video AI
          </NavLink>
          <NavLink to={ROUTES.USERS} className={navLinkClass}>
            Users
          </NavLink>
        </nav>

        <div className="flex items-center gap-3">
          {isAuth ? (
            <>
              <span className="text-sm text-obsidian-text-dim">Hi, {user?.name ?? 'User'}</span>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => dispatch(logout())}
                className="bg-obsidian-container border border-obsidian-border text-white hover:bg-obsidian-surface-bright transition-colors rounded-custom"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to={ROUTES.LOGIN}>
              <Button 
                size="sm"
                className="bg-obsidian-accent hover:bg-blue-600 text-white border border-transparent shadow-lg shadow-blue-500/10 rounded-custom px-4"
              >
                Login
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
