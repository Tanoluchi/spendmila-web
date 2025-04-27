import React from 'react';
import { createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/useAuth.ts";
import Settings from "@/pages/Settings";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
  beforeLoad: async () => {
    // Redirect to login if user is not authenticated
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function SettingsPage() {
  const { user: currentUser } = useAuth();
  
  return (
    <div className="p-4 md:p-6">
      <Settings />
    </div>
  );
}

export default SettingsPage;
