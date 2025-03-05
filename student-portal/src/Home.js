import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to the Attendance System</h1>
      <nav>
        <Link to="/login">Login</Link> | 
        <Link to="/teacher">Teacher Dashboard</Link> | 
        <Link to="/student">Student Dashboard</Link>
      </nav>
    </div>
  );
}

export default Home;
