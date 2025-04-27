import React from 'react';
import { createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/useAuth.ts";
import Subscriptions from "@/pages/Subscriptions";

export const Route = createFileRoute("/dashboard/subscriptions")({
  component: SubscriptionsPage,
  beforeLoad: async () => {
    // Redirect to login if user is not authenticated
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function SubscriptionsPage() {
  const { user: currentUser } = useAuth();
  
  return (
    <div className="p-4 md:p-6">
      <Subscriptions />
    </div>
  );
}

export default SubscriptionsPage;
