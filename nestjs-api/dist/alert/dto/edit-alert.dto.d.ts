import { Severity } from '../../../generated/prisma';
export declare class EditAlertDto {
    title?: string;
    description?: string;
    crops?: string[];
    severity?: Severity;
}
