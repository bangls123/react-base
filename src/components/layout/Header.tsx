import { Link, NavLink } from 'react-router-dom';

import { ROUTES } from '@constants/routes';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { logout, selectIsAuthenticated, selectCurrentUser } from '@features/auth/store/authSlice';
import { Button } from '@components/ui';
import { cn } from '@utils/cn';
import { env } from '@config/env';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-primary-100 text-primary-700' : 'text-gray-700 hover:bg-gray-100',
  );

export const Header = () => {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to={ROUTES.HOME} className="text-xl font-bold text-primary-600">
          {env.APP_NAME}
        </Link>

        <nav className="flex items-center gap-2">
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
              <span className="text-sm text-gray-600">Hi, {user?.name ?? 'User'}</span>
              <Button variant="secondary" size="sm" onClick={() => dispatch(logout())}>
                Logout
              </Button>
            </>
          ) : (
            <Link to={ROUTES.LOGIN}>
              <Button size="sm">Login</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
