import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import { PaginatedResponse, Location } from '../api/types/database';
import { DatabaseService } from '@/api';

const databaseService = new DatabaseService();

export function useInfiniteLocations() {
  return useInfiniteQuery<PaginatedResponse<Location>, Error, InfiniteData<PaginatedResponse<Location>>, [string]>({
    queryKey: ['locations'],
    queryFn: async ({ pageParam }) => {
      console.log('Fetching locations with cursor:', pageParam);
      const result = await databaseService.getLocations(pageParam as string);
      console.log('Fetched locations:', result);
      return result;
    },
    getNextPageParam: (lastPage) => {
      console.log('Next cursor:', lastPage.nextCursor);
      return lastPage.nextCursor;
    },
    initialPageParam: undefined,
  });
}