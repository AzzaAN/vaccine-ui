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
export interface Record {
  name: string;
  childGender: string;
}
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

  records: Record[] = [
    {
      name: 'Ahmad',
      childGender: "Male",
    },
    {
      name: 'Sarah',
      childGender: "Female",
    }
  ];

  details: Detail[] = [
    {
      name: "BCG, Hepatitis B",
      age: "At birth"
    },
    {
      name: "IPV, Dtap",
      age: "2 months."
    },
    {
      name: "HIP, Rota, PVC",
      age: "4 months."
    }
  ];


  participants = Participants;
  options: FormGroup;

  constructor(fb: FormBuilder, private appService: AppService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.options = fb.group({
      hideRequired: false,
      floatLabel: 'auto',
    });
    console.log(this.appService.getUsername());
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

  giveAccess(){
    
  }

  openSnackBar() {
    this.snackBar.open('Hospital username incorrect', 'Dismiss', {
      //duration: 2000,
    });
  }

}
