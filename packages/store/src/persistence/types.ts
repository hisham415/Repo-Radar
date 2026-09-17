import type { AuthState } from '../slices/authSlice';
import type { SettingsState } from '../slices/settingsSlice';
import type { TrackedReposState } from '../slices/trackedReposSlice';

export interface PersistedState {
  trackedRepos?: TrackedReposState;
  auth?: AuthState;
  settings?: SettingsState;
}
