"use client";

type ToastVariant = 'success' | 'error';

type ToastProps = {
  message: string;
  variant?: ToastVariant;
  onClose?: () => void;
};

const variantClassMap: Record<ToastVariant, string> = {
  success: 'bg-emerald-500 text-white',
  error: 'bg-rose-500 text-white',
};

export default function Toast({ message, variant = 'success', onClose }: ToastProps) {
  return (
    <div
      className={`fixed right-4 top-4 flex items-center gap-3 rounded-md px-4 py-2 text-sm font-semibold shadow ${variantClassMap[variant]}`}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          aria-label="トーストを閉じる"
          className="rounded px-1 text-white/90 hover:bg-white/20"
          onClick={onClose}
        >
          x
        </button>
      )}
    </div>
  );
}
