import { getCMSData } from "@/lib/cms";
import { isServerAuthenticated } from "@/lib/auth";
import CMSAuthWrapper from "@/components/cms/CMSAuthWrapper";

export const dynamic = "force-dynamic";

export default async function CMSPage() {
  const initialData = await getCMSData();
  const authenticated = await isServerAuthenticated();

  return (
    <CMSAuthWrapper
      initialAuthenticated={authenticated}
      initialData={initialData}
    />
  );
}
