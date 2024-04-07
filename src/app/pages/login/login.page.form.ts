import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class LoginPageForm {
  constructor(private _formBuilder: FormBuilder) {}
  
  // Validador del login
  createForm(): FormGroup {
    return this._formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
    });
  }
}
