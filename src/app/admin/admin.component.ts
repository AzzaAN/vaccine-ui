import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith, partition } from 'rxjs/operators';
import { Participants } from '../Participants';
import { MatDatepickerInputEvent, MatDialog, MatSnackBar } from '@angular/material';
import { Moment } from 'moment';
import { AppService } from '../app.service';
import { DetailDialogComponent } from '../detail-dialog/detail-dialog.component';
import { Participant, Record } from '../vaccine.model';

export interface Record {
  name: string;
  childGender: string;
}
export interface Detail {
  name: string;
  age: string;
}


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  participant = new Participant();

  record = new Record();

  recordFamilyUsername;
  recordChildName;
  recordChildGender;
  recordChildBirthDate;

  historyFamilyUsername;




  // records: Record[] = [
  //   {
  //     name: 'Ahmad',
  //     childGender: "Male",
  //   },
  //   {
  //     name: 'Sarah',
  //     childGender: "Female",
  //   }
  // ];

  // details: Detail[] = [
  //   {
  //     name: "BCG, Hepatitis B",
  //     age: "At birth"
  //   },
  //   {
  //     name: "IPV, Dtap",
  //     age: "2 months."
  //   },
  //   {
  //     name: "HIP, Rota, PVC",
  //     age: "4 months."
  //   }
  // ];

  detailHistories = ["01/05/2017", "12/06/2018", "07/07/2018", "22/12/2018"]

  participants = Participants;
  registerGroup: FormGroup;
  recordGroup: FormGroup;
  options: FormGroup;
  isLoading: boolean = false;
  isDateValid: boolean = false;
  childBirthDate;
  constructor(fb: FormBuilder, private _appService: AppService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });

    this.registerGroup = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
      type: ['', Validators.required],
      username: ['', Validators.required],
      fullname: ['', Validators.required],
      participantId: ['', Validators.required],
      hospital: ['']
    });

    this.recordGroup = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
      family: ['', Validators.required],
      childName: ['', Validators.required],
      childBirthDate: ['', Validators.required],
      childGender: ['', Validators.required]
    });
  }

  get family() {
    return this.recordGroup.controls.family.value;
  }
  get childName() {
    return this.recordGroup.controls.childName.value;
  }
  get childGender() {
    return this.recordGroup.controls.childGender.value;
  }
  onTypeChange(event) {
    let fb: FormBuilder = new FormBuilder();
    if (this.type_register == Participants.Doctor || this.type_register == Participants.Physician) {
      console.log(this.type_register);
      this.registerGroup.setControl("hospital", fb.control('', Validators.required))
    }
    else
      this.registerGroup.setControl("hospital", fb.control('', Validators.nullValidator))

    console.log(this.registerGroup);
  }
  get type_register() {
    return this.registerGroup.controls.type.value;
  }
  get username_register() {
    return this.registerGroup.controls.username.value;
  }
  get fullname_register() {
    return this.registerGroup.controls.fullname.value;
  }
  get participantId_register() {
    return this.registerGroup.controls.participantId.value;
  }
  get hospital_register() {
    return this.registerGroup.controls.hospital.value;
  }

  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this._appService.isLoading.subscribe(isLoading => this.isLoading = isLoading);
  }

  register() {
    console.log(this.registerGroup);
    if (this.registerGroup.invalid) return;
    this.participant = {
      type: this.type_register,
      username: this.username_register,
      fullname: this.fullname_register,
      participantId: this.participantId_register,
      hospital: this.hospital_register || "none"
    }
    this._appService.setLoading(true);

    this._appService.getParticipant(this.participant.hospital, Participants.Hospital)
      .subscribe(data => {
        let p: any = data;
        console.log(p.length ? "y" : "n");

        if (p.length || (this.type_register != Participants.Doctor && this.type_register != Participants.Physician)) {
          this.participant.hospital = p.length ? p[0]._id : "none";
          console.log(this.participant);
          this.registerParticipant();
        } else {
          this._appService.setLoading(false);
          this.openSnackBar("Hospital username not found", 'Dismiss', 'snack-fail');
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

  registerParticipant() {
    this._appService.register(this.participant)
      .subscribe(data => {
        console.log(data);
        this.participant = new Participant();
        this._appService.setLoading(false);
        this.openSnackBar('Participant registered Successfully', 'OK', 'snack-success');
      },
        error => {
          console.log(error);
          this._appService.setLoading(false);
          if (error.status == 200) {
            this.openSnackBar('Participant registered Successfully', 'OK', 'snack-success');
            return;
          }
          this.openSnackBar(error.error.responses[0].error.message, 'Dismiss', 'snack-fail');
        });
  }

  createRecordClick() {
    console.log(this.recordGroup);
    if (this.recordGroup.invalid) return;
    else if (!this.isDateValid) {
      this.openSnackBar("Brith date is invalid", 'Dismiss', 'snack-fail');
      return;
    }

    this._appService.setLoading(true);


    console.log(this.record);

    this._appService.getParticipant(this.family, Participants.Family)
      .subscribe(data => {
        let p: any = data;
        console.log(p.length ? "y" : "n");

        if (p.length) {

          this.record = {
            family: p[0]._id,
            childName: this.childName,
            childGender: this.childGender,
            childBirthDate: this.childBirthDate
          }
          console.log(this.record);
          this.createRecord();
        } else {
          this._appService.setLoading(false);
          this.openSnackBar("Family username not found", 'Dismiss', 'snack-fail');
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

  createRecord() {
    this._appService.createRecord(this.record)
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

  history(name) {
    console.log("history " + name);
    this.dialog.open(DetailDialogComponent, {
      data: {
        vaccineName: 'Chickenpox'
      }
    });
  }

  childBirthDateChange(event: MatDatepickerInputEvent<Moment>) {
    try {
      this.childBirthDate = event.value.valueOf() + "";
      this.isDateValid = true;
    } catch (e) {
      console.log(e);
      this.isDateValid = false;

    }
  }

  openSnackBar(msg, action, colorClass) {
    this.snackBar.open(msg, action, {
      duration: 2000,
      panelClass: colorClass
    });
  }
}
