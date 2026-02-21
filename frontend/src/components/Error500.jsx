import "../styles/Error500.css";
import { Link } from "react-router-dom";

export default function Error500() {
  return (
    <div className="error-page">
      <h1>500</h1>
      <p>Internal Server Error</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}