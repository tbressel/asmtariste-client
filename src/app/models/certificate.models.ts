export class CertificateCardModel {
    id_certificates!: number;
    title!: string;
    creationDate!: Date;
    note!: number;
}

export class CertificatesListModel {
    id_certificates!: number;
    note!: number;
    creationDate!: Date;
    username!: string;
    title!: string;
    medal!: string;
}

export class CertificatesAverageModel {
    id_users!: number;
    moyenne!: number;
    notes!: string;
    username!: string;
}   

export class CertificatesNotesMedals {
    note!: number;
    medal!: string;
}   