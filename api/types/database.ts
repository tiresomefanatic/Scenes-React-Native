import { Location } from './models';

export { Location }; 


export interface PaginatedResponse<T> {
  data: T[];
  nextCursor?: string;
}

export interface DatabaseService {
    getLocations(cursor?: string, limit?: number): Promise<PaginatedResponse<Location>>;
    // other methods...
  }