import React from 'react';
import { createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/useAuth.ts";
import Charts from "@/pages/Charts";

export const Route = createFileRoute("/dashboard/charts")({
  component: ChartsPage,
  beforeLoad: async () => {
    // Redirect to login if user is not authenticated
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function ChartsPage() {
  return (
    <div className="p-4 md:p-6">
      <Charts />
    </div>
  );
}

export default ChartsPage;
