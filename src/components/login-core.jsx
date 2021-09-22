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