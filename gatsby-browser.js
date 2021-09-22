import React from 'react'
import AuthProvider from './src/context/auth'

export const wrapPageElement = ({ element, props }) => {

    return (
        <AuthProvider {...props} >
            {element}
        </AuthProvider >
    )
}