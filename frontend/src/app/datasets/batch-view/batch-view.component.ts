import { Component, OnInit, OnDestroy } from "@angular/core";
import { Store } from "@ngrx/store";
import { first, switchMap } from "rxjs/operators";

import { selectDatasetsInBatch } from "state-management/selectors/datasets.selectors";
import {
  appendToDatasetArrayFieldAction,
  clearBatchAction,
  prefillBatchAction,
  removeFromBatchAction,
} from "state-management/actions/datasets.actions";
import { Dataset, Message, MessageType } from "state-management/models";
import { showMessageAction } from "state-management/actions/user.actions";
import { DialogComponent } from "shared/modules/dialog/dialog.component";

import { Router } from "@angular/router";
import { ArchivingService } from "../archiving.service";
import { Observable, Subscription } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ShareDialogComponent } from "datasets/share-dialog/share-dialog.component";
import { AppConfigService } from "app-config.service";

@Component({
  selector: "batch-view",
  templateUrl: "./batch-view.component.html",
  styleUrls: ["./batch-view.component.scss"],
})
export class BatchViewComponent implements OnInit, OnDestroy {
  batch$: Observable<Dataset[]> = this.store.select(selectDatasetsInBatch);
  subscriptions: Subscription[] = [];

  appConfig = this.appConfigService.getConfig();
  shareEnabled = this.appConfig.shareEnabled;

  datasetList: Dataset[] = [];
  public hasBatch = false;
  visibleColumns: string[] = ["remove", "pid", "sourceFolder", "creationTime"];

  constructor(
    public appConfigService: AppConfigService,
    private dialog: MatDialog,
    private store: Store,
    private archivingSrv: ArchivingService,
    private router: Router
  ) {}

  private clearBatch() {
    this.store.dispatch(clearBatchAction());
  }

  onEmpty() {
    const msg =
      "Are you sure that you want to remove all datasets from the batch?";
    if (confirm(msg)) {
      this.clearBatch();
    }
  }

  onRemove(dataset: Dataset) {
    this.store.dispatch(removeFromBatchAction({ dataset }));
  }

  onPublish() {
    this.router.navigate(["datasets", "batch", "publish"]);
  }

  onShare() {
    const dialogRef = this.dialog.open(ShareDialogComponent, {
      width: "500px",
    });
    dialogRef.afterClosed().subscribe((result: Record<string, string[]>) => {
      if (result && result.users && result.users.length > 0) {
        this.datasetList.forEach((dataset) => {
          this.store.dispatch(
            appendToDatasetArrayFieldAction({
              pid: encodeURIComponent(dataset.pid),
              fieldName: "sharedWith",
              data: result.users,
            })
          );
          const message = new Message(
            "Datasets successfully shared!",
            MessageType.Success,
            5000
          );
          this.store.dispatch(showMessageAction({ message }));
        });
      }
    });
  }

  onArchive() {
    this.batch$
      .pipe(
        first(),
        switchMap((datasets) => this.archivingSrv.archive(datasets))
      )
      .subscribe(
        () => this.clearBatch(),
        (err) =>
          this.store.dispatch(
            showMessageAction({
              message: {
                type: MessageType.Error,
                content: err.message,
                duration: 5000,
              },
            })
          )
      );
  }

  onRetrieve() {
    let dialogOptions = this.archivingSrv.retriveDialogOptions(
      this.appConfig.retrieveDestinations
    );
    const dialogRef = this.dialog.open(DialogComponent, dialogOptions);
    const destPath = { destinationPath: "/archive/retrieve" };
    dialogRef.afterClosed().subscribe((result) => {
      if (result && this.datasetList) {
        const locationOption = this.archivingSrv.generateOptionLocation(
          result,
          this.appConfig.retrieveDestinations
        );
        const extra = { ...destPath, ...locationOption };
        this.archivingSrv.retrieve(this.datasetList, extra).subscribe(
          () => this.clearBatch(),
          (err) =>
            this.store.dispatch(
              showMessageAction({
                message: {
                  type: MessageType.Error,
                  content: err.message,
                  duration: 5000,
                },
              })
            )
        );
      }
    });
  }

  ngOnInit() {
    this.store.dispatch(prefillBatchAction());
    this.subscriptions.push(
      this.batch$.subscribe((result) => {
        if (result) {
          this.datasetList = result;
          this.hasBatch = result.length > 0;
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
