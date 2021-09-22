import React from 'react'
import { Link } from 'gatsby'

import Layout from '../components/layout'
import Seo from '../components/seo'

const SecondPage = ({ ...props }) => (
  <Layout props={props}>
    <Seo title="Page two" />
    <h1>セカンドページ</h1>
    <p>ようこそセカンドページへ。</p>

    <div>
      <button className="form-button">
        <Link to="/">ウェルカムページに戻る</Link>
      </button>
    </div>
  </Layout>
)

export default SecondPage