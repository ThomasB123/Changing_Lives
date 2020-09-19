// Generate unique IDs
const uniqid = require("uniqid");

// Section definition
class Section {
    constructor(title, description, documents, thumbnail) {
        // Generate unique ID
        this.id = uniqid();
        
        // Set title
        this.title = title;
        
        // Set description
        this.description = description;
        
        // Set thumbnail location
        this.thumbnail = thumbnail;
        
        // Set document IDs array
        this.documents = documents;
    }
}

// SectionContent definition
class SectionContent {
    constructor(title, location) {
        // Generate unique ID
        this.id = uniqid();

        // Set title
        this.title = title;

        // Set content location
        this.location = location;

        // Set in child classes
        this.type = null;
    }
}

// Document definition (type of SectionContent)
class Document extends SectionContent {
    constructor(title, location, thumbnail) {
        // Call SectionContent constructor
        super(title, location);

        // Set type
        this.type = "document";

        // Set thumbnail location
        this.thumbnail = thumbnail;
    }
}

// Video definition (type of SectionContent)
class Video extends SectionContent {
    constructor(title, location) {
        // Call SectionContent constructor
        super(title, location);

        // Set type
        this.type = "video";
    }
}

// User definition
class User {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

// Export classes
module.exports = {
    Section : Section,
    Document : Document,
    Video : Video,
    User : User
};