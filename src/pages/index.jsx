import React from 'react'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'

import Layout from '../components/layout'
import Seo from '../components/seo'

const IndexPage = ({ ...props }) => (

  <Layout props={props}>
    <Seo title="Home" />
    <h1>Welcome Page</h1>
    <p>Gatsby に Firebase Authentication を組み込んだテストプロジェクトです。</p>
    <StaticImage
      src="../images/gatsby-astronaut.png"
      width={300}
      quality={95}
      formats={["auto", "webp", "avif"]}
      alt="A Gatsby astronaut"
      style={{ marginBottom: `1.45rem` }}
    />

    <div>
      <button className="form-button">
        <Link to="/page-2/">次のページに進む</Link>
      </button>
      <button className="form-button">
        <Link to="/using-typescript/">TypeScript ページに進む</Link>
      </button>
    </div>
  </Layout>
)

export default IndexPage