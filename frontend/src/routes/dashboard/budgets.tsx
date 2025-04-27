// React is used implicitly by JSX
import { createFileRoute, redirect } from "@tanstack/react-router";
import { isLoggedIn } from "@/hooks/useAuth.ts";
import Budgets from "@/pages/Budgets";

export const Route = createFileRoute("/dashboard/budgets")({
  component: BudgetsPage,
  beforeLoad: async () => {
    // Redirect to login if user is not authenticated
    if (!isLoggedIn()) {
      throw redirect({
        to: "/login",
      });
    }
  },
});

function BudgetsPage() {
  return (
    <div className="p-4 md:p-6">
      <Budgets />
    </div>
  );
}

export default BudgetsPage;
