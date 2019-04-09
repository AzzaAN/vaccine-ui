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
import { Record, Record_fetch, Detail_fetch } from '../vaccine.model';
// export interface Record {
//   name: string;
//   childGender: string;
// }
export interface Detail {
  name: string;
  age: string;
}
@Component({
  selector: 'app-family',
  templateUrl: './family.component.html',
  styleUrls: ['./family.component.css']
})
export class FamilyComponent implements OnInit {

  records: Record_fetch[];
  details: Detail_fetch[];

  hospital_permission;
  school_permission;
  insurance_permission;
  participants = Participants;
  options: FormGroup;
  isLoading: boolean = false;
  familyUsername;
  constructor(fb: FormBuilder, private _appService: AppService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this._appService.isLoading.subscribe(isLoading => this.isLoading = isLoading);
    this.familyUsername = this._appService.getUsername();
    this._appService.setLoading(true);
    this._appService.getRcords(this.familyUsername, Participants.Family)
      .subscribe(data => {
        this.records = data as Record_fetch[];
        console.log(this.records);
        //this._appService.setLoading(false);
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

  givePermission(recordId, participantUsername:string, type: Participants) {

    console.log(participantUsername, type);
    console.log(recordId);
    this._appService.setLoading(true);
    this._appService.getParticipant(participantUsername, type)
      .subscribe(data => {
        let p: any = data;
        console.log(p.length ? "y" : "n");

        if (p.length) {
          this.recordPermission(recordId, p[0]._id, type);
        } else {
          this._appService.setLoading(false);
          this.openSnackBar(type+" username not found", 'Dismiss', 'snack-fail');
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

  recordPermission(recordId:string, ParticipantId :string, type: Participants){
    this._appService.recordPermission(recordId, ParticipantId, type)
    .subscribe(data => {
      console.log(data);
      this.openSnackBar('Permission changed Successully', 'OK', 'snack-success');
      this._appService.setLoading(false);
    },
      error => {
        console.log(error);
        this._appService.setLoading(false);
        this.openSnackBar(error.error.responses[0].error.message, 'Dismiss', 'snack-fail');
        return;
      });
  }


  showDetail(detail){
    this.dialog.open(DetailDialogComponent, {
      width:"800px",
      data: {
        history: detail
      }
    });

  }

  openSnackBar(msg, action, colorClass) {
    this.snackBar.open(msg, action, {
      duration: 2000,
      panelClass: colorClass
    });
  }

}
