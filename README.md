<p align="center">
  <a href="https://www.gatsbyjs.com">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>

## プラグインのインストール

3つのプラグインをインストールする

``` console
yarn add dotenv firebase gatsby-plugin-firebase
```

``` json
{
  "dependencies": {
    "dotenv": "^8.2.0",
    "firebase": "^7.24.0",
    "gatsby-plugin-firebase": "^0.2.0-beta.4",
  },
}
```

## ローカルサーバの確認

ローカルサーバを起動し http://localhost:8000/ にアクセスして、
Gatsby Default Starter のサイトが問題なく表示されることを確認する

``` console
yarn start
```

## .env ファイルの作成

ルートに .env ファイル作成し、Firebase の API キーを記載する

``` txt
API_KEY=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AUTH_DOMAIN=XXXX.firebaseapp.com
DATABASE_URL=https://XXXX.firebaseio.com
PROJECT_ID=XXXX-XXXX-XXXX-XXXX
STORAGE_BUCKET=XXXX.appspot.com
MESSAGING_SENDER_ID=000000000000
APP_ID=0:000000000000:web:XXXXXXXXXXXXXXXXXXXXXX
```

## gatsby-config への追記

Firebase authentication のクレデンシャル情報を .env ファイルから読み込めるようにする。

``` js
require('dotenv').config()

module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: process.env.API_KEY,
          authDomain: process.env.AUTH_DOMAIN,
          databaseURL: process.env.DATABASE_URL,
          projectId: process.env.PROJECT_ID,
          storageBucket: process.env.STORAGE_BUCKET,
          messagingSenderId: process.env.MESSAGING_SENDER_ID,
          appId: process.env.APP_ID,
        },
      },
    },
  ],
}
```

## AuthProvider の作成

src/context/auth.jsx

``` jsx
import React, { createContext, useState, useEffect } from 'react'
import firebase from 'gatsby-plugin-firebase'

export const AuthContext = createContext({})

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState()

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => setUser(user))
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
```

## Gatsby Browser API の修正

gatsby-browser.js

``` jsx
import 'firebase/auth'
import React from 'react'
import AuthProvider from './src/context/auth'

export const wrapPageElement = ({ element, props }) => {

    return (
        <AuthProvider {...props} >
            {element}
        </AuthProvider >
    )
}
```

## 必要な Components を揃える

### header.jsx

header.js を編集する。

``` jsx
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
                <p className="header-disp-name" >{user.displayName}</p>
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
```

### layout.jsx

layout.js を編集する。

``` jsx
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
```

### parseCodeToJaErrorMessage.js

認証エラーメッセージを日本語に変換する js を作成する。

``` js
const parseCodeToJaErrorMessage = (e) => {
    switch (e.code) {
        case 'auth/cancelled-popup-request':
        case 'auth/popup-closed-by-user':
            return null;
        case 'auth/email-already-in-use':
            return 'メールアドレスまたはパスワードが違います';
        case 'auth/invalid-email':
            return 'メールアドレスの形式が正しくありません';
        case 'auth/user-disabled':
            return 'サービスの利用が停止されています';
        case 'auth/user-not-found':
            return 'メールアドレスまたはパスワードが違います';
        case 'auth/user-mismatch':
            return 'メールアドレスまたはパスワードが違います';
        case 'auth/weak-password':
            return 'パスワードは6文字以上にしてください';
        case 'auth/wrong-password':
            return 'メールアドレスまたはパスワードが違います';
        case 'auth/popup-blocked':
            return '認証ポップアップがブロックされました。\
            ポップアップブロックをご利用の場合は設定を解除してください';
        case 'auth/operation-not-supported-in-this-environment':
        case 'auth/auth-domain-config-required':
        case 'auth/operation-not-allowed':
        case 'auth/unauthorized-domain':
            return '現在この認証方法はご利用頂けません';
        case 'auth/requires-recent-login':
            return '認証の有効期限が切れています';
        default:
            return '認証に失敗しました。しばらく時間をおいて再度お試しください';

    }
}

export default parseCodeToJaErrorMessage
```

### login-core.jsx

ログインフォーム部品として新規作成する。

``` jsx
import React, { useState, useContext } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { AuthContext } from '../context/auth'
import { navigate } from 'gatsby'
import parseCodeToJaErrorMessage from './parseCodeToJaErrorMessage'

const LoginCore = () => {
    const [data, setData] = useState({
        email: "",
        password: "",
        code: null,
        error: null,
    })

    const { setUser } = useContext(AuthContext)

    const handleChange = e => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setData({ ...data, error: null })
        try {
            const result = await firebase
                .auth()
                .signInWithEmailAndPassword(data.email, data.password)
            setUser(result)
            navigate("/")
            window.location.replace("/")
        } catch (err) {
            setData({ ...data, error: err.message, code: err.code })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">
                <label className="form-label" htmlFor="email">
                    メールアドレス
                </label>
                <input className="form-input"
                    type="text"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="example@freestyles.jp"
                />
                <div>
                    <label className="form-label" htmlFor="password">
                        パスワード
                    </label>
                    <input className="form-input"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        placeholder="password"
                    />
                </div>
                {data.error ? <p className="error-message">
                    {
                        parseCodeToJaErrorMessage(data)
                    }</p> : <p>&nbsp;</p>
                }
            </div>
            <input className="form-button" type="submit" value="ログインする" />
        </form>
    )
}

export default LoginCore
```

