import supertest from "supertest";
const baseUrl = `http://localhost:5050/api/v1`;
import { expect } from "chai";

const api = supertest(baseUrl);

describe("Dummy test", () => {
  it("Should return 200", () => {
    api.get("/")
      .expect(200);
  })
})
