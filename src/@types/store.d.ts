export interface Store {
  storeId: string;
  socketId: string;
  tpiInfo?: Info;
  status?: StatusMessage;
  clientVersion?: string;
}

export interface StatusMessage {
  message: string;
  type: "info" | "error";
  timestamp: Date | number;
}

export interface Info {
  secureServer: boolean;
  logLevel: number;
  servicePort: number;
  storeId: string;
  price: number;
  appName: string;
  appVersion: string;
  businessDateStart: string;
  intelligentHPDiscount: boolean;
  PosServerAlive: boolean;
  PosServerVersion: string;
  dbServer: string;
  dbName: string;
  zodiac: string;
  roamer_Client: number;
  serverTimeStamp: string;
  serverCurrentTime: number;
  gmVersion: string;
}
