import { UserData } from "./user-data";

export interface AuthResponse {
    jwt: string;
    user: UserData;
}