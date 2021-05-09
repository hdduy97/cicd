import React from 'react'

import './navContent.scss'

const NavContent = ({ children }) => {
    return (
        <div className="sidebar sidebar-main">
            <div className="nav-content">
                {children}
            </div>
        </div>
    )
}

export default NavContent
