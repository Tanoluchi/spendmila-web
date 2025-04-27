import React from 'react';
import { createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/useAuth.ts";
import Export from "@/pages/Export";

export const Route = createFileRoute("/dashboard/export")({
  component: ExportPage,
  beforeLoad: async () => {
    // Redirect to login if user is not authenticated
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function ExportPage() {
  return (
    <div className="p-4 md:p-6">
      <Export />
    </div>
  );
}

export default ExportPage;
