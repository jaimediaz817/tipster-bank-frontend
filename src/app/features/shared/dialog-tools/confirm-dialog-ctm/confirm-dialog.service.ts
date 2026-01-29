import { Injectable } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { firstValueFrom } from 'rxjs';

import { ConfirmDialogData, ConfirmDialogOptions } from './confirm-dialog.types';
import { ConfirmDialogCtm } from './confirm-dialog-ctm';

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
    constructor(private readonly dialog: Dialog) {}

    async confirm(data: ConfirmDialogData, options: ConfirmDialogOptions = {}): Promise<boolean> {
        const ref = this.dialog.open<boolean>(ConfirmDialogCtm, {
            data,
            disableClose: options.disableClose ?? true,
            backdropClass: options.backdropClass ?? 'bg-black/60',
            panelClass: options.panelClass ?? 'p-0',
        });

        return (await firstValueFrom(ref.closed)) ?? false;
    }

    // Preset: destructivo
    confirmDanger(data: Omit<ConfirmDialogData, 'tone'>, options: ConfirmDialogOptions = {}) {
        return this.confirm(
            {
                tone: 'danger',
                confirmText: data.confirmText ?? 'Sí, eliminar',
                cancelText: data.cancelText ?? 'Cancelar',
                ...data,
            },
            { disableClose: true, ...options },
        );
    }

    // Preset: cambios sin guardar
    confirmUnsavedChanges(options: ConfirmDialogOptions = {}) {
        return this.confirm(
            {
                title: 'Cambios sin guardar',
                message: 'Tienes cambios sin guardar. Si sales, se perderán.',
                confirmText: 'Salir sin guardar',
                cancelText: 'Seguir editando',
                tone: 'danger',
                requireCheckbox: { label: 'Entiendo que perderé los cambios.' },
            },
            { disableClose: true, ...options },
        );
    }

    // Preset: typed confirm (alto riesgo)
    confirmTyped(
        data: Omit<ConfirmDialogData, 'requireText'> & { match: string },
        options: ConfirmDialogOptions = {},
    ) {
        return this.confirm(
            {
                tone: 'danger',
                confirmText: data.confirmText ?? 'Confirmar',
                cancelText: data.cancelText ?? 'Cancelar',
                ...data,
                requireText: {
                    label: `Escribe "${data.match}" para confirmar`,
                    match: data.match,
                    placeholder: data.match,
                    caseSensitive: false,
                },
            },
            { disableClose: true, ...options },
        );
    }
}
