import { PermissionEnum } from "../enum/permission-enum";

export interface PermissionData {
    id: string;
    permissions: PermissionEnum[];
}