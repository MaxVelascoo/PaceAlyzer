export type Training = {
  activity_id: number;
  date: string;
  duration: number | null;
  distance: number | null;
  avgheartrate: number | null;
  weighted_average_watts: number | null;
};

export type Lap = {
  activity_id: number;
  lap_index: number;
  duration_seconds: number;
  average_watts: number;
  average_heartrate: number;
};
