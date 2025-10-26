import { FormGroup } from "@angular/forms";
import { NgxFormState } from "./ngx-store-type";
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from "@angular/core";

const initialState: NgxFormState = {
    form: new FormGroup({}),
}

export const NgxFormStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ form }) => ({
        isFormValid: computed(() => form().valid),
    })),
    withMethods((store) => ({
        loadForm(): FormGroup {
            return store.form();
        },
        updateForm(form: FormGroup): void {
            patchState(store, { form })
            console.log(store);
        },
        resetForm(): void {
            store.form.reset();
            console.log(store.form);
        }
    }))
)