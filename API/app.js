var express = require("express");
var fileupload = require("express-fileupload");
var app = express();
var fs = require("file-system");
var bodyParser = require("body-parser");
var path = require("path");
var cors = require("cors");

// Generate unique IDs
const uniqid = require("uniqid");

// Cookie parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Bcrypt (for hashing passwords)
const bcrypt = require("bcrypt");

// JSON web token
const jwt = require("jsonwebtoken");

// Environment variabes
require("dotenv").config();

// Authorisation middleware
const authorise = require("./authorise");

// Data Classes
const dataClasses = require("./dataClasses");

// Load data
var sections = require("./sections.json");
var documents = require("./documents.json");
var users = require("./users.json");

// Set admin password
bcrypt.hash(process.env.ADMIN_KEY, 10, function (error, hash) {
    // Check for hashing error
    if (error) {
        console.log("Error setting admin password");
    }

    // Create admin user with hashed and salted password
    else {
        // Add to data structure
        users["admin"] = new dataClasses.User("admin", hash);

        // Save data structure
        fs.writeFile("users.json", JSON.stringify(users, null, 4));
    }
});

app.use(express.static("client"));
app.use(bodyParser.urlencoded({extended: true }));
app.use(fileupload());

// Fixes CORS errors
app.use(cors({origin: "*"}));

// Get sections
app.get("/sections", async (req, res) => {
    res.status(200).json(sections);
});

app.get("/login", async (req, res) => {
    res.sendFile("client/Login.html", {root: __dirname });
});


// Get documents
app.get("/documents", async (req, res) => {
    res.status(200).json(documents);
});

// Get all content (includes sections interlaced with documents)
app.get("/content", async (req, res) => {
    var content = {};

    for (var section of Object.keys(sections)) {
        // Copy sections object
        content[section] = JSON.parse(JSON.stringify(sections[section]));

        // Instantiate section documents as a new dictionary
        content[section].documents = {};

        // Insert document data inside dictionary
        for (var document of sections[section].documents) {
            content[section].documents[document] = documents[document];
        }
    }

    res.status(200).json(content);
});

// Get section (requires sectionID)
app.get("/section", async (req, res) => {
    // Check if sectionID supplied
    if (req.query.sectionID == null) {
        res.status(400).json("Bad request");
    }

    // Check if section exists
    else if (req.query.sectionID in sections) {
        res.status(200).json(sections[req.query.sectionID]);
    }

    // Notify user of non-existing section
    else {
        res.status(404).json("Section doesn't exist");
    }
});

// Login (requires username and password)
app.post("/login", async (req, res) => {
    // Check if username and password supplied, and check if username exists
    if (req.body.username && req.body.username in users && req.body.password) {
        // Compare hashes of supplied and stored password
        bcrypt.compare(req.body.password, users[req.body.username].password, function (error, same) {
            // Check for authorisation error
            if (error || !same) {
                res.status(401).json("Authorisation error");
            }

            // Send JSON web token
            else {
                const token = jwt.sign({
                    username: req.body.username
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "24h"
                });

                res.cookie("authorisationToken", token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    path: "/",
                    sameSite: "strict"
                }).json("Successfully logged in!");
            }
        });
    }

    // Notify user of authorisation error
    else {
        res.status(401).json("Authorisation error");
    }
});

// Logout (removes cookie)
app.get("/logout", async (req, res) => {
    res.cookie("authorisationToken", "", {
        httpOnly: true,
        maxAge: -1,
        path: "/",
        sameSite: "strict"
    }).json("Successfully logged out!");
});

// Get all account usernames (requires admin authorisation)
app.get("/accounts", authorise, async (req, res) => {
    // Check if admin
    if (req.user.username == "admin") {
        // Generate list of usernames
        var usernames = [];

        for (var username of Object.keys(users)) {
            usernames.push(username);
        }

        // Return list of usernames
        res.status(200).json(usernames);
    }

    // Notify user of authorisation error
    else {
        res.status(401).json("Authorisation error");
    }
});

// Create account (requires username, password, and admin authorisation)
app.post("/createAccount", authorise, async (req, res) => {
    // Check if username and password supplied, and user is admin
    if (req.body.username && req.body.password) {
        // Check if not authorised as admin
        if (req.user.username != "admin") {
            res.status(401).json("Authorisation error");
        }

        // Check if username already exists
        else if (req.body.username in users) {
            res.status(409).json("Username taken");
        }

        // Try to create new user
        else {
            bcrypt.hash(req.body.password, 10, function (error, hash) {
                // Check for hashing error
                if (error) {
                    res.status(500).json("Error creating account");
                }

                // Create new user with hashed and salted password
                else {
                    // Add to data structure
                    users[req.body.username] = new dataClasses.User(req.body.username, hash);

                    // Save data structure
                    fs.writeFile("users.json", JSON.stringify(users, null, 4));

                    // Notify client of successful account creation
                    res.status(201).json("Account successfully created!");
                }
            });
        }
    }

    // Notify user of bad request
    else {
        res.status(400).json("Bad request");
    }
});

