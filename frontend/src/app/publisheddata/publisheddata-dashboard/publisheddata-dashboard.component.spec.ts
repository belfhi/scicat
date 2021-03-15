import {
  ComponentFixture,
  TestBed,
  inject,
  waitForAsync,
} from "@angular/core/testing";

import { PublisheddataDashboardComponent } from "./publisheddata-dashboard.component";
import { MockStore } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { StoreModule, Store } from "@ngrx/store";
import { Router } from "@angular/router";
import {
  CheckboxEvent,
  PageChangeEvent,
  SortChangeEvent,
} from "shared/modules/table/table.component";
import {
  changePageAction,
  sortByColumnAction,
} from "state-management/actions/published-data.actions";
import { PublishedData } from "shared/sdk";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { of } from "rxjs";
import { Message, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";

describe("PublisheddataDashboardComponent", () => {
  let component: PublisheddataDashboardComponent;
  let fixture: ComponentFixture<PublisheddataDashboardComponent>;

  const router = {
    navigateByUrl: jasmine.createSpy("navigateByUrl"),
  };
  let store: MockStore;
  let dispatchSpy;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        declarations: [PublisheddataDashboardComponent],
        imports: [StoreModule.forRoot({})],
      });
      TestBed.overrideComponent(PublisheddataDashboardComponent, {
        set: {
          providers: [{ provide: Router, useValue: router }],
        },
      });
      TestBed.compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(PublisheddataDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onShareClick()", () => {
    it("should copy the selected DOI's to the users clipboard and dispatch a showMessageAction", () => {
      const commandSpy = spyOn(document, "execCommand");
      dispatchSpy = spyOn(store, "dispatch");

      const message = new Message();
      message.content = "The selected DOI's have been copied to your clipboard";
      message.type = MessageType.Success;
      message.duration = 5000;

      component.onShareClick();

      expect(commandSpy).toHaveBeenCalledTimes(1);
      expect(commandSpy).toHaveBeenCalledWith("copy");
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(showMessageAction({ message }));
    });
  });

  describe("#onPageChange()", () => {
    it("should dispatch a changePageAction action", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: PageChangeEvent = {
        pageIndex: 0,
        pageSize: 25,
        length: 25,
      };
      component.onPageChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        changePageAction({ page: event.pageIndex, limit: event.pageSize })
      );
    });
  });

  describe("#onSortChange()", () => {
    it("should dispatch a sortByColumnAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const event: SortChangeEvent = {
        active: "title",
        direction: "asc",
      };
      component.onSortChange(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        sortByColumnAction({ column: event.active, direction: event.direction })
      );
    });
  });

  describe("#onRowClick", () => {
    it("should navigate to a Published Dataset", () => {
      const published = new PublishedData();
      const id = encodeURIComponent(published.doi);
      component.onRowClick(published);

      expect(router.navigateByUrl).toHaveBeenCalledTimes(1);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        "/publishedDatasets/" + id
      );
    });
  });

  describe("#onSelectAll()", () => {
    it("should add all DOI's to selectedDOIs if checked is true", () => {
      const published = new PublishedData({
        doi: "test",
        creator: ["test"],
        publisher: "test",
        publicationYear: 2021,
        title: "test",
        abstract: "test",
        dataDescription: "test",
        resourceType: "test",
        pidArray: [],
      });

      spyOn(component.publishedData$, "pipe").and.returnValue(of([published]));

      const event = {
        checked: true,
      } as MatCheckboxChange;

      component.onSelectAll(event);

      expect(component.selectedDOIs.length).toEqual(1);
    });

    it("should remove all DOI's from selectedDOIs if checked is false", () => {
      component.selectedDOIs.push(
        component.doiBaseUrl + "test1",
        component.doiBaseUrl + "test2"
      );

      const event = {
        checked: false,
      } as MatCheckboxChange;

      component.onSelectAll(event);

      expect(component.selectedDOIs.length).toEqual(0);
    });
  });

  describe("#onSelectOne()", () => {
    it("should add the selected DOI to selectedDOIs if checked is true", () => {
      const checkboxEvent: CheckboxEvent = {
        event: { checked: true } as MatCheckboxChange,
        row: { doi: "test" },
      };

      component.onSelectOne(checkboxEvent);

      expect(component.selectedDOIs).toContain(
        component.doiBaseUrl + checkboxEvent.row.doi
      );
    });

    it("should remove the deselected DOI from selectedDOIs if checked is false", () => {
      const checkboxEvent: CheckboxEvent = {
        event: { checked: false } as MatCheckboxChange,
        row: { doi: "test" },
      };

      component.selectedDOIs.push(component.doiBaseUrl + checkboxEvent.row.doi);

      component.onSelectOne(checkboxEvent);

      expect(component.selectedDOIs.length).toEqual(0);
    });
  });
});
