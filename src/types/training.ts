export type Training = {
  activity_id: number;
  name: string;
  date: string;
  distance: number;
  duration: number;
  avgheartrate: number | null;
  avgpower: number | null;
  weighted_avg_watts: number | null;
};

export type Lap = {
  activity_id: number;
  lap_index: number;
  duration_seconds: number;
  average_watts: number;
  average_heartrate: number;
};
