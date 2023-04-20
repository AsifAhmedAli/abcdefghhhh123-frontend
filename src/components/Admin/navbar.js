import { Link, useMatch, useResolvedPath } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="nav">
      <ul>
        <CustomLink to="/location">Location</CustomLink>
        <CustomLink to="/clothingcat">Clothing Category</CustomLink>
        <CustomLink to="/clothing">Clothing</CustomLink>
        <CustomLink to="/preference">Preference</CustomLink>
        <CustomLink to="/recommend">Recommend</CustomLink>
       
      </ul>
      <ul>
      <CustomLink to="/SignUp">Add Admin</CustomLink>
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




