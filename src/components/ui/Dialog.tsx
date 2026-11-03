'use client';
import { useEffect, useRef, type ReactNode, type KeyboardEvent } from 'react';
import styles from './Dialog.module.css';
interface Props {
  open: boolean;
  onRequestClose: () => void;
  labelId: string;
  children: ReactNode;
  kind?: 'drawer' | 'gallery' | 'panel';
  onKeyDown?: (event: KeyboardEvent<HTMLDialogElement>) => void;
}
export function Dialog({
  open,
  onRequestClose,
  labelId,
  children,
  kind = 'panel',
  onKeyDown,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open && !node.open) {
      opener.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      node.showModal();
      node
        .querySelector<HTMLElement>(
          '[data-autofocus],button,a[href],input,select',
        )
        ?.focus();
    } else if (!open && node.open) {
      node.close();
      if (
        opener.current?.isConnected &&
        !document.querySelector('dialog[open]')
      )
        opener.current.focus();
    }
  }, [open]);
  useEffect(() => {
    const node = ref.current;
    return () => node?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={labelId}
      className={`${styles.dialog} ${kind === 'drawer' ? styles.drawer : kind === 'gallery' ? styles.gallery : ''}`}
      onCancel={(event) => {
        event.preventDefault();
        onRequestClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onRequestClose();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== 'Tab') return;
        const controls = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]',
          ),
        ].filter((element) => element.getClientRects().length > 0);
        if (!controls.length) return;
        const index = controls.findIndex(
          (element) => element === document.activeElement,
        );
        const next =
          index < 0
            ? event.shiftKey
              ? controls.length - 1
              : 0
            : (index + (event.shiftKey ? -1 : 1) + controls.length) %
              controls.length;
        event.preventDefault();
        controls[next]?.focus();
      }}
    >
      <div className={styles.content}>{children}</div>
    </dialog>
  );
}
