import { Severity } from '../../../generated/prisma';
export declare class CreateAlertDto {
    title: string;
    description: string;
    location: [number, number];
    crops: string[];
    severity?: Severity;
}
