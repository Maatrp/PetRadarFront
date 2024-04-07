import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

export class RegisterPageForm {
  constructor(private _formBuilder: FormBuilder) {}

  createForm(): FormGroup {
    return this._formBuilder.group(
      {
        userName: ['', [Validators.required]],
        name: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email, this.emailValidator]],
        password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(10)]],
      },
      {
        validators: this.passwordMatchValidator.bind(this),
      }
    );
  }

  private emailValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const EMAIL_REGEXP = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return EMAIL_REGEXP.test(control.value) ? null : { email: true };
  }

  private passwordMatchValidator(form: FormGroup): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      form.get('confirmPassword')?.setErrors(null);
      return null;
    }
  }
}