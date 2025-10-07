import { Link } from "react-router-dom";

function NavLink({ href, children }) {
    return (
        <Link to={href} className="hover:underline">
            {children}
        </Link>
    );
}

export default NavLink;