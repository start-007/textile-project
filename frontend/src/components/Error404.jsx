import "../styles/Error404.css";
import { Link } from "react-router-dom";

export default function Error500() {
  return (
    <div className="error-page">
      <h1>400</h1>
      <p>Not Found</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}