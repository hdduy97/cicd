import React from 'react'

import { Link, useRouteMatch } from 'react-router-dom'

import NavContent from '../../../navContent'

import './layout.scss'

const Layout = ({ children }) => {
    const routeMatch = useRouteMatch()

    const { path } = routeMatch

    const navItems = [
        { label: 'My Account', url: '/customer/account' },
        { label: 'My Orders', url: '/sales/order/history' },
    ]

    const navItemsRender = navItems.map(item => (
        <li key={item.url} className={`nav item ${path === item.url && 'current'}`}>
            <Link to={item.url}>{item.label}</Link>
        </li>
    ))
    return (
        <div className="columns">
            <NavContent>
                <ul>{navItemsRender}</ul>
            </NavContent>
            <div className="column main">
                {children}
            </div>
        </div>
    )
}

export default Layout
