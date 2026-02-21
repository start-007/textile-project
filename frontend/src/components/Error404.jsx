import "../styles/Error404.css";
import { Link } from "react-router-dom";

export default function Error404() {
  return (
    <div className="error-page">
      <h1>404</h1>
      <p>Oops! Page not found.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}