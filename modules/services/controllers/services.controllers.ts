import { ServicesService } from "../services/services.services";

export class ServicesController {
  private service: ServicesService;

  constructor() {
    this.service = new ServicesService();
  }

  public async handleGetUserSession() {
    return await this.service.getUserSession();
  }
}
