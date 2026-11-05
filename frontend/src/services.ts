import type { Dashboard } from './domain.ts';
import { dashboardFixture, sourceDashboardFixture } from './fixtures.ts';
export interface DashboardService { getDashboard(options?: { sourceOnly: boolean }): Promise<Dashboard> }
export const mockDashboardService: DashboardService = {
  async getDashboard(options) { return structuredClone(options?.sourceOnly ? sourceDashboardFixture : dashboardFixture); },
};
