# Gradesheet Status Website

This website allows BITS Pilani Goa Campus students and alumni to apply for Duplicate Gradesheets and Transcripts for their higher studies. It then shows the status of the application and its current stage.  

The project is a work in progress.  

Open a Terminal or Command Prompt.
Navigate to the Desired Directory

### Run the following:
```
git clone --depth 1 https://github.com/AarcW/Certificate-Status.git
npm install
npm install react-router-dom
npm install jwt-decode
npm install dotenv
```
Create a file named .env in the same directory as package.json with the following text :
```
VITE_GOOGLE_CLIENT_ID= Private_Client_ID
```
Replace "Private_Client_ID" with the Client ID generated from [console.cloud.google.com](https://console.cloud.google.com/) refer to this [youtube video](https://www.youtube.com/watch?v=roxC8SMs7HU&list=PLBCO7wfF-roHv6vlrH2RStyt_vkpEhy_2) or search Creating Client ID for Google OAuth 2.0.

### Now run this command in terminal:
```
npm run dev 
```
The website will start running on the following URL:
http://localhost:5173/

NOTE: Internet connection is needed as the application contacts google servers for Google OAuthentication