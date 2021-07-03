const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://moon_coder:PARTEEK93@cluster0.pgwxm.mongodb.net/meetClone?retryWrites=true&=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("database connection succesfful");
  })
  .catch((err) => {
    console.log("database not connected properly " + err);
  });
