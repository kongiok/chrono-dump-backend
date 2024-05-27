import request from "supertest";
import { app } from "../../../app.js";


describe("Tasks Route Test", () => {
  it("Should return Tasks Route", async () => {
    return await request(app)
      .get("/api/v1/tasks")
      .expect(200);
  })
})
