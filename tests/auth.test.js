const request = require("supertest");
const app = require("../app");

let server;

beforeAll(() => {
  server = app.listen(4000); // Start a test server on a different port
});

afterAll(() => {
  server.close(); // Ensure the server stops after tests
});

test("User signup should work correctly", async () => {
  const res = await request(app)
    .post("/auth/signup")
    .send({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    });

  expect(res.statusCode).toBe(201);
  expect(res.body).toHaveProperty("token");
});
