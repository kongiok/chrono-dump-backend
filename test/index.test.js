import supertest from "supertest";
import { env } from "process";
const baseUrl = `http://localhost:${env.PROGRAM_PORT}/api/v1`;


const api = supertest(baseUrl);

describe("Dummy test", () => {
  it("Should return 200", () => {
    api.get("/")
      .expect(200);
  })
})
