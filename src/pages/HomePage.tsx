import { allProjects, domainNames } from "../data/projects";
import ProjectIndex from "../components/ProjectIndex";

function HomePage() {
  return (
    <>
      <section className="hero">
        <div>
          <p className="eyebrow">Full-stack developer</p>
          <h1 className="hero-title">
            Ships end-to-end
            <br />
            features to <em>production.</em>
          </h1>
          <p className="hero-copy">
            Clean UI, reliable APIs, automated delivery. This is the working
            index of what I&apos;ve shipped — web apps deployed to real
            infrastructure, and a small universe of Minecraft modding tools
            published under a separate alias.
          </p>
          <div className="hero-actions">
            <a className="is-primary" href="#index">
              View index →
            </a>
            <a href="#contact">Contact</a>
            <a
              href="https://github.com/AndyV99"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub ↗
            </a>
          </div>
        </div>
        <dl className="meta-rail">
          <div className="meta-item">
            <dt>Stack</dt>
            <dd>React · TypeScript · Node</dd>
          </div>
          <div className="meta-item">
            <dt>Shipped</dt>
            <dd className="tabular">
              {allProjects.length} projects · {domainNames.length} domains
            </dd>
          </div>
          <div className="meta-item">
            <dt>Delivery</dt>
            <dd>CI/CD to Cloud Run, App Engine, Cloudflare Pages</dd>
          </div>
        </dl>
      </section>

      <section className="capabilities">
        <div className="capability">
          <p className="tag">01 — Build</p>
          <h3>Full-stack delivery</h3>
          <p>
            TypeScript UI across several frameworks, Node/NestJS APIs, and
            databases shipped as cohesive, end-to-end features.
          </p>
        </div>
        <div className="capability">
          <p className="tag">02 — Refine</p>
          <h3>Systems &amp; performance</h3>
          <p>
            Reusable components and Core Web Vitals-conscious UI — interfaces
            that stay fast and accessible as products grow.
          </p>
        </div>
        <div className="capability">
          <p className="tag">03 — Operate</p>
          <h3>CI/CD &amp; observability</h3>
          <p>
            Pipelines that test, build, and deploy automatically, with logs
            and metrics that make release day calm.
          </p>
        </div>
      </section>

      <ProjectIndex />

      <footer className="footer" id="contact">
        <div>
          <h2 className="footer-title">Let&apos;s talk.</h2>
          <p className="footer-copy">
            Open to full-stack and front-end roles, and always happy to
            compare notes on shipping side projects.
          </p>
        </div>
        <div className="footer-links">
          <a href="mailto:andyvorndran99@gmail.com">Email ↗</a>
          <a
            href="https://github.com/AndyV99"
            target="_blank"
            rel="noreferrer noopener"
          >
            GitHub ↗
          </a>
        </div>
        <div className="colophon">
          <span>Andy Vorndran — Built with React &amp; TypeScript</span>
          <span>Deployed via Google Cloud Build</span>
        </div>
      </footer>
    </>
  );
}

export default HomePage;
