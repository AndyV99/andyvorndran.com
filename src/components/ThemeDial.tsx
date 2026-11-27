import { useEffect, useState } from "react";

// Same Auto / Light / Dark knob as musicandylikes.com. The saved choice is
// applied before first paint by the inline script in index.html.
const THEMES = [
  ["system", "Auto"],
  ["light", "Light"],
  ["dark", "Dark"],
] as const;
type Theme = (typeof THEMES)[number][0];

const NEXT_THEME: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };

const STORAGE_KEY = "theme";

function readTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : "system";
  } catch {
    return "system";
  }
}

function ThemeDial() {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "system") delete root.dataset.theme;
    else root.dataset.theme = theme;
  }, [theme]);

  // Keep other open tabs in step.
  useEffect(() => {
    const sync = () => setTheme(readTheme());
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  function choose(next: Theme) {
    setTheme(next);
    try {
      if (next === "system") localStorage.removeItem(STORAGE_KEY);
      else localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage blocked: the choice lasts for this page only.
    }
  }

  return (
    <fieldset className="theme-dial">
      <legend className="visually-hidden">Colour theme</legend>
      {THEMES.map(([value, label]) => (
        <label key={value} className={`theme-dial__option theme-dial__option--${value}`}>
          <input
            type="radio"
            name="theme"
            value={value}
            checked={theme === value}
            onChange={() => choose(value)}
          />
          <span>{label}</span>
        </label>
      ))}
      {/* Clicking the knob turns it to the next setting; keyboard users have the radios. */}
      <span className="theme-dial__knob" aria-hidden="true" onClick={() => choose(NEXT_THEME[theme])} />
    </fieldset>
  );
}

export default ThemeDial;
