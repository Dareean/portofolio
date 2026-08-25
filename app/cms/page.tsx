import { getCMSData } from "@/lib/cms";
import { isServerAuthenticated } from "@/lib/auth";
import CMSAuthWrapper from "@/components/cms/CMSAuthWrapper";

export const dynamic = "force-dynamic";

export default function CMSPage() {
  const initialData = getCMSData();
  const authenticated = isServerAuthenticated();

  return (
    <CMSAuthWrapper
      initialAuthenticated={authenticated}
      initialData={initialData}
    />
  );
}
