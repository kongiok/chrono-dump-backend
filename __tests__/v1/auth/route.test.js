import request from "supertest";
import { app } from "../../../app.js";


describe("Auth Route Test", () => {
  it("Should return Auth Route", async () => {
    return await request(app)
      .get("/api/v1/auth")
      .expect(200);
  })
})
