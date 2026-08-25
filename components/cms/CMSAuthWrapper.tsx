"use client";

import { useState } from "react";
import { PortfolioCMSData } from "@/lib/cms";
import CMSLoginForm from "@/components/cms/CMSLoginForm";
import CMSDashboard from "@/components/cms/CMSDashboard";

interface CMSAuthWrapperProps {
  initialAuthenticated: boolean;
  initialData: PortfolioCMSData;
}

export default function CMSAuthWrapper({
  initialAuthenticated,
  initialData,
}: CMSAuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(initialAuthenticated);

  if (!isAuthenticated) {
    return <CMSLoginForm onSuccess={() => setIsAuthenticated(true)} />;
  }

  return <CMSDashboard initialData={initialData} />;
}
