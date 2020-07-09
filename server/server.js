const express = require('express');
const path = require('path');
const compression = require('compression');
const bodyParser = require("body-parser");
const cors = require('cors');


// Constants
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

// App
const app = express();

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use("/", express.static(path.join(__dirname, "dist")));
app.use((req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.use(cors());

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

