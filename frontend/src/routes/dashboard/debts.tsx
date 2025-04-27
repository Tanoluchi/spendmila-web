import React from 'react';
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "@/hooks/useAuth.ts";
import Debts from "@/pages/Debts";

export const Route = createFileRoute("/dashboard/debts")({
  component: DebtsPage,
  beforeLoad: async () => {
    // Redirect to login if user is not authenticated
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function DebtsPage() {
  return (
    <div className="p-4 md:p-6">
      <Debts />
    </div>
  );
}

export default DebtsPage;
