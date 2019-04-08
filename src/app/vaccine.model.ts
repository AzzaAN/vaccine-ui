export class Record {
    family: string;
    childName: string;
    childBirthDate: string;
    childGender: string;
    hospital: string;
    school: string;
    insurance: string;
    vaccineDetails: Array<string>;
}

export class Detail {
    vaccineName: string;
    childAge: string;
    childTemperature: string;
    childWeight: string;
    childHeight: string;
    doc: string;
    physician: string;
    note: string;
    signed: boolean;
    nextVisit: string;
    remainingVaccines: string;
}

export class Participant {
    type: string;
    username: string;
    fullname: string;
    participantId: string;
    hospital: string;
}

