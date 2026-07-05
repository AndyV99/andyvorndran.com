import { useEffect, useState } from "react";

function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}

function formatGmtOffset(date: Date) {
  const offsetHours = -date.getTimezoneOffset() / 60;
  const sign = offsetHours >= 0 ? "+" : "-";
  return `GMT${sign}${Math.abs(offsetHours)}`;
}

function Navbar() {
  const now = useClock();
  const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return (
    <header className="top-nav">
      <p className="brand">Andy Vorndran</p>
      <div className="nav-right">
        <nav aria-label="Main navigation">
          <ul className="nav-links">
            <li>
              <a className="nav-link" href="#index">
                Index
              </a>
            </li>
            <li>
              <a className="nav-link" href="#contact">
                Contact
              </a>
            </li>
          </ul>
        </nav>
        <p className="nav-clock" aria-hidden="true">
          <span className="nav-clock-dot" />
          {time} / {formatGmtOffset(now)}
        </p>
      </div>
    </header>
  );
}

export default Navbar;