// Edit account password (requires username, password, and authorisation (can only edit own credentials unless authorised as admin))
app.patch("/editAccountPassword", authorise, async (req, res) => {
    // Check if username and password supplied
    if (req.body.username && req.body.password) {
        // Check if modifying own credentials or authorised as admin
        if (req.user.username == req.body.username || req.user.username == "admin") {
            // Check if username exists
            if (req.body.username in users) {
                bcrypt.hash(req.body.password, 10, function (error, hash) {
                    // Check for hashing error
                    if (error) {
                        res.status(500).json("Error creating account");
                    }

                    // Update user with new hashed and salted password
                    else {
                        // Update data structure
                        users[req.body.username].password = hash;

                        // Save data structure
                        fs.writeFile("users.json", JSON.stringify(users, null, 4));

                        // Notify user of successful account credentials update
                        res.status(200).json("Account credentials successfully updated!");
                    }
                });
            }

            // Notify user of non-existent username
            else {
                res.status(404).json("Username doesn't exist");
            }
        }

        // Notify user of authorisation error
        else {
            res.status(401).json("Authorisation error");
        }
    }

    // Notify user of bad request
    else {
        res.status(400).json("Bad request");
    }
});

// Delete account (requires username and admin authorisation)
app.delete("/deleteAccount", authorise, async (req, res) => {
    // Check if username supplied and is not set to admin
    if (req.body.username && req.body.username != "admin") {
        // Check if authorised as admin
        if (req.user.username == "admin") {
            // Check if username exists
            if (req.body.username in users) {
                // Update data structure
                delete users[req.body.username];

                // Save data structure
                fs.writeFile("users.json", JSON.stringify(users, null, 4));

                // Notify user of successful account removal
                res.status(200).json("Account successfully deleted!");
            }

            // Notify user of non-existing username
            else {
                res.status(404).json("Username doesn't exist");
            }
        }

        // Notify user of authorisation error
        else {
            res.status(401).json("Authorisation error");
        }
    }

    // Notify user of bad request
    else {
        res.status(400).json("Bad request");
    }
});

// Add new section (requires title, description, and thumbnail to be passed)
app.post("/addSection", authorise, async (req, res) => {
    // Store thumbnail

    if (req.body.title != null && req.body.description != null && req.files.thumbnail != null){
        const thumbnail = req.files.thumbnail;
        const location = "/images/thumbnails/" + uniqid() + path.extname(thumbnail.name);
        
        thumbnail.mv("./client" + location, (error) => {
            // Implement proper error handling later
            if (error) {
                throw error;
            }
        });

        // Create section
        var newSection = new dataClasses.Section(req.body.title, req.body.description, [], location);

        // Add to data structure
        sections[newSection.id] = newSection;

        // Save data structure
        fs.writeFile("sections.json", JSON.stringify(sections, null, 4));

        // Send object to client
        res.status(201).json(newSection);
    }
    else {
        res.status(400).json("Bad request");
    }
});

// Edit section (requires title, description, or thumbnail (or any combination of at least one item), and sectionID)
app.patch("/editSection", authorise, async (req, res) => {
    // Check if any changes were made
    if (req.body.sectionID in sections && (req.body.title != null || req.body.description != null || req.files != null && req.files.thumbnail != null)) {
        // Edit title
        if (req.body.title != null) {
            sections[req.body.sectionID].title = req.body.title;
        }

        // Edit description
        if (req.body.description != null) {
            sections[req.body.sectionID].description = req.body.description;
        }

        // Edit thumbnail
        if (req.files != null && req.files.thumbnail != null) {
            // Overwrite thumbnail
            const thumbnail = req.files.thumbnail;

            thumbnail.mv("./client" + sections[req.body.sectionID].thumbnail, (error) => {
                // Implement proper error handling later
                if (error) {
                    throw error;
                }
            });
        }

        // Save data structure
        fs.writeFile("sections.json", JSON.stringify(sections, null, 4));

        // Send updated object to client
        res.status(200).json(sections[req.body.sectionID]);
    }

    // Execute if no changes were made
    else {
        res.status(400).json("Bad request");
    }
});

