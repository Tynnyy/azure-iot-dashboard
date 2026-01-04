export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
        Relationships: [];
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
        Relationships: [
          {
            foreignKeyName: "sensors_sensor_location_id_fkey";
            columns: ["sensor_location_id"];
            isOneToOne: false;
            referencedRelation: "locations";
            referencedColumns: ["location_id"];
          }
        ];
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
        Relationships: [
          {
            foreignKeyName: "sensor_data_sensor_id_fkey";
            columns: ["sensor_id"];
            isOneToOne: false;
            referencedRelation: "sensors";
            referencedColumns: ["sensor_id"];
          }
        ];
      };
      alert_history: {
        Row: {
          id: string;
          sensor_id: string;
          alert_type: string;
          alert_sent_at: string;
          recipient_email: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sensor_id: string;
          alert_type: string;
          alert_sent_at?: string;
          recipient_email: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sensor_id?: string;
          alert_type?: string;
          alert_sent_at?: string;
          recipient_email?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "alert_history_sensor_id_fkey";
            columns: ["sensor_id"];
            isOneToOne: false;
            referencedRelation: "sensors";
            referencedColumns: ["sensor_id"];
          }
        ];
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
    CompositeTypes: {};
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
  recent_readings?: Array<{
    data_value: number;
    data_timestamp: string;
  }>;
  computed_status?: 'active' | 'inactive';
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

// Alert History types
export interface AlertHistory {
  id: string;
  sensor_id: string;
  alert_type: string;
  alert_sent_at: string;
  recipient_email: string;
  created_at: string;
}
