function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-4 py-3 text-center text-xs text-text-muted">
      Hospital Management System — College Project ©{" "}
      {new Date().getFullYear()}
    </footer>
  );
}

export default Footer;