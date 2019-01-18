import * as fromSampleSelectors from "./samples.selectors";

import { SampleState } from "state-management/state/samples.store";

const initialSampleState: SampleState = {
  samples: {},
  selectedSamples: [],
  currentSample: null,
  totalCount: 0,
  submitComplete: false,

  samplesLoading: true,
  error: undefined,
  skip: 0,
  limit: 0,
  filters: {
    sortField: "creationTime:desc"
  },
  selectedId: null
};

describe("test Sample Selectors", () => {
  it("should get filters", () => {
    expect(
      fromSampleSelectors.getSampleFilters.projector(initialSampleState)
    ).toEqual("creationTime:desc");
  });
});
