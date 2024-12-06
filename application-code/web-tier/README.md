
# Movie Inventory UI  

This project is a frontend application built with **React 17** and **MUI 5**. It provides a user interface for managing a movie inventory, including features such as viewing movies in a table format, filtering by genre, pagination, and the ability to add or delete movies.  

## Features  
- Display movies in a table with columns for relevant details.  
- Filter movies by genre.  
- Paginate through large movie inventories.  
- Add new movies through an "Add Movie" button.  
- Delete movies from the inventory.  

## Requirements  
- **Node.js**: Version 16 or higher.  
- **NPM**: Installed alongside Node.js to manage dependencies.  

## Setup  

1. **Clone the Repository**  
   ```bash 
   git clone https://github.com/alexanderzg/AWS_3_Tier_Web_Architecture.git 
   cd application-code
   cd web-tier 
   ```  

2. **Install Dependencies**  
   Run the following command in the project folder to install all required packages:  
   ```bash  
   npm install  
   ```  

3. **Run the Application**  
   Start the React development server with:  
   ```bash  
   npm start  
   ```  

   The application will run on `http://localhost:3000`.  

## Features Details  

### Movie Table  
The movies are displayed in a table format using **MUI Table** components, allowing for a clean and responsive layout.  

### Filters  
A dropdown select input is available to filter movies by genre, enabling users to narrow down the inventory based on their preferences.  

### Pagination  
Pagination controls allow users to navigate through the inventory efficiently, even with large datasets.  

### Add Movie  
The "Add Movie" button opens a form where users can enter details like title, director, release year, and genre.  

### Delete Movie  
Each movie entry has a delete button to remove the movie from the inventory. 

## Notes  
- Ensure that **Node.js** and **NPM** are installed on your system before running the application.  
- This project communicates with a backend REST API to manage movie data. Ensure the backend is running and accessible.  

##
This UI leverages the Tokyo React template at https://github.com/bloomui/tokyo-free-black-react-admin-dashboard
