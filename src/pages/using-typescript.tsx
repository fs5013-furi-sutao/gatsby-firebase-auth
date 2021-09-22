import React from 'react'
import { PageProps, Link, graphql } from 'gatsby'

import Layout from '../components/layout'
import Seo from '../components/seo'

type DataProps = {
  site: {
    buildTime: string
  }
}

const UsingTypescript: React.FC<PageProps<DataProps>> = ({ data, path, ...props }) => (
  <Layout props={props}>
    <Seo title="Using TypeScript" />
    <h1>標準で TypeScript をサポートしています</h1>
    <p>
      ページやコンポーネントなどのために、<code>.ts/.tsx</code> ファイルを作成し、
      記述することができます。なお、<code>gatsby-*.js</code> ファイル
      (<code>gatsby-node.js</code> と同様)は、現在のところ TypeScript をサポートしていません。
    </p>
    <p>
      タイプチェックのためには、npm 経由で typescript をインストールし、
      <code>tsc --init</code> を実行して <code>tsconfig</code> ファイルを作成する必要があります。
    </p>
    <p>
      あなたは現在、{data.site.buildTime} に作成された
      「{path}」というページにいます。
    </p>
    <p>
      もっと詳しく知りたい方は、{" "}
      <a href="https://www.gatsbyjs.com/docs/typescript/">
        TypeScript についてのドキュメント
      </a>
      をご覧ください。
    </p>

    <div>
      <button className="form-button">
        <Link to="/">ウェルカムページに戻る</Link>
      </button>
    </div>

  </Layout>
)

export default UsingTypescript

export const query = graphql`
  {
    site {
      buildTime(formatString: "YYYY-MM-DD hh:mm a z")
    }
  }
`