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
import { Record_fetch, Detail_fetch, Detail, Detail_history } from '../vaccine.model';
export interface Record {
  name: string;
  childGender: string;
}
export interface Detail {
  name: string;
  age: string;
}
@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {


  records: Record_fetch[];
  records_history: Record_fetch[];
  detail = new Detail();
  detailHistories = ["01/05/2019", "12/11/2018", "07/05/2011", "22/12/2012"]


  participants = Participants;
  options: FormGroup;
  isLoading: boolean = false;
  familyUsername;
  familyUsername_history;
  isFamily = false;
  doctorUsername;
  physicianUsername;
  historyFamilyUsername;
  constructor(fb: FormBuilder, private _appService: AppService, public dialog: MatDialog,
    private snackBar: MatSnackBar) {
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
    this._appService.getRcords(this.familyUsername, Participants.Hospital)
      .subscribe(data => {
        this.records = data as Record_fetch[];
        this.isFamily = true;
        if (!this.records.length) {
          this.isFamily = false;
          this.openSnackBar("Unauthorized to any records by this family", 'Dismiss', 'snack-fail');
        }
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

  detailDialog(name) {
    console.log("history " + name);
    this.dialog.open(DetailDialogComponent, {
      // height: '400px',
      // width: '600px',
      data: {
        vaccineName: 'Chickenpox'
      }
    });
  }

  history(name) {
    console.log("history " + name);
    this.dialog.open(DetailDialogComponent, {
      // height: '400px',
      // width: '600px',
      data: {
        vaccineName: 'Chickenpox'
      }
    });
  }

  createDetailClick(recordId: string) {
    ///////////////// record RESET!!

    this._appService.setLoading(true);
    this._appService.getParticipant(this.doctorUsername, Participants.Doctor)
      .subscribe(data => {
        let p: any = data;
        console.log(p.length ? "y" : "n");

        if (p.length) {
          this.checkPhysician(p[0]._id, recordId);
        } else {
          this._appService.setLoading(false);
          this.openSnackBar(Participants.Doctor+" username not found", 'Dismiss', 'snack-fail');
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

  checkPhysician(doctorId:string, recordId: string){
    this._appService.getParticipant(this.physicianUsername, Participants.Physician)
      .subscribe(data => {
        let p: any = data;
        console.log(p.length ? "y" : "n");

        if (p.length) {
          this.createDetail(recordId, doctorId, p[0]._id);
        } else {
          this._appService.setLoading(false);
          this.openSnackBar(Participants.Physician+" username not found", 'Dismiss', 'snack-fail');
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

  createDetail(recordId: string, doctorId:string, physicianId:string) {
    this.detail.doc = doctorId;
    this.detail.physician = physicianId;
    console.log(this.detail);
    this._appService.createDetail(recordId, this.detail)
    .subscribe(data => {
      console.log(data);
      this._appService.setLoading(false);
      this.openSnackBar('Record created Successfully', 'OK', 'snack-success');
    },
      error => {
        console.log(error);
        this._appService.setLoading(false);
        this.openSnackBar(error.error.responses[0].error.message, 'Dismiss', 'snack-fail');
      });
  }

  getRecordClick_history() {
    this._appService.setLoading(true);
    this._appService.getParticipant(this.historyFamilyUsername, Participants.Family)
      .subscribe(data => {
        let p: any = data;
        console.log(p.length ? "y" : "n");

        if (p.length) {
          this.getRecords_history();
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

  getRecords_history() {
    this._appService.getRcords(this.historyFamilyUsername, Participants.Hospital)
      .subscribe(data => {
        this.records_history = data as Record_fetch[];
        console.log(this.records_history);
        this.isFamily = true;
        if (!this.records_history.length) {
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
    for (let i in this.records_history) {
      console.log(this.records_history[i]);
      this._appService.getDetails(this.records_history[i]._id)
        .subscribe(data => {
          this.records_history[i]._vaccineDetails = data as Detail_fetch[];
          console.log(this.records_history);
          this._appService.setLoading(false);
          for (let j in this.records_history[i]._vaccineDetails) {
            console.log(this.records_history[i]._vaccineDetails[j]);
            this._appService.getDetail_history(this.records_history[i]._vaccineDetails[j]._id)
              .subscribe(data => {
                this.records_history[i]._vaccineDetails[j]._history = data as Detail_history[];
                console.log(this.records_history[i]._vaccineDetails[j]._history);
                
              },
                error => {
                  console.log(error);
                  this._appService.setLoading(false);
                  this.openSnackBar(error.error.responses[0].error.message, 'Dismiss', 'snack-fail');
                  return;
                });
          }
        },
          error => {
            console.log(error);
            this._appService.setLoading(false);
            this.openSnackBar(error.error.responses[0].error.message, 'Dismiss', 'snack-fail');
            return;
          });
    }

  }

  showHistory(history: Detail_history) {
    console.log(history);
    this.dialog.open(DetailDialogComponent, {
      width:"800px",
      data: {
        history: history
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
