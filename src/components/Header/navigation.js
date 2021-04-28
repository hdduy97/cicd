import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './navigation.scss'

import NavigationItems from './navigationItems'

const Navigation = () => {
  const [categories, setCategories] = useState([])
  const [hoverCategories, setHoverCategories] = useState([])

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get(process.env.REACT_APP_RESTURL + '/categories')

      setCategories(data.children_data)
    }

    fetchCategories()
  }, [])

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