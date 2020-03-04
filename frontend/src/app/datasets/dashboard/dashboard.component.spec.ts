import { APP_CONFIG } from "app-config.module";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import {
  async,
  ComponentFixture,
  TestBed,
  inject
} from "@angular/core/testing";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, StoreModule } from "@ngrx/store";
import {
  MatDialogModule,
  MatDialog,
  MatCheckboxChange,
  MatSidenav
} from "@angular/material";
import {
  MockActivatedRoute,
  MockRouter,
  MockStore
} from "../../shared/MockStubs";
import { DashboardComponent } from "./dashboard.component";
import { of } from "rxjs";
import {
  addDatasetAction,
  fetchMetadataKeysAction
} from "state-management/actions/datasets.actions";
import { User, Dataset } from "shared/sdk";
import {
  selectColumnAction,
  deselectColumnAction
} from "state-management/actions/user.actions";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { SelectColumnEvent } from "datasets/dataset-table-settings/dataset-table-settings.component";
import { provideMockStore } from "@ngrx/store/testing";
import { getSelectedDatasets } from "state-management/selectors/datasets.selectors";
import { TableColumn } from "state-management/models";
import { getColumns } from "state-management/selectors/user.selectors";

class MockMatDialog {
  open() {
    return {
      afterClosed: () =>
        of({
          datasetName: "Test Name",
          description: "Test description",
          ownerGroup: "test",
          sourceFolder: "/nfs/test",
          usedSoftware: "test software"
        })
    };
  }
}

describe("DashboardComponent", () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let store: MockStore;
  let dispatchSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        BrowserAnimationsModule,
        MatDialogModule,
        StoreModule.forRoot({})
      ],
      declarations: [DashboardComponent, MatSidenav],
      providers: [
        provideMockStore({
          selectors: [
            { selector: getSelectedDatasets, value: [] },
            { selector: getColumns, value: [] }
          ]
        })
      ]
    });
    TestBed.overrideComponent(DashboardComponent, {
      set: {
        providers: [
          { provide: APP_CONFIG, useValue: { shoppingCartOnHeader: "true" } },
          { provide: ActivatedRoute, useClass: MockActivatedRoute },
          { provide: MatDialog, useClass: MockMatDialog },
          { provide: Router, useClass: MockRouter }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([Store], (mockStore: MockStore) => {
    store = mockStore;
  }));

  afterEach(() => {
    jasmine.clock().uninstall();
    fixture.destroy();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("#onSettingsClick()", () => {
    it("should toggle the sideNav", () => {
      const toggleSpy = spyOn(component.sideNav, "toggle");

      component.onSettingsClick();

      expect(toggleSpy).toHaveBeenCalled();
    });
  });

  describe("#onCloseClick()", () => {
    it("should close the sideNav", () => {
      const closeSpy = spyOn(component.sideNav, "close");

      component.onCloseClick();

      expect(closeSpy).toHaveBeenCalled();
    });
  });

  describe("#onColumnSearch()", () => {
    it("should dispatch a fetchMetadataKeysAction", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const metadataKey = "test";
      component.onColumnSearch(metadataKey);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        fetchMetadataKeysAction({ metadataKey })
      );
    });
  });

  describe("#onSelectColumn()", () => {
    const column: TableColumn = {
      name: "test",
      order: 0,
      type: "standard",
      enabled: false
    };

    it("should dispatch a selectColumnAction if checkBoxChange.checked is true", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const checkBoxChange = {
        checked: true
      } as MatCheckboxChange;

      const event: SelectColumnEvent = {
        checkBoxChange,
        column
      };

      component.onSelectColumn(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        selectColumnAction({ name: column.name, columnType: column.type })
      );
    });

    it("should dispatch a deselectColumnAction if checkBoxChange.checked is false", () => {
      dispatchSpy = spyOn(store, "dispatch");

      const checkBoxChange = {
        checked: false
      } as MatCheckboxChange;

      const event: SelectColumnEvent = {
        checkBoxChange,
        column
      };

      component.onSelectColumn(event);

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(
        deselectColumnAction({ name: column.name, columnType: column.type })
      );
    });
  });

  describe("#openDialog()", () => {
    it("should dispatch an addDatasetAction when dialog returns a value", () => {
      jasmine.clock().install();
      jasmine.clock().mockDate(new Date(2019, 12, 17, 12, 0, 0));

      dispatchSpy = spyOn(store, "dispatch");

      const currentUser = new User({
        id: "testId",
        username: "ldap.Test User",
        email: "test@email.com",
        realm: "test",
        emailVerified: true,
        password: "testPassword",
        accessTokens: [],
        identities: [],
        credentials: []
      });

      const dataset = new Dataset({
        accessGroups: [],
        contactEmail: currentUser.email,
        createdBy: currentUser.username,
        creationTime: new Date(),
        datasetName: "Test Name",
        description: "Test description",
        isPublished: false,
        keywords: [],
        owner: currentUser.username.replace("ldap.", ""),
        ownerEmail: currentUser.email,
        ownerGroup: "test",
        packedSize: 0,
        size: 0,
        sourceFolder: "/nfs/test",
        type: "derived"
      });
      dataset["inputDatasets"] = [];
      dataset["investigator"] = currentUser.email;
      dataset["scientificMetadata"] = {};
      dataset["usedSoftware"] = ["test software"];

      component.currentUser = currentUser;
      component.userGroups = ["test"];

      component.openDialog();

      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith(addDatasetAction({ dataset }));
    });
  });
});
