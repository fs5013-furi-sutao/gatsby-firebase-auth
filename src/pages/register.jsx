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