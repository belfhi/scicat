import { User, AccessGroup, Job, Dataset, RawDataset, Proposal, Policy } from 'shared/sdk/models';
export { User, AccessGroup, Job, Dataset, RawDataset, Proposal, Policy };

import { DatasetInterface } from 'shared/sdk';
export { DatasetInterface };

export interface Settings {
  tapeCopies: string;
  datasetCount: number;
  jobCount: number;
  darkTheme: false;
};

export enum MessageType {
  Success = 'success',
  Error = 'error',
};

export class Message {
  content: string;
  type: MessageType;
  duration ? = 10000;
};

export type ViewMode = 'view' | 'archive' | 'retrieve';

export interface DatasetFilters {
  text: string;
  ownerGroup: string[];
  type: string[];
  creationTime: {begin: string, end: string};
  creationLocation: string[];
  skip: number;
  limit: number;
  keywords: string[];
  sortField: string,
  mode: ViewMode,
};
