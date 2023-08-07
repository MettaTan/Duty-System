#!/usr/bin/env node
const app = require("./index");
const config = require("./config");
const mongoose = require("mongoose");

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect(
        `mongodb://${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`
    );
}

// Note that there's not much logic in this file.
// The server should be mostly "glue" code to set things up and
// then start listening
app.listen(config.express.port, config.express.ip, function (error) {
    if (error) {
        console.log("Unable to listen for connections", error);
    }
    const date_obj = new Date();
    console.log(`Time: ${date_obj}`);
    console.log(
        "Express is listening on http://" +
            config.express.ip +
            ":" +
            config.express.port
    );
    console.log(
        "MongoDB is listening on http://" +
            config.mongodb.host +
            ":" +
            config.mongodb.port +
            "/" +
            config.mongodb.db
    );
});
