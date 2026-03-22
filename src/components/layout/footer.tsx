export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="py-6 px-6 text-center text-sm text-muted-foreground">
      <div className="flex flex-col items-center gap-1">
        <p>
          Built with ❤️ by{' '}
          <a
            href="https://meetsid.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-primary hover:underline"
          >
            Sid
          </a>
          {' · Happy scanning'}
        </p>
        <p>
          © {year} Sid. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