### register-core.jsx

ユーザー登録フォーム部品として新規作成する。

``` jsx
import React, { useState, useContext } from 'react'
import firebase from 'gatsby-plugin-firebase'
import { AuthContext } from '../context/auth'
import { navigate } from 'gatsby'
import parseCodeToJaErrorMessage from './parseCodeToJaErrorMessage'

const RegisterCore = () => {
    const [data, setData] = useState({
        displayName: "",
        email: "",
        password: "",
        code: null,
        error: null,
    })

    const { setUser } = useContext(AuthContext)

    const handleChange = e => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        setData({ ...data, error: null })
        try {
            const result = await firebase
                .auth()
                .createUserWithEmailAndPassword(data.email, data.password)

            const user = await firebase.auth().currentUser
            user.updateProfile({
                displayName: data.displayName
            })

            setUser(result)

            navigate("/")
        } catch (err) {
            setData({ ...data, error: err.message, code: err.code })
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-container">
                <label className="form-label" htmlFor="displayName">氏名</label>
                <input class="form-input"
                    type="text"
                    name="displayName"
                    value={data.displayName}
                    onChange={handleChange}
                />
                <label className="form-label" htmlFor="email">
                    メールアドレス
                </label>
                <input className="form-input"
                    type="text"
                    name="email"
                    value={data.email}
                    onChange={handleChange}
                    placeholder="example@freestyles.jp"
                />
                <div>
                    <label className="form-label" htmlFor="password">
                        パスワード
                    </label>
                    <input className="form-input"
                        type="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        placeholder="password"
                    />
                </div>
                {data.error ? <p className="error-message">
                    {
                        parseCodeToJaErrorMessage(data)
                    }</p> : <p>&nbsp;</p>
                }
            </div>
            <input className="form-button" type="submit" value="登録する" />
        </form>
    )
}

export default RegisterCore
```

## pages の編集

### index.jsx 

``` jsx
import React from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"

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
```

### login.jsx

``` jsx
import React from 'react'

import Layout from '../components/layout'
import Seo from '../components/seo'
import LoginCore from '../components/login-core'

const LoginPage = ({ ...props }) => (
    <Layout props={props}>
        <Seo title="ログイン" />
        <h1>ログイン</h1>
        <p>管理者から届いたログイン情報を入力してください</p>
        <LoginCore />
    </Layout>
)

export default LoginPage
```

### register.jsx

``` jsx
import React from 'react'

import Layout from '../components/layout'
import Seo from '../components/seo'
import RegisterCore from '../components/register-core'

const RegisterPage = ({ ...props }) => (
  <Layout props={props}>
    <Seo title="ユーザー登録" />
    <h1>ユーザー登録</h1>
    ユーザを登録してください
    <RegisterCore />
  </Layout>
)

export default RegisterPage
```

### page-2.jsx

``` jsx
import * as React from 'react'
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
```

### using-typescript.tsx

``` tsx
// If you don't want to use TypeScript you can delete this file!
import * as React from "react"
import { PageProps, Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

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
```

## CSS を追記する

### layout.css

src/components/layout.css

``` css
body {
  font-family: 'メイリオ', georgia, serif;
}

.container {
  margin: 0 auto;
  max-width: 960px;
  padding: 0 1.0875rem 1.45rem;
}

header {
  background: rebeccapurple;
  margin-bottom: 1.45rem;
}

.header-container {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 960px;
  padding: 1.45rem 1.0875rem;
}

.site-title a {
  color: #fff;
  text-decoration: none;
}

.header-disp-name {
  margin: 0.2em 2em;
  color: #fff;
  font-size: 1.0em;
}

.button-container {
  display: flex;
  justify-content: flex-end;
}

.header-button {
  margin-left: 2em;
  padding: 0.2em 1em;
  border-radius: 4px;
  border: none;
  background-color: #fff;
  font-size: 0.8em;
}

.header-button a {
  text-decoration: none;
}

.form-label {
  display: block;
}

.form-input {
  margin: 1em 0 2em 0;
  padding: 0.4em 1em;
}

.form-button {
  display: inline-block;
  margin: 0 2em 4em 0;
  padding: 1em 2em;
  border-radius: 6px;
  border: none;
  background-color: rebeccapurple;
  color: #fff;
  font-size: 1.0em;
  cursor: pointer;
}

.form-button a {
  color: #fff;
  text-decoration: none;
}

.error-message {
  color: red;
}
```
