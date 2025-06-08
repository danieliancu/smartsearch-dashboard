
export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="logo-block">
          <span className="site-title">
            <span style={{ display:"inline-block", width:"100%" }}>smartsearch</span>
            <span className="site-title-sub">dashboard</span>
          </span>
        </div>
        <nav className="header-menu">
          <a href="/login" className="menu-link">Login</a>
        </nav>
      </div>
    </header>
  );
}
