"use client";

import { useCallback, useState } from "react";
import { TopBar } from "../../_components/TopBar";
import { DocumentStudio } from "./DocumentStudio";

function formatSavedTime() {
  return new Date().toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function NewDocumentForm() {
  const [lastSaved, setLastSaved] = useState("Just now");

  const onActivity = useCallback(() => {
    setLastSaved(formatSavedTime());
  }, []);

  return (
    <>
      <TopBar title="Document Studio" studio={{ lastSaved }} />
      <main className="px-6 py-8 sm:px-8">
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <DocumentStudio onActivity={onActivity} />
        </div>
      </main>
    </>
  );
}
