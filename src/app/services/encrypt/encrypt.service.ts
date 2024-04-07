import { Injectable } from '@angular/core';
import * as bcrypt from 'bcryptjs';

@Injectable({
  providedIn: 'root',
})
export class EncryptService {

  // Encripta la contraseña
  async encryptPassword(password: string) : Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}