/* write the code to run app.js here */
const app = require("./app");
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`app listening at http://localhost:${PORT}`)
);
