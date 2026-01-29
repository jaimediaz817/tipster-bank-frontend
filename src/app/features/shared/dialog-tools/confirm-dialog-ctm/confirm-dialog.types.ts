export type ConfirmTone = 'primary' | 'danger' | 'success' | 'warning' | 'info';

export interface ConfirmCheckboxRule {
    label: string; // “Entiendo que esto no se puede deshacer”
}

export interface ConfirmTypedRule {
    label: string; // “Escribe ELIMINAR para confirmar”
    match: string; // "ELIMINAR"
    placeholder?: string; // "ELIMINAR"
    caseSensitive?: boolean; // default false
}

export interface ConfirmDialogData {
    title?: string;
    message: string;
    details?: string[]; // bullets opcionales
    confirmText?: string;
    cancelText?: string;
    tone?: ConfirmTone;

    requireCheckbox?: ConfirmCheckboxRule;
    requireText?: ConfirmTypedRule;

    confirmClass?: string; // <-- para clases Tailwind
    confirmStyle?: string; // <-- para hex o gradiente CSS
    confirmHover?: 'darken' | 'lighten' | 'none'; // <-- NUEVO
}

export interface ConfirmDialogOptions {
    disableClose?: boolean; // cerrar con ESC/backdrop
    backdropClass?: string; // Tailwind
    panelClass?: string; // Tailwind
}
