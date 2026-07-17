"use client";

import { useEffect } from "react";

const BLOCKED_SHORTCUTS = [
  { key: "u", ctrl: true, label: "View Source" },
  { key: "s", ctrl: true, label: "Save Page" },
  { key: "i", ctrl: true, shift: true, label: "DevTools" },
  { key: "j", ctrl: true, shift: true, label: "Console" },
  { key: "c", ctrl: true, shift: true, label: "DevTools" },
  { key: "F12", label: "DevTools" },
];

function showMessage() {
  // Create/reuse a simple overlay message
  const existingToast = document.getElementById("security-toast");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.id = "security-toast";
  toast.style.cssText = `
    position: fixed;
    top: 80px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(11, 18, 32, 0.95);
    border: 1px solid rgba(110, 231, 255, 0.3);
    color: #94A3B8;
    padding: 12px 24px;
    border-radius: 12px;
    font-size: 13px;
    font-family: system-ui, sans-serif;
    z-index: 99999;
    backdrop-filter: blur(12px);
    box-shadow: 0 0 30px rgba(110, 231, 255, 0.1);
    pointer-events: none;
    transition: opacity 0.3s;
  `;
  toast.textContent = "🔒 This content is for educational use. Please respect the project.";
  document.body.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/**
 * SecurityLayer — lightweight client deterrents ONLY.
 * Real security is enforced server-side via API routes.
 * Does NOT attempt to close the page, crash the browser, or detect DevTools.
 */
export default function SecurityLayer() {
  useEffect(() => {
    // Disable right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showMessage();
    };

    // Disable specific keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const shortcut of BLOCKED_SHORTCUTS) {
        const ctrlMatch = shortcut.ctrl ? (e.ctrlKey || e.metaKey) : true;
        const shiftMatch = shortcut.shift ? e.shiftKey : !e.shiftKey;
        const keyMatch = e.key === shortcut.key;

        // F12 — no modifier needed
        if (shortcut.key === "F12" && e.key === "F12") {
          e.preventDefault();
          showMessage();
          return;
        }

        // Ctrl/Cmd + [optional Shift] + key
        if (
          shortcut.key !== "F12" &&
          shortcut.ctrl &&
          ctrlMatch &&
          shiftMatch &&
          keyMatch
        ) {
          e.preventDefault();
          showMessage();
          return;
        }
      }
    };

    // Disable drag-and-drop of assets
    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG" || target.tagName === "A") {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
    };
  }, []);

  return null;
}
