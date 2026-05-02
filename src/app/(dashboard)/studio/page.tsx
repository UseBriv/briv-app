import { TopBar } from "../_components/TopBar";
import { NewDocumentForm } from "../documents/new/NewDocumentForm";

export default function StudioPage() {
  return (
    <>
      <TopBar title="AI studio" />
      <main className="px-8 py-8">
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <NewDocumentForm />
        </div>
      </main>
    </>
  );
}
