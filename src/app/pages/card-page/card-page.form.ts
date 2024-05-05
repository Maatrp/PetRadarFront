import { FormBuilder, FormGroup, Validators } from "@angular/forms";

export class CardPageForm {
  constructor(private _formBuilder: FormBuilder) { }

  // Validador de la valoración
  createForm(): FormGroup {
    return this._formBuilder.group({
      averageRating: ['', [Validators.required]],
      commentMessage: ['', [Validators.required]],
    });
  }
}