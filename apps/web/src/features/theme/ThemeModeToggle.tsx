import {
  selectThemeMode,
  toggleThemeMode,
  useAppDispatch,
  useAppSelector,
} from '@repo-radar/store';
import { ThemeToggle } from '@repo-radar/ui';

export function ThemeModeToggle() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector(selectThemeMode);
  return <ThemeToggle mode={mode} onToggle={() => dispatch(toggleThemeMode())} />;
}
