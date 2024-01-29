import { FormGroup } from '@angular/forms';

export function markAllAsDirty(form: FormGroup): void {
  Object.keys(form.controls).forEach(key => form.get(key)?.markAsDirty());
}
