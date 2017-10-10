import * as lb from 'shared/sdk/models';
import {DatasetFilters} from 'datasets/datasets-filter/dataset-filters';

// NOTE It IS ok to make up a state of other sub states
export interface DatasetState {
    datasets: lb.RawDataset[];
    loading: boolean;
    activeFilters: DatasetFilters;
    filterValues: object;
    currentSet: lb.RawDataset;
    selectedSets: lb.RawDataset[];
}

export const initialDatasetState: DatasetState = {
    datasets: [],
    loading: false,
    activeFilters: <DatasetFilters>{ text: null, startDate: null, endDate: null,
      creationLocation: null, groups: [], skip: 0, initial: true, sortField: undefined},
    filterValues: {startDate: null, endDate: null, creationLocation: null, groups: [], text: null},
    selectedSets: [],
    currentSet: undefined
};
