import React from 'react';
import { createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/useAuth.ts";
import Help from "@/pages/Help";

export const Route = createFileRoute("/dashboard/help")({
  component: HelpPage,
  beforeLoad: async () => {
    // Redirect to login if user is not authenticated
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function HelpPage() {
  const { user: currentUser } = useAuth();
  
  return (
    <div className="p-4 md:p-6">
      <Help />
    </div>
  );
}

export default HelpPage;
