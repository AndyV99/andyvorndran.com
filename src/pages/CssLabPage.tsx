import IconLink from '../components/IconLink'
import { demos } from '../data/demos'
import '../styles/demos/demo-neon.css'
import '../styles/demos/demo-noise.css'
import '../styles/demos/demo-scanline.css'

function CssLabPage() {
  return (
    <section className="panel">
      <p className="eyebrow">CSS Lab</p>
      <h1 className="section-title">Visual Experiments and Effects</h1>
      <p className="section-copy">
        This space highlights UI prototypes and styling tricks I can adapt into real products.
      </p>
      <div className="demo-grid">
        {demos.map((demo) => (
          <article className={demo.className} key={demo.title}>
            <div className="demo-card-header">
              <h2>{demo.title}</h2>
              <IconLink url={demo.link} icon="github" label={`Open GitHub for ${demo.title}`} />
            </div>
            <p>{demo.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CssLabPage
