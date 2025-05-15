// frontend/src/client/services/SummaryService.ts
import { OpenAPI } from '@/client/core/OpenAPI';
import { request as __request } from '@/client/core/request';
import type { UserExpenseSummaryResponse } from '@/types/summary';

// Re-define UserExpenseSummaryResponse to match the expected structure from the backend
// if it's not already perfectly matching in '@/types/summary'.
// For this implementation, we assume '@/types/summary' UserExpenseSummaryResponse is:
// export interface UserExpenseSummaryResponse {
//   monthly_summary: MonthlyExpenseSummaryItem[];
//   daily_summary: DailyExpenseSummaryItem[];
// }

export const SummaryService = {
    /**
     * Read User Expense Summary
     * Retrieve an expense summary for the current user.
     * Includes a monthly breakdown for the specified year and a daily breakdown for the specified number of past days.
     * @param year Year for monthly summary. Defaults to current year.
     * @param daysForDaily Number of past days for daily summary (e.g., 7 for weekly view).
     * @returns UserExpenseSummaryResponse Successful Response (This type should be from '@/types/summary')
     * @throws ApiError
     */
    readUserExpenseSummary: ({
        year,
        daysForDaily,
    }: {
        year?: number | null;
        daysForDaily?: number | null;
    }): Promise<UserExpenseSummaryResponse> => {
        let url = `/api/v1/users/me/expense-summary`;
        const queryParams: string[] = [];
        if (year !== undefined && year !== null) {
            queryParams.push(`year=${year}`);
        }
        if (daysForDaily !== undefined && daysForDaily !== null) {
            queryParams.push(`days_for_daily=${daysForDaily}`);
        }

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
        }

        return __request(OpenAPI, {
            method: 'GET',
            url: url,
            errors: {
                422: `Validation Error`,
            },
        });
    },
};
