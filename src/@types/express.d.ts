declare namespace Express {
  export interface Request {
    version: string;
    debug: (txt: string) => void;
    user: {
      id: string;
      features: string[];
    };
  }
}
