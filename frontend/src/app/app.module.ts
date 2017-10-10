import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NguiDatetimePickerModule } from '@ngui/datetime-picker';
import { AppRoutingModule } from 'app-routing/app-routing.module';
import { DatasetService } from 'datasets/dataset.service';
import { DatasetsModule } from 'datasets/datasets.module';
import { EndOfShiftComponent } from 'end-of-shift/end-of-shift.component';
import { JobsComponent } from 'jobs/jobs.component';
import { localStorageSync } from 'ngrx-store-localstorage';
import {
    AutoCompleteModule,
    CheckboxModule,
    DataTableModule,
    DropdownModule,
    SharedModule,
    TabViewModule,
    TreeModule,
    TreeTableModule,
} from 'primeng/primeng';
import { SampleDataFormComponent } from 'sample-data-form/sample-data-form.component';
import { SDKBrowserModule } from 'shared/sdk/index';
import { UserApi } from 'shared/sdk/services';
import { SharedCatanieModule } from 'shared/shared.module';
import { DatasetEffects } from 'state-management/effects/datasets.effects';
import { UserEffects } from 'state-management/effects/user.effects';
import { JobsEffects } from 'state-management/effects/jobs.effects';
import { rootReducer } from 'state-management/reducers/root.reducer';
import { UsersModule } from 'users/users.module';

import { AppComponent } from './app.component';
import { AuthCheck } from './AuthCheck';

export function localStorageSyncWrapper(reducer: any) {
  return localStorageSync({keys: ['root'], rehydrate: true}) (reducer);
}

@NgModule({
  declarations : [
    AppComponent,
    EndOfShiftComponent,
    JobsComponent,
    SampleDataFormComponent
  ],
  imports : [
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    CheckboxModule,
    ReactiveFormsModule,
    HttpModule,
    DataTableModule, SharedModule, TreeModule, TabViewModule, AutoCompleteModule, DropdownModule,
    BrowserAnimationsModule, TreeTableModule, SharedCatanieModule,
    NguiDatetimePickerModule,
    DatasetsModule,
    UsersModule,
    SDKBrowserModule.forRoot(),
    // StoreModule.forRoot({router: routerReducer, root: rootReducer}, {metaReducers: [localStorageSyncWrapper]}),
    StoreModule.forRoot({router: routerReducer, root: rootReducer}),
    StoreDevtoolsModule.instrument({
      maxAge: 25 //  Retains last 25 states
    }),
    EffectsModule.forRoot([DatasetEffects, UserEffects, JobsEffects]),
    StoreRouterConnectingModule
  ],
  exports: [
  ],
  providers : [
      AuthCheck,
      DatasetService,
      UserApi,
    //      {provide: RouteReuseStrategy, useClass: CustomReuseStrategy}
  ],
  bootstrap : [ AppComponent ]
})
export class AppModule {
}
