import { Link } from 'react-router-dom'

export default function NavLinks({ links, pathname, onLinkClick }) {
    return links.map(({ to, label }) => (
        <Link key={to} to={to} onClick={onLinkClick} className={`group relative py-1 text-sm font-medium transition-colors duration-300 ${ pathname === to ? 'text-white' : 'text-white/70 hover:text-white' }`} >
            {label}
            <span className={`absolute left-0 right-0 bottom-0 h-px bg-white/90 transition-all duration-300 ${ pathname === to ? 'opacity-100' : 'opacity-0 group-hover:opacity-100' }`}/>
        </Link>
    ))
}
