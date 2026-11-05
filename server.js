// ENTRY POINT — its only job: start listening on a port.
// Everything about Express lives in src/app.js

import app from "./src/app.js";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on :: http://localhost:${PORT}`);
});
