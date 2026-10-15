"use client";

import Sheet from "@/components/ui/Sheet";
import LegalContent, { LEGAL } from "./LegalContent";

// doc: "terms" | "privacy" | null
export default function LegalSheet({ doc, onClose }) {
  return (
    <Sheet
      open={Boolean(doc)}
      onClose={onClose}
      title={doc ? LEGAL[doc].title : ""}
      footer={<button onClick={onClose} className="btn btn-primary w-full">Close</button>}
    >
      {doc && <LegalContent doc={doc} />}
    </Sheet>
  );
}
