import { TopBar } from "../../_components/TopBar";
import { NewDocumentForm } from "./NewDocumentForm";

export default function NewDocumentPage() {
  return (
    <>
      <TopBar title="Document studio" />
      <main className="px-8 py-8">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <NewDocumentForm />
        </div>
      </main>
    </>
  );
}
