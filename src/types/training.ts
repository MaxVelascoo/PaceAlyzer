export type Training = {
  activity_id: number;
  name?: string | null;
  date: string;
  duration: number | null;
  distance: number | null;
  avgheartrate: number | null;
  weighted_average_watts: number | null;
  altitude?: number | null;
  power_stream?: number[] | null;
  hr_stream?: number[] | null;
};

export type Lap = {
  activity_id: number;
  lap_index: number;
  duration_seconds: number;
  average_watts: number;
  average_heartrate: number;
};
