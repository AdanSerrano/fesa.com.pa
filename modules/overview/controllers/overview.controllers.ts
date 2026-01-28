import { OverviewService } from "../services/overview.services";

export class OverviewController {
  private service: OverviewService;

  constructor() {
    this.service = new OverviewService();
  }

  public async handleGetUserSession() {
    return await this.service.getUserSession();
  }
}
