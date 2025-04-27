import React from 'react';
import { createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/useAuth.ts";
import Import from "@/pages/Import";

export const Route = createFileRoute("/dashboard/import")({
  component: ImportPage,
  beforeLoad: async () => {
    // Redirect to login if user is not authenticated
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function ImportPage() {
  return (
    <div className="p-4 md:p-6">
      <Import />
    </div>
  );
}

export default ImportPage;
