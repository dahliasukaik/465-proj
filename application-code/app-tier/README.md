
# Movie REST API  

This project is a simple REST API for managing a collection of movies, built with **Node.js** and **Express.js**. It provides endpoints to add, delete, and retrieve movie entries.  

## Features  
- Add new movies to the collection.  
- Delete movies from the collection by ID.  
- Retrieve all movies.  

## Requirements  
- **Node.js**: Version 16 or higher.  
- **NPM**: Installed alongside Node.js to manage dependencies.  

## Setup  

1. **Clone the Repository**  
   ```bash  
   git clone https://github.com/alexanderzg/AWS_3_Tier_Web_Architecture.git 
   cd application-code
   cd app-tier
   ```  

2. **Install Dependencies**  
   Run the following command in the project folder to install all required packages:  
   ```bash  
   npm install  
   ```  

3. **Run the Application**  
   Start the server with the command:  
   ```bash  
   node index.js  
   ```  

   The server will start and listen on the configured port (default: `4000`).  

## API Endpoints  

### 1. **Retrieve All Movies**  
- **GET** `/inventory`  
- **Description**: Fetches a list of all movies.  

### 2. **Add a New Movie**  
- **POST** `/inventory`  
- **Description**: Adds a new movie to the collection.  
- **Request Body**:  
  ```json  
  {  
    "name": "",
    "posterImg": "",
    "coverImg": "",
    "description": "",
    "rating": "",
    "year": "",
    "tagLine": "",
    "minutes": "",
    "genres": ""
  }  
  ```  

### 3. **Delete a Movie by ID**  
- **DELETE** `/inventory/:id`  
- **Description**: Removes a movie from the collection by its unique ID. 
- **Parameters**:  
  - `id` (required): The ID of the movie to delete.  

## Notes  
- Ensure that **Node.js** and **NPM** are installed on your system before running the application.  
- Use a REST client (e.g., Postman or cURL) to interact with the API.