// Delete section (requires sectionID)
app.delete("/deleteSection", authorise, async (req, res) => {
    // Check if section exists
    if (req.body.sectionID in sections) {
        // Delete associated documents
        for (var document of sections[req.body.sectionID].documents) {
            delete documents[document];

            // Implement document file deleting...
        }

        // Delete from data structure
        delete sections[req.body.sectionID];

        // Implement thumbnail file deleting...

        // Save data structures
        fs.writeFile("sections.json", JSON.stringify(sections, null, 4));
        fs.writeFile("documents.json", JSON.stringify(documents, null, 4));

        // Send response
        res.status(200).json("Successfully deleted section");
    }

    // Execute if section doesn't exist
    else {
        res.status(400).json("Bad request");
    }
});

// Add new section content (requires sectionID, title, contentType ("document" or "video"), and document (if contentType is "document") or location (if contentType is "video"))
app.post("/addSectionContent", authorise, async (req, res) => {
    // Store content (set based on contentType)
    var content = null;
    if (req.body.sectionID != null && req.body.title != null && (req.body.contentType == "document" || (req.body.contentType == "video" && req.body.location != null))){
        // Check if contentType "document"
        if (req.body.contentType == "document") {
            // Store document
            const document = req.files.document;
            const location = "/documents/" + uniqid() + path.extname(document.name);

            document.mv("./client" + location, (error) => {
                // Implement proper error handling later
                if (error) {
                    throw error;
                }
            });

            // Set thumbnail
            var thumbnail = "";

            if (path.extname(document.name) == ".docx" || path.extname(document.name) == ".doc") {
                thumbnail = "/images/icons/icon-docx.png";
            }

            else if (path.extname(document.name) == ".pdf") {
                thumbnail = "/images/icons/icon-pdf.png";
            }

            // Create content as Document
            content = new dataClasses.Document(req.body.title, location, thumbnail);
        }

        // Check if contentType "video"
        else {
            // Create content as Video
            var location = req.body.location.replace("https://www.youtube.com/watch?v=","https://www.youtube.com/embed/");
            content = new dataClasses.Video(req.body.title, location);
        }

        // Add to data structures
        documents[content.id] = content;
        sections[req.body.sectionID].documents.push(content.id);

        // Save data structures
        fs.writeFile("documents.json", JSON.stringify(documents, null, 4));
        fs.writeFile("sections.json", JSON.stringify(sections, null, 4));

        // Send object to client
        res.status(201).json(content);
    }
    else{
        res.status(400).json("Bad request");
    }
});

// Edit document (requires title, then document as a file, or location (or any combination of at least one item), and documentID)
app.patch("/editSectionContent", authorise, async (req, res) => {
    // Check if any changes were made
    if (req.body.documentID in documents && (req.body.title != null || req.files != null && req.files.document != null || req.body.location != null)) {
        // Edit title
        if (req.body.title != null) {
            documents[req.body.documentID].title = req.body.title;
        }

        // Edit file
        if (documents[req.body.documentID].type == "document" && req.files != null && req.files.document != null) {
            // Overwrite document file
            const document = req.files.document;

            document.mv("./client" + documents[req.body.documentID].location, (error) => {
                // Implement proper error handling later
                if (error) {
                    throw error;
                }
            });

            // Change thumbnail if file-type changed
            if (path.extname(document.name) != path.extname(documents[req.body.documentID].thumbnail)) {
                var thumbnail = "";

                if (path.extname(document.name) == ".docx" || path.extname(document.name) == ".doc") {
                    thumbnail = "/images/icons/icon-docx.png";
                }

                else if (path.extname(document.name) == ".pdf") {
                    thumbnail = "/images/icons/icon-pdf.png";
                }

                documents[req.body.documentID].thumbnail = thumbnail;
            }
        }

        if (documents[req.body.documentID].type == "video" && req.body.location != null) {
            documents[req.body.documentID].location = req.body.location.replace("https://www.youtube.com/watch?v=","https://www.youtube.com/embed/");
        }

        // Save data structure
        fs.writeFile("documents.json", JSON.stringify(documents, null, 4));

        // Send updated object to client
        res.status(200).json(documents[req.body.documentID]);
    }

    // Execute if no changes were made
    else {
        res.status(400).json("Bad request");
    }
});

// Delete document (requires documentID)
app.delete("/deleteSectionContent", authorise, async (req, res) => {
    // Check if document exists
    if (req.body.documentID in documents) {
        // Delete from associated sections
        for (var section of Object.values(sections)) {
            if (section.documents.includes(req.body.documentID)) {
                section.documents.splice(section.documents.indexOf(req.body.documentID), 1);
            }
        }

        // Delete from data structure
        delete documents[req.body.documentID];

        // Implement thumbnail and document file deleting...

        // Save data structures
        fs.writeFile("sections.json", JSON.stringify(sections, null, 4));
        fs.writeFile("documents.json", JSON.stringify(documents, null, 4));

        // Send response
        res.status(200).json("Successfully deleted document");
    }

    // Execute if document doesn't exist
    else {
        res.status(400).json("Bad request");
    }
});

module.exports = app;
