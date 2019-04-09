import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Participants } from './Participants';
import { defaultIterableDiffers } from '@angular/core/src/change_detection/change_detection';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Participant, Record, Detail } from './vaccine.model';
import { BehaviorSubject } from 'rxjs';
const currentUser = "currentUser";
@Injectable({
  providedIn: 'root'
})
export class AppService {
  readonly URL = 'http://localhost:3000/vaccine/';

  private isLoggedinBS = new BehaviorSubject(false);
  isLoggedin = this.isLoggedinBS.asObservable();

  private isLoadingBS = new BehaviorSubject(false);
  isLoading = this.isLoadingBS.asObservable();
  
  constructor(private _router: Router, private http: HttpClient) {
    //this.test().subscribe(data => console.log(data), error => console.log(error));
  }

  setLogin(isLoggedin: boolean) {
    this.isLoggedinBS.next(isLoggedin);
  }

  setLoading(isLoading: boolean) {
    this.isLoadingBS.next(isLoading);
  }

  getRcords(username: string, type: Participants) {

    console.log(username, type);
    let params = new HttpParams().append("username", username).append("type", type);

    return this.http.get(this.URL + 'get-records', { params });

  }

  getDetails(recordId: string) {

    let params = new HttpParams().append("recordId", recordId);

    return this.http.get(this.URL + 'get-details', { params });

  }

  getParticipant(username: string, type: Participants) {

    let params = new HttpParams().append("username", username).append("type", type);
    
    console.log(params);
    return this.http.get(this.URL + 'get-participant', { params });

  }

  createDetail(recordId: string, record: Detail) {

    let params = new HttpParams().append("recordId", recordId);

    let body = {
      id:"1",
      vaccineName: record.vaccineName,
    childAge: record.childAge,
    childTemperature: record.childTemperature,
    childWeight: record.childWeight,
    childHeight: record.childHeight,
    doc: record.doc,
    physician: record.physician
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.URL + 'create-detail', body, { params, headers });

  }

  recordPermission(recordId: string, participantId: string, type: Participants) {

    let body = {
      recordId:recordId,
      participantId: participantId,
      type: type
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.URL + 'record-permission', body, { headers });

  }

  createRecord(record: Record) {

    let body = {
      id:"1",
      family: record.family,
      childName: record.childName,
      childBirthDate: record.childBirthDate,
      childGender: record.childGender
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.URL + 'create-record', body, { headers });

  }

  register(participant: Participant) {

    let body = {
      type: participant.type,
      username: participant.username,
      fullname: participant.fullname,
      participantId: participant.participantId,
      hospital: participant.hospital
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.URL + 'register', body, { headers });

  }

  login(username: string, userId: string) {

    let body = {
      username: username,
      userId: userId
    };
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post(this.URL + 'login', body, { headers });

  }

  setSession(username, type) {
    localStorage.setItem(currentUser, JSON.stringify({ username: username, type: type }));
  }

  logout() {
    localStorage.removeItem(currentUser);
    this._router.navigate(['/login']);
  }

  checkLogin() {
    let user = JSON.parse(localStorage.getItem(currentUser));
    console.log(user);
    return user ? true : false;
  }

  getUsername() {
    let user = JSON.parse(localStorage.getItem(currentUser));
    return user ? user["username"] : false;
  }

  getRout() {
    let user = JSON.parse(localStorage.getItem(currentUser));
    console.log(user);
    switch (user["type"]) {
      case Participants.Healthadmin:
        this._router.navigate(['/admin']);
        break;
      case Participants.Family:
        this._router.navigate(['/family']);
        break;
      case Participants.Hospital:
        this._router.navigate(['/hospital']);
        break;
      case Participants.Doctor:
        this._router.navigate(['/doctor']);
        break;
      case Participants.Physician:
        this._router.navigate(['/physician']);
        break;
      case Participants.School:
        this._router.navigate(['/school']);
        break;
      case Participants.Insurance:
        this._router.navigate(['/insurance']);
        break;
      default:
        this._router.navigate(['/login']);
        break;
    }
  }

  getAge(brithdate: Date, visitDate: Date) {
    var yearNow = visitDate.getFullYear();
    var monthNow = visitDate.getMonth();
    var dateNow = visitDate.getDate();

    var yearDob = brithdate.getFullYear();
    var monthDob = brithdate.getMonth();
    var dateDob = brithdate.getDate();
    var ageString = "";
    var yearString = "";
    var monthString = "";
    var dayString = "";


    var yearAge = yearNow - yearDob;

    if (monthNow >= monthDob)
      var monthAge = monthNow - monthDob;
    else {
      yearAge--;
      var monthAge = 12 + monthNow - monthDob;
    }

    if (dateNow >= dateDob)
      var dateAge = dateNow - dateDob;
    else {
      monthAge--;
      var dateAge = 31 + dateNow - dateDob;

      if (monthAge < 0) {
        monthAge = 11;
        yearAge--;
      }
    }

    let age = {
      years: yearAge,
      months: monthAge,
      days: dateAge
    };

    if (age.years > 1) yearString = " years";
    else yearString = " year";
    if (age.months > 1) monthString = " months";
    else monthString = " month";
    if (age.days > 1) dayString = " days";
    else dayString = " day";


    if ((age.years > 0) && (age.months > 0) && (age.days > 0))
      ageString = age.years + yearString + ", " + age.months + monthString + ", and " + age.days + dayString + " old.";
    else if ((age.years == 0) && (age.months == 0) && (age.days > 0))
      ageString = age.days + dayString + " old.";
    else if ((age.years > 0) && (age.months == 0) && (age.days == 0))
      ageString = age.years + yearString + " old.";
    else if ((age.years > 0) && (age.months > 0) && (age.days == 0))
      ageString = age.years + yearString + " and " + age.months + monthString + " old.";
    else if ((age.years == 0) && (age.months > 0) && (age.days > 0))
      ageString = age.months + monthString + " and " + age.days + dayString + " old.";
    else if ((age.years > 0) && (age.months == 0) && (age.days > 0))
      ageString = age.years + yearString + " and " + age.days + dayString + " old.";
    else if ((age.years == 0) && (age.months > 0) && (age.days == 0))
      ageString = age.months + monthString + " old.";
    else ageString = "Oops! Could not calculate age!";

    return ageString;
  }
}
