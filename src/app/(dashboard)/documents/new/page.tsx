import { getCurrentOrg } from "@/lib/auth";
import { NewDocumentForm } from "./NewDocumentForm";

export default async function NewDocumentPage() {
  const org = await getCurrentOrg();
  return <NewDocumentForm orgName={org?.name ?? null} />;
}
