import { PermissionData } from './permission-data';
import { PlaceData } from './place-data';

export interface UserData {
    id: string;
    userName: string;
    name: string;
    email: string;
    password: string;
    rol: string;
    permission: PermissionData;
    isEmailVerified: boolean;
    isEnabled: boolean;
    isCredentialsEnabled: boolean;
    favorites: PlaceData[];
}