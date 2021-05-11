import React from 'react'

import Navigation from './navigation'
import Panel from './panel'

const Header = () => {
  return (
    <header className="page-header">
      <Panel />
      <Navigation />
    </header>
  )
}

export default Header