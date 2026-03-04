import { useEffect } from 'react';

type Props = {
    isOpen: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onClose: () => void;
};

export function Modal({
                          isOpen,
                          title,
                          description,
                          confirmText = 'Подтвердить',
                          cancelText = 'Отмена',
                          onConfirm,
                          onClose,
                      }: Props) {
    useEffect(() => {
        if (!isOpen) return;

        function onKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    function handleBackdropClick() {
        onClose();
    }

    function handleCardClick(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
    }

    function handleConfirm() {
        onConfirm();
        onClose();
    }

    function handleCancel() {
        onClose();
    }

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-label={title}
        >
            <div
                className="card-surface w-full max-w-md rounded-2xl p-5 shadow-xl"
                onClick={handleCardClick}
            >
                <div className="mb-2 text-lg font-semibold">{title}</div>
                {description ? <div className="text-muted mb-5 text-sm">{description}</div> : null}

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        className="btn-outline rounded-xl border px-4 py-2 text-sm"
                        onClick={handleCancel}
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        className="btn-primary rounded-xl px-4 py-2 text-sm"
                        onClick={handleConfirm}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
