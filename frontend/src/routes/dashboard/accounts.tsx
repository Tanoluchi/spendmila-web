import React from 'react';
import { createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/useAuth.ts";
import Accounts from "@/pages/Accounts";

export const Route = createFileRoute("/dashboard/accounts")({
  component: AccountsPage,
  beforeLoad: async () => {
    // Redirect to login if user is not authenticated
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function AccountsPage() {
  const { user: currentUser } = useAuth();
  
  return (
    <div className="p-4 md:p-6">
      <Accounts />
    </div>
  );
}

export default AccountsPage;
