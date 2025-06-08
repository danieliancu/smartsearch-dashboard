export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="footer-title">smartsearch<br /><span className="footer-title-sub">dashboard</span></span>
        </div>
        <div className="footer-links">
          <div>
            <strong>Product</strong>
            <a href="#">Features</a>
            <a href="#">Integrations</a>
            <a href="#">Pricing</a>
          </div>
          <div>
            <strong>Resources</strong>
            <a href="#">Help Center</a>
            <a href="#">API Docs</a>
            <a href="#">Guides</a>
          </div>
          <div>
            <strong>Company</strong>
            <a href="#">About Us</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div className="footer-meta">
          &copy; {new Date().getFullYear()} smartsearch dashboard. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
