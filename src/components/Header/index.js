import React from 'react'

import Panel from './panel'
import Header from './header'

const Index = ({ logo }) => {
  return (
    <header className="page-header">
      <Panel />
      <Header logo={logo} />
    </header>
  )
}

export default Index