"use client";

export default function SidebarOverlay({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
      onClick={onClose}
    >
      <div className="sr-only">Close sidebar</div>
    </div>
  );
}