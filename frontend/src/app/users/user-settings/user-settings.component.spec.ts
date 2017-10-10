import {NO_ERRORS_SCHEMA} from '@angular/core';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {Store, StoreModule} from '@ngrx/store';
import {NguiDatetimePickerModule} from '@ngui/datetime-picker';
import {
  ConfigFormComponent
} from 'shared/components/config-form/config-form.component';
import {MockConfigService, MockStore, MockUserApi} from 'shared/MockStubs';
import {ObjKeysPipe, TitleCasePipe} from 'shared/pipes/index';
import {UserApi} from 'shared/sdk/services';
import {ConfigService} from '../../shared/services';

import {UserSettingsComponent} from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let fixture: ComponentFixture<UserSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas : [ NO_ERRORS_SCHEMA ],
      imports : [
        ReactiveFormsModule, NguiDatetimePickerModule, StoreModule.forRoot({})
      ],
      declarations : [
        UserSettingsComponent, ConfigFormComponent, ObjKeysPipe, TitleCasePipe
      ],
    });
    TestBed.overrideComponent(UserSettingsComponent, {
      set : {
        providers : [
          // needed for config form sub component
          {provide : ConfigService, useClass : MockConfigService},
          {provide : Store, useClass : MockStore},
          {provide : UserApi, useClass : MockUserApi}
        ]
      }
    });
    TestBed.compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => { expect(component).toBeTruthy(); });

  // NOTE this test could be written inside the dataset form by changing the
  // enabled flag and passing mock data, maybe this is better?
  it('should have enabled form fields', () => {
    const compiled = fixture.debugElement.nativeElement;
    // expect(compiled.querySelector('input').getAttribute("disabled")).toBeNull();
  });

  it('should not have a submission or update button', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('button')).toBeTruthy();
  });
});
