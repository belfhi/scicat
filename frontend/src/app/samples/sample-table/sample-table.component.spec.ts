import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SampleTableComponent } from "./sample-table.component";
import { Store } from "@ngrx/store";
import { MatCardModule, MatDialog, MatIconModule, MatTableModule } from "@angular/material";
import { MockHttp, MockRouter,  MockStore } from "../../shared/MockStubs";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { SampleService } from "../sample.service";
import { APP_CONFIG } from "app-config.module";

describe("SampleTableComponent", () => {
  let component: SampleTableComponent;
  let fixture: ComponentFixture<SampleTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SampleTableComponent],
      imports: [MatTableModule, MatCardModule, MatIconModule],
      providers: [
        {
          provide: APP_CONFIG,
          useValue: {
            editSampleEnabled: true
          }
        },
        { provide: MatDialog, useValue: {} }
      ]
    });
    TestBed.overrideComponent(SampleTableComponent, {
      set: {
        providers: [
          { provide: HttpClient, useClass: MockHttp },
          { provide: Router, useClass: MockRouter },
          { provide: SampleService, useClass: {} },
          { provide: Store, useClass: MockStore }
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
