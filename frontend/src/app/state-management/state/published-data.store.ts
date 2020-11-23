import { PublishedData, GenericFilters } from "state-management/models";

export interface PublishedDataState {
  publishedData: PublishedData[];
  currentPublishedData: PublishedData;

  totalCount: number;

  filters: GenericFilters;
}

export const initialPublishedDataState: PublishedDataState = {
  publishedData: [],
  currentPublishedData: null,

  totalCount: 0,

  filters: {
    sortField: "createdAt desc",
    skip: 0,
    limit: 25
  }
};
