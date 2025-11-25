"use client";

import { ReactNode, useEffect, useState } from "react";
import ReactDOM from "react-dom";

export default function Modal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const root = document.getElementById("modal-root");
  if (!root) return null;

  return ReactDOM.createPortal(children, root);
}
