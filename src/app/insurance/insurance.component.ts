import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Participants } from '../Participants';
import { MatDatepickerInputEvent, MatDialog, MatSnackBar } from '@angular/material';
import { Moment } from 'moment';
import { AppService } from '../app.service';
import { DetailDialogComponent } from '../detail-dialog/detail-dialog.component';
import { Detail_fetch, Record_fetch } from '../vaccine.model';
export interface Record {
  name: string;
  childGender: string;
}
export interface Detail {
  name: string;
  age: string;
}
@Component({
  selector: 'app-insurance',
  templateUrl: './insurance.component.html',
  styleUrls: ['./insurance.component.css']
})
export class InsuranceComponent implements OnInit {
  records: Record_fetch[];
  details: Detail_fetch[];


  participants = Participants;
  options: FormGroup;
  isFamily = false;
  familyUsername;
  isLoading: boolean = false;
  constructor(fb: FormBuilder, private _appService: AppService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  ngOnInit() {
    this._appService.isLoading.subscribe(isLoading => this.isLoading = isLoading);
  }

  getRecordClick() {
    this._appService.setLoading(true);
    this._appService.getParticipant(this.familyUsername, Participants.Family)
      .subscribe(data => {
        let p: any = data;
        console.log(p.length ? "y" : "n");

        if (p.length) {
          this.getRecords();
        } else {
          this._appService.setLoading(false);
          this.openSnackBar(Participants.Family + " username not found", 'Dismiss', 'snack-fail');
          return;
        }
      },
        error => {
          console.log(error);
          this._appService.setLoading(false);
          this.openSnackBar(error.error.responses[0].error.message, 'Dismiss', 'snack-fail');
          return;
        });
  }

  getRecords() {
    this._appService.getRcords(this.familyUsername, Participants.Insurance)
      .subscribe(data => {
        this.records = data as Record_fetch[];
        console.log(this.records);
        this.isFamily = true;
        if (!this.records.length) {
          this.isFamily = false;
          this._appService.setLoading(false);
          this.openSnackBar("Unauthorized to any records by this family", 'Dismiss', 'snack-fail');
          return;
        }
        this.getDetails();
      },
        error => {
          console.log(error);
          this._appService.setLoading(false);
          this.openSnackBar(error.error.responses[0].error.message, 'Dismiss', 'snack-fail');
          return;
        });
  }

  getDetails() {
    for (let i in this.records) {
      console.log(this.records[i]);
      this._appService.getDetails(this.records[i]._id)
        .subscribe(data => {
          this.records[i]._vaccineDetails = data as Detail_fetch[];
          console.log(this.records);
          this._appService.setLoading(false);
        },
          error => {
            console.log(error);
            this._appService.setLoading(false);
            this.openSnackBar(error.error.responses[0].error.message, 'Dismiss', 'snack-fail');
            return;
          });
    }

  }

  openSnackBar(msg, action, colorClass) {
    this.snackBar.open(msg, action, {
      duration: 2000,
      panelClass: colorClass
    });
  }

}
