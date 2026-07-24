import { listKnowledge, listFolders } from "@/lib/knowledge";
import KnowledgeBase from "@/components/KnowledgeBase";

export const dynamic = "force-dynamic";

export default async function KnowledgePage() {
  const [docs, folders] = await Promise.all([listKnowledge(), listFolders()]);

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-fg">
          Knowledge base
        </h1>
        <p className="mt-1.5 text-[15px] text-muted">
          Company docs, decks, case studies, and past posts — organized in folders,
          stored in the Brain, and used to ground every campaign.
        </p>
      </div>
      <KnowledgeBase initialDocs={docs} initialFolders={folders} />
    </div>
  );
}
