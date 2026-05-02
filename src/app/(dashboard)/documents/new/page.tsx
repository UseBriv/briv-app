import { TopBar } from "../../_components/TopBar";
import { NewDocumentForm } from "./NewDocumentForm";

export default function NewDocumentPage() {
  return (
    <>
      <TopBar title="New document" />
      <main className="px-8 py-8">
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <NewDocumentForm />
        </div>
      </main>
    </>
  );
}
