import Link from "next/link";

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
          <Link href="/login" className="menu-link">Login</Link>
        </nav>
      </div>
    </header>
  );
}
