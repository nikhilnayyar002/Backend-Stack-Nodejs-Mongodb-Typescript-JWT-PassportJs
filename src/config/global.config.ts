export interface processEnvironment {
  isProduction: boolean;
  port: number;
  mongoURI: string;
  jwtSecret: string;
  jwtExp: string;
}

export interface globalEnvironment {
  /** all rest api requests will have base as restAPI eg: "/api"
   *  Eg: http://localhost:3000/api/method
   */
  restAPI: string;
  server: {
    dev: processEnvironment;
    prod: processEnvironment;
  };
}

/**
 * message response from server
 */
export interface BackendStatus {
  status: boolean;
  message: string;
}