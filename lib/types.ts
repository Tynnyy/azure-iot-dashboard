export type Database = {
  public: {
    Tables: {
      locations: {
        Row: {
          location_id: string;
          location_name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          location_id?: string;
          location_name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          location_id?: string;
          location_name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sensors: {
        Row: {
          sensor_id: string;
          sensor_name: string;
          sensor_type: string;
          sensor_location_id: string | null;
          sensor_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          sensor_id?: string;
          sensor_name: string;
          sensor_type: string;
          sensor_location_id?: string | null;
          sensor_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          sensor_id?: string;
          sensor_name?: string;
          sensor_type?: string;
          sensor_location_id?: string | null;
          sensor_status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sensor_data: {
        Row: {
          id: string;
          sensor_id: string;
          data_timestamp: string;
          data_value: number;
          data_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sensor_id: string;
          data_timestamp?: string;
          data_value: number;
          data_type: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sensor_id?: string;
          data_timestamp?: string;
          data_value?: number;
          data_type?: string;
          created_at?: string;
        };
      };
    };
  };
};

// Application types
export interface Location {
  location_id: string;
  location_name: string;
  created_at: string;
  updated_at: string;
}

export interface Sensor {
  sensor_id: string;
  sensor_name: string;
  sensor_type: string;
  sensor_location_id: string | null;
  sensor_status: string;
  created_at: string;
  updated_at: string;
  location?: Location | null;
}

export interface SensorData {
  id: string;
  sensor_id: string;
  data_timestamp: string;
  data_value: number;
  data_type: string;
  created_at: string;
}

export interface SensorWithLatestReading extends Sensor {
  latest_reading?: {
    data_value: number;
    data_timestamp: string;
  };
}

// API Request/Response types
export interface RegisterSensorRequest {
  sensorName: string;
  sensorType: string;
  locationName: string;
}

export interface RegisterSensorResponse {
  sensorID: string;
  status: string;
}

export interface SubmitDataRequest {
  value: number;
}

export interface SubmitDataResponse {
  status: string;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}
