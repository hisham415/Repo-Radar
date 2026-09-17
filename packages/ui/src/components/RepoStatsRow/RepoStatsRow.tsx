import { Stack } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import {
  formatAbsoluteDate,
  formatCompactNumber,
  formatRelativeDate,
  type RepoStats,
} from '@repo-radar/core';
import { StatChip } from '../StatChip/StatChip';

interface RepoStatsRowProps {
  stats: RepoStats;
}

export function RepoStatsRow({ stats }: RepoStatsRowProps) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <StatChip
        icon={<StarRoundedIcon />}
        label={formatCompactNumber(stats.stars)}
        title={`${stats.stars.toLocaleString()} stars`}
        color="warning"
      />
      <StatChip
        icon={<ErrorOutlineRoundedIcon />}
        label={formatCompactNumber(stats.openIssues)}
        title={`${stats.openIssues.toLocaleString()} open issues`}
      />
      <StatChip
        icon={<ScheduleRoundedIcon />}
        label={formatRelativeDate(stats.lastCommitAt)}
        title={`Last commit: ${formatAbsoluteDate(stats.lastCommitAt)}`}
      />
    </Stack>
  );
}
