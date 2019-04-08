import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  options: FormGroup;

  constructor(fb: FormBuilder, private _appService: AppService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
  }

  myControl = new FormControl();
  families: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.families.filter(option => option.toLowerCase().includes(filterValue));
  }

  register() {
    this._appService.register(this.participant)
      .subscribe(data => {
        console.log(data);
        this.participant = new Participant();
        this.openSnackBar('Participant registered Successfully', 'OK', 'snack-success');
      },
        error => {
          console.log(error);
          if (error.status == 200){
            this.openSnackBar('Participant registered Successfully', 'OK', 'snack-success');
            return;
          }
          let msg = "Unauthorized for this action";
          if (error.status == 402) msg = 'Username or Participant ID already exists';
          else msg = "Unauthorized for this action";
          this.openSnackBar(msg, 'Dismiss', 'snack-fail');
        });
  }

  createRecord(){
    console.log(this.record);
    this._appService.getParticipant(this.record.family)
    .subscribe(data => {
      let p :any = data;
      console.log(p.length?"y":"n");      
      //console.log(p[0]._id);
    },
      error => {
        console.log(error)
        this.openSnackBar('Username or Password incorrect', 'Dismiss', 'snack-fail');
      });  

    // this._appService.createRecord(this.record)
    // .subscribe(data => {
    //   console.log(data);
    //   this._appService.setSession(this.username, data);
    //   this._appService.getRout();
    //   this.openSnackBar('Authorization succeeded', 'OK', 'snack-success');
    // },
    //   error => {
    //     console.log(error)
    //     this.openSnackBar('Username or Password incorrect', 'Dismiss', 'snack-fail');
    //   });    
    //a.toString
  }

  history(name) {
    console.log("history " + name);
    this.dialog.open(DetailDialogComponent, {
      data: {
        vaccineName: 'Chickenpox'
      }
    });
  }

  childBirthDate(event: MatDatepickerInputEvent<Moment>) {
    this.record.childBirthDate = event.value.valueOf()+"";
    let d: Date = new Date(event.value.year(), event.value.month(), event.value.day());
    console.log(d.toDateString());
    console.log(new Date(d.toDateString()).getFullYear());
    //console.log(this.getAge(d,));    
  }

  openSnackBar(msg, action, colorClass) {
    this.snackBar.open(msg, action, {
      duration: 2000,
      panelClass: colorClass
    });
  }
}
