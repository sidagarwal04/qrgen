export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="shrink-0 py-2 px-3 text-center text-xs text-muted-foreground md:text-sm">
      <div className="flex flex-col items-center gap-0.5">
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
