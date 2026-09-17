import { Box, Card, CardContent, Typography, useMediaQuery, useTheme } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { formatCompactNumber } from '@repo-radar/core';

export interface StarsBarDatum {
  label: string;
  stars: number;
}

interface StarsBarChartProps {
  data: StarsBarDatum[];
  title?: string;
}

const BAR_ROW_HEIGHT = 44;
const MOBILE_LABEL_MAX = 14;

// On phones the owner prefix is dropped and long names ellipsised so bars keep room to breathe.
function toMobileLabel(fullName: string) {
  const name = fullName.split('/').pop() ?? fullName;
  return name.length > MOBILE_LABEL_MAX ? `${name.slice(0, MOBILE_LABEL_MAX - 1)}…` : name;
}

export function StarsBarChart({ data, title = 'Stars per repository' }: StarsBarChartProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('sm'));
  const sorted = [...data].sort((a, b) => b.stars - a.stars);
  const height = Math.max(200, sorted.length * BAR_ROW_HEIGHT + 56);
  const labels = sorted.map((d) => (compact ? toMobileLabel(d.label) : d.label));

  return (
    <Card>
      <CardContent sx={{ px: { xs: 1.5, sm: 2 } }}>
        <Typography variant="h6" gutterBottom sx={{ px: { xs: 0.5, sm: 0 } }}>
          {title}
        </Typography>
        {sorted.length === 0 ? (
          <Box sx={{ height, display: 'grid', placeItems: 'center' }}>
            <Typography color="text.secondary">
              Track repositories to compare their stars.
            </Typography>
          </Box>
        ) : (
          <BarChart
            height={height}
            layout="horizontal"
            margin={{ left: compact ? 104 : 150, right: compact ? 12 : 24, top: 8, bottom: 32 }}
            yAxis={[
              {
                scaleType: 'band',
                data: labels,
                tickLabelStyle: { fontSize: compact ? 11 : 12 },
              },
            ]}
            xAxis={[
              {
                valueFormatter: (v: number) => formatCompactNumber(v),
                tickNumber: compact ? 3 : 6,
                tickLabelStyle: { fontSize: compact ? 11 : 12 },
              },
            ]}
            series={[
              {
                data: sorted.map((d) => d.stars),
                label: 'Stars',
                color: theme.palette.warning.main,
                valueFormatter: (v, { dataIndex }) =>
                  v === null ? '' : `${sorted[dataIndex]?.label}: ${v.toLocaleString()} stars`,
              },
            ]}
            slotProps={{ legend: { hidden: true } }}
            grid={{ vertical: true }}
          />
        )}
      </CardContent>
    </Card>
  );
}
