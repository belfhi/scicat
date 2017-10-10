import { Action, Store } from '@ngrx/store';
import { Actions, Effect, toPayload } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as lb from 'shared/sdk/models';

export const SAVE = '[DashboardUI] Save';
export const RESTORE = '[DashboardUI] Restore';

export class SaveAction implements Action {
  readonly type = SAVE;

  constructor(public payload?: any) { }
}
export class RestoreAction implements Action {
  readonly type = RESTORE;

  constructor() { }
}
export type Actions =
  SaveAction |
  RestoreAction;
