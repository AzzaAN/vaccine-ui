export class Record {
    family: string;
    childName: string;
    childBirthDate?: string;
    childGender: string;
    hospital?: string;
    school?: string;
    insurance?: string;
    vaccineDetails?: Array<string>;
}

export class Detail {
    vaccineName: string;
    childAge: string;
    childTemperature: string;
    childWeight: string;
    childHeight: string;
    doc?: string;
    physician?: string;
    note?: string;
    signed?: boolean;
    nextVisit?: string;
    remainingVaccines?: string;
}

export class Record_fetch {
    _id: string;
    _family: string;
    _childName: string;
    _childBirthDate?: string;
    _childGender: string;
    _hospital?: string;
    _school?: string;
    _insurance?: string;
    _vaccineDetails?: Detail_fetch[];
}

export class Detail_fetch {
    _id: string;
    _vaccineName: string;
    _childAge: string;
    _childTemperature: string;
    _childWeight: string;
    _childHeight: string;
    _doc?: string;
    _physician?: string;
    _note?: string;
    _signed?: boolean;
    _nextVisit?: string;
    _remainingVaccines?: string;
    _history?:Detail_history[];
}

export class Detail_history {
    txId: string;
    value: Detail_fetch;
    timestamp: {
        low: 1554790467,
        high: 0,
        unsigned: false
    }
}

export class Participant {
    type: string;
    username: string;
    fullname: string;
    participantId: string;
    hospital?: string;
}

