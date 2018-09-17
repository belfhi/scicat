import { APP_CONFIG, AppConfigModule } from "app-config.module";
import { ArchivingService } from "../archiving.service";
import { DatasetTableComponent } from "./dataset-table.component";
import { FileSizePipe } from "../filesize.pipe";
import { HttpClient } from "@angular/common/http";
import { MatDialogModule, MatTableModule } from "@angular/material";
import { MockHttp, MockRouter } from "shared/MockStubs";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { Router } from "@angular/router";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { combineReducers, StoreModule } from "@ngrx/store";
import { datasetsReducer } from "state-management/reducers/datasets.reducer";
import { jobsReducer } from "state-management/reducers/jobs.reducer";

describe("DatasetTableComponent", () => {
  let component: DatasetTableComponent;
  let fixture: ComponentFixture<DatasetTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        MatTableModule,
        MatDialogModule,
        StoreModule.forRoot({
          datasets: datasetsReducer,
          root: combineReducers({
            jobs: jobsReducer
          })
        }),
        AppConfigModule
      ],
      declarations: [DatasetTableComponent, FileSizePipe]
    });
    TestBed.overrideComponent(DatasetTableComponent, {
      set: {
        providers: [
          { provide: HttpClient, useClass: MockHttp },
          { provide: Router, useClass: MockRouter },
          {
            provide: APP_CONFIG,
            useValue: {
              disabledDatasetColumns: [],
              archiveWorkflowEnabled: true
            }
          },
          { provide: ArchivingService, useClass: ArchivingService }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should contain mode switching buttons", () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector(".archive")).toBeTruthy();
    expect(compiled.querySelector(".archive").textContent).toContain("Archive");
    expect(compiled.querySelector(".retrieve")).toBeTruthy();
    expect(compiled.querySelector(".retrieve").textContent).toContain(
      "Retrieve"
    );
    expect(compiled.querySelector(".view")).toBeTruthy();
    expect(compiled.querySelector(".view").textContent).toContain("View");
  });

  it("should contain an export button", () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelectorAll(".export-csv")).toBeTruthy();
  });
});
