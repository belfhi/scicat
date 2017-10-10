import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, StoreModule } from '@ngrx/store';
import { AutoCompleteModule, DataTableModule, SharedModule, TreeModule } from 'primeng/primeng';
import { rootReducer } from 'state-management/reducers/root.reducer';
import { DatasetsFilterComponent } from 'datasets/datasets-filter/datasets-filter.component';
import { MockStore } from '../../shared/MockStubs';

describe('DatasetsFilterComponent', () => {
  let component: DatasetsFilterComponent;
  let fixture: ComponentFixture<DatasetsFilterComponent>;

  beforeEach(async(() => {
    TestBed
        .configureTestingModule({
          schemas : [ NO_ERRORS_SCHEMA ],
          imports : [
            TreeModule, AutoCompleteModule, SharedModule, DataTableModule,
            StoreModule.forRoot({rootReducer})
          ],
          declarations : [ DatasetsFilterComponent ],
          providers : [
            {provide : Store, useClass : MockStore},
          ]
        })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => { expect(component).toBeTruthy(); });
});
