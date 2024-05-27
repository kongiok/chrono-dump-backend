import { app, PORT } from "./app.js";

const server = (port) => {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit(1);
  }
};

server(PORT);
