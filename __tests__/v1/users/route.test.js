import request from "supertest";
import { app } from "../../../app.js";


describe("Users Route Test", () => {
  it("Should return Users Route", async () => {
    return await request(app)
      .get("/api/v1/users")
      .expect(200);
  })
})
