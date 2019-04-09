import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-detail-dialog',
  templateUrl: './detail-dialog.component.html',
  styleUrls: ['./detail-dialog.component.css']
})
export class DetailDialogComponent{
  constructor(
    public dialogRef: MatDialogRef<DetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
      console.log(data);
    }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
