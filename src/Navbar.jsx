import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="nav">
        
      <Link to="/" className="site-title">
      <img 
          src="/logo.png"  // The path should be relative to the public directory
          alt="Site Logo" 
          className="nav-logo" 
          style={{ width: "40px", height: "40px", marginRight: "20px" }} 
        />
        Certificate Status
      </Link>
      <ul>
        <CustomLink to="/transcript">Transcript</CustomLink>
        <CustomLink to="/gradesheet">Gradesheet</CustomLink>
        <CustomLink to="/history">History</CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}