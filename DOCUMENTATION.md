## Project

## How to Start Locally

#### Have to:

+ type `npm install` to get all needed packages.
+ then type`npm start` to run the server.
+ have to run in a Browser, such as Google Chrome.
+ visit `http://127.0.0.1:80`to start.

## Run deployed version:

+ To run the deployed version, simply visit https://changinglives.herokuapp.com/ 
  + This is only for testing purposes, and can be taken offline once the system is actually deployed, or after a period of time 
  + Please also note that this may take a few seconds to load if it hasn't been used in a while

## Server side functions

| method                   | url          | description                                                  |
| ------------------------ | ------------ | ------------------------------------------------------------ |
| Get                      | /sections     | sends back the sections, returns a 200 response code when successful                                     |
| Get                      | /login | sends the login page, requires a vaild username and password to log into the system                     |
| Get                      | /documents     | sends back all the documents currently saved, returns 200 response code when successful       |
| Get                      | /content       | sends back the whole content, including the sections interlaced with documents, returns 200 response when successful |
| Get                      | /logout       | logs the user out, removes the cookie       |
| Get                      | /section       | requires section ID to send back specific specific section, returns 404 error if section does not exist) |
| Post | /login      | requires a vaild username and password to log into the system, successfuly logs the user in if information given is valid, else gives a 401 error   |
| Get | /accounts  | send back the required person's profile page. (that person's id must be added in the url.) |
| Post| /createAccount      | Requires a valid username and password as well as admin authorisation. Cretes a new account with the username and password supplied so this new account can access the management page. Returns 201 response if successful, 401 error if authorisation isn't given, 409 error if username is already taken, 500 error if the account could not be created or 400 error if it is a bad request
| Patch  | /editAccountPassword | Allows the editing of the account password, as long as the valid username, password and authorisation is given. Returns a 200 response if successfully updated, a 500 error if an error occurs in the process of creating the password, a 404 error if the username does not exist, a 401 error if the authorisation is not valid or a 400 error if it is a bad request |
| Delete  | /deleteAccount   | Requires the username of the account and admin authorisation to delete a specific account. Gives a 200 response if deletion is successful, a 404 error if the username doesn't exist, a 401 error if the authorisation isn't given or a 400 error if its a bad request |
| Post    | /addSection      | Adds a full section and gives a 201 response if a valid title, description and thumbnail is passed. Otherwise a 400 request is given for a bad request |
| Patch    | /editSection   | can change a title, description or thumbnail of a section if valid section ID is given. Responds with 200 if it is successful, 400 if not |
| Delete    | /deleteSection   | Require a valid sectionID that is going to be deleted, if one isn't given it is a bad request and a 400 response is given, else it is successful with a 200 response code |
| Post  | /addSectionContent     | Needed are a sectionID, a title, content type (either a document or a video) as well as the document needed to upload if it is a document or the location of the video if it is a video. If all these are given and are valid, a 201 response is given and the correct content is added to the section. If not, it is a bad request and a 400 respose is given.|
| Patch  | /editSectionContent   | The documentID is needed to identify which document needs changing, in addition to either a title, document as a file or a location for a video to change any of these to the selected document. This will then change what is desired if successful and send a 200 response, else it will be a bad request and send a 400 response |
| Delete   | /deleteSectionContent   | Requires a valid documentID for one to be deleted. If deletion occurs, a 200 response is given, else if the documentID doesn't exist give a 400 response|
