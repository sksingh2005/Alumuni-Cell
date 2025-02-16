<body>
    <h1>Alumni Cell NITJ</h1>
    <p>Welcome to the <strong>Alumni Cell NITJ</strong> project! This repository contains both the frontend and backend code for the platform. Follow the instructions below to set up and run the project locally.</p>
    <h2>Project Structure</h2>
    <ul>
        <li><strong>project/</strong> - Contains the React frontend code.</li>
        <li><strong>server/</strong> - Contains the Express backend code.</li>
    </ul>
    <h2>Prerequisites</h2>
    <p>Ensure you have the following installed before proceeding:</p>
    <ul>
        <li><a href="https://nodejs.org/">Node.js</a> (Recommended: Latest LTS version)</li>
        <li><a href="https://www.mongodb.com/">MongoDB</a></li>
        <li><a href="https://git-scm.com/">Git</a></li>
    </ul>
    <h2>Installation & Setup</h2>
    <h3>1. Clone the Repository</h3>
    <pre><code>git clone https://github.com/sksingh2005/Alumuni-Cell/.git
cd alumni-cell-nitj</code></pre>
    <h3>2. Set Up the Backend (Express Server)</h3>
    <pre><code>cd server
npm install</code></pre>
    <h3>3. Configure Environment Variables</h3>
    <p>Create a <code>.env</code> file inside the <code>server/</code> directory and add the following:</p>
    <pre><code>MONGODB_URL="your_mongodb_connection_string"</code></pre>
    <h3>4. Start the Backend Server in server directory</h3>
    <pre><code>node index.js </code></pre>
    <p>The Express server will now run on <code>http://localhost:5000</code>.</p>
    <h3>5. Set Up the Frontend (React App) in project directory</h3>
    <pre><code>cd ../project
npm install</code></pre>
    <h3>6. Start the Frontend Application</h3>
    <pre><code>npm run dev</code></pre>
    <p>The React application will now run on <code>http://localhost:5173</code>.</p>
    <h2>Notes</h2>
    <ul>
        <li>Ensure MongoDB is running locally or use a cloud-based MongoDB instance.</li>
        <li>The frontend should automatically connect to the backend if both are running on their respective ports (<code>3000</code> for React, <code>5000</code> for Express).</li>
    </ul>
    <h2>Contributing</h2>
    <p>Feel free to fork the repository, make improvements, and submit pull requests!</p>
</body>
</html>

