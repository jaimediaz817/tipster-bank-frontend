import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject, signal } from '@angular/core';
import { ConfirmDialogData } from './confirm-dialog.types';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-dialog-ctm',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-dialog-ctm.html',
    styleUrl: './confirm-dialog-ctm.css',
})
export class ConfirmDialogCtm {
    private readonly dialogRef = inject(DialogRef<boolean>);
    readonly data = inject<ConfirmDialogData>(DIALOG_DATA);

    // Reglas (signals)
    readonly checked = signal(false);
    readonly typed = signal('');

    // Validación enterprise
    readonly canConfirm = computed(() => {
        const checkboxOk = this.data.requireCheckbox ? this.checked() : true;

        let textOk = true;
        if (this.data.requireText) {
            const match = this.data.requireText.match ?? '';
            const input = this.typed() ?? '';
            const cs = this.data.requireText.caseSensitive ?? false;
            textOk = cs
                ? input === match
                : input.trim().toLowerCase() === match.trim().toLowerCase();
        }

        return checkboxOk && textOk;
    });

    close(result: boolean) {
        this.dialogRef.close(result);
    }
}
