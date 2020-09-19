const express = require("express");
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const fs = require("fs");

const app = express();

const port = process.env.PORT || 8080;

app.use(fileupload());


app.listen(port, () => {
	console.log("This is " + port);
});

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/test.html");
});

let file = "";

fs.readFile("./Site/files/CVTemplate1.pdf", (error, data) => {
	file = data;
	console.log(file);
});

app.post("/file", (req, res) => {
	res.send(file);
});


app.post("/upload", (req, res) => {
	const file = req.files.sampleFile;
	file.mv("./uploads/"+file.name, (err, result) => {
		if(err)
			throw err;
		res.send({
			success: true,
			message: "File uploaded!"
		});

	});


});