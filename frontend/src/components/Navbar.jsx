import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname.startsWith(path) ? 'nav-link active' : 'nav-link';

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-wrench-adjustable-circle me-2"></i>
          OS-Service
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className={isActive('/ordens-servico')} to="/ordens-servico">
                Ordens de Serviço
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/tipos-servico')} to="/tipos-servico">
                Tipos de Serviço
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
