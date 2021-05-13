import React, { useState } from 'react'
import './navigation.scss'

import NavigationItems from './navigationItems'

const Navigation = ({ categories }) => {
  const [hoverCategories, setHoverCategories] = useState([])

  const categoriesRender = categories.map(category => {
    return (
      <NavigationItems 
        category={category}
        key={category.id}
        hoverCategories={hoverCategories}
        setHoverCategories={setHoverCategories}
      />
    )
  })

  return (
    <div className="nav-sections">
      <nav className="naviation">
        <ul className="nav-items">
          {categoriesRender}
        </ul>
      </nav>
    </div>
  )
}

export default Navigation