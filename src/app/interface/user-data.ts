import { PermissionEnum } from '../enum/permission-enum';
import { PlaceData } from './place-data';

export interface UserData {
    id: string;
    userName: string;
    name: string;
    email: string;
    password: string;
    rol: string;
    permission: PermissionEnum[];
    isEmailVerified: boolean;
    isEnabled: boolean;
    isCredentialsEnabled: boolean;
    favorites: PlaceData[];
}