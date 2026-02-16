import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <section className="panel">
      <h1 className="hero-title">
        Full-stack web developer shipping apps to production.
      </h1>

      <p className="hero-copy">
        I build end-to-end features—clean UI, reliable APIs, and automated
        delivery— with a focus on performance, accessibility, and maintainable
        systems. This site highlights shipped projects, experiments, and how I
        work.
      </p>

      <div className="hero-actions">
        <Link className="button button-primary" to="/projects">
          View Projects
        </Link>
        <Link className="button button-muted" to="/contact">
          Contact
        </Link>
        <Link className="button button-muted" to="/css-lab">
          CSS Lab
        </Link>
      </div>

      <div className="feature-grid">
        <article className="feature-card">
          <h2>Full-Stack Delivery</h2>
          <p>
            TypeScript UI across several frameworks, Node/NestJS APIs,
            databases, and production patterns shipped as cohesive, end-to-end
            features.
          </p>
        </article>

        <article className="feature-card">
          <h2>UI Engineering & Design Systems</h2>
          <p>
            Reusable components, consistent UX, and maintainable styling—systems
            that scale as products grow.
          </p>
        </article>

        <article className="feature-card">
          <h2>Performance & Accessibility</h2>
          <p>
            Core Web Vitals, responsive layout, and a11y best practices for
            fast, readable, keyboard-friendly interfaces.
          </p>
        </article>

        <article className="feature-card">
          <h2>Testing & Quality Gates</h2>
          <p>
            Type safety, linting, and pragmatic tests (unit/integration/e2e
            where it matters) to keep release day calm.
          </p>
        </article>

        <article className="feature-card">
          <h2>Automated CI/CD</h2>
          <p>
            Pipelines that run checks, build artifacts, and automate deploys so
            shipping stays fast and safe.
          </p>
        </article>

        <article className="feature-card">
          <h2>Cloud & Observability</h2>
          <p>
            Deploying and operating apps with logs/metrics, sensible alerts, and
            reliable environments.
          </p>
        </article>
      </div>
    </section>
  );
}

export default LandingPage;
