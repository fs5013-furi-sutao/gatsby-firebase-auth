import React, { useContext } from "react"
import PropTypes from "prop-types"
import { Link, navigate } from "gatsby"

import { AuthContext } from "../context/auth"
import firebase from 'gatsby-plugin-firebase'

const Header = ({ siteTitle, props }) => {

  const { user } = useContext(AuthContext)
  const { path } = props

  const handleLogout = async () => {
    await firebase.auth().signOut()
    navigate("/login")
  }

  return (
    <header>

      <div className="header-container">
        <h1 className="site-title">
          <Link to="/">
            {siteTitle}
          </Link>
        </h1>

        <div className="button-container">
          {!user ? (
            <>
              {path !== '/login/' ? (
                <div>
                  <button className="header-button">
                    <Link to="/login">
                      ログイン
                    </Link>
                  </button>
                </div>
              ) : <></>
              }

              {path !== '/register/' ? (
                <div>
                  <button className="header-button">
                    <Link to="/register">
                      登録
                    </Link>
                  </button>
                </div>
              ) : <></>
              }
            </>
          ) :
            (
              <>
                <p className="header-disp-name" >{user.displayName}</p>
                <div>
                  <button className="header-button" onClick={handleLogout}>
                    <Link to="#!">
                      ログアウト
                    </Link>
                  </button>
                </div>
              </>)
          }
        </div>

      </div>
    </header >
  )
}

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header