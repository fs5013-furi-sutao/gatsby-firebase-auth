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