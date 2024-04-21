import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

export class CreatePlacePageForm {
    constructor(private _formBuilder: FormBuilder) { }

    createForm(): FormGroup {
        return this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
            type: ['', [Validators.required]],
            latitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
            longitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
            description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
            address: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(50)]],
            zip: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
            town: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
            website: ['', [this.websiteValidator]],
            phone: ['', [this.phoneNumberValidator]],
        });
    }

    private websiteValidator(control: AbstractControl): ValidationErrors | null {
        if (control.value && control.value.trim() !== '') {
            const WEBSITE_REGEXP = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            return WEBSITE_REGEXP.test(control.value) ? null : { invalidWebsite: true };
        }

        return null;
    }

    // Validador de números de teléfono internacionales

    private phoneNumberValidator(control: AbstractControl): ValidationErrors | null {
        if (control.value && control.value.trim() !== '') {
            const PHONE_NUMBER_REGEX = /^(?:\+?\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}$/;
            return PHONE_NUMBER_REGEX.test(control.value) ? null : { invalidPhone: true };
        }

        return null;

    }

}