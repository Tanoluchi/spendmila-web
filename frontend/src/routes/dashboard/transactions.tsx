// React is used implicitly by JSX
import { createFileRoute, redirect } from "@tanstack/react-router";
import useAuth, { isLoggedIn } from "@/hooks/useAuth.ts";
import Transactions from "@/pages/Transactions";

export const Route = createFileRoute("/dashboard/transactions")({
  component: TransactionsPage,
  beforeLoad: async () => {
    // Redirect to login if user is not authenticated
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function TransactionsPage() {
  return (
    <div className="p-4 md:p-6">
      <Transactions />
    </div>
  );
}

export default TransactionsPage;
