import React, { useContext } from 'react'
import PropTypes from 'prop-types'
import { useStaticQuery, graphql } from 'gatsby'

import Header from './header'
import './layout.css'
import { AuthContext } from '../context/auth'

const Layout = ({ children, props }) => {
  const { user } = useContext(AuthContext)

  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)
  const { path } = props

  return (
    <>
      <Header props={props} siteTitle={data.site.siteMetadata?.title || `Title`} />
      <div className="container">
        {

          path === '/' || path === '/login/' || path === '/register/' ?
            (<main>{children}</main>) :
            !user ?
              (
                <main>
                  <h1 className="access-error-msg">
                    アクセスエラー
                  </h1>
                </main>
              ) : (<main>{children}</main>)
        }
        <footer
          style={{
            marginTop: `2rem`,
          }}
        >
          &copy; {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.com">Gatsby</a>
        </footer>
      </div>
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout