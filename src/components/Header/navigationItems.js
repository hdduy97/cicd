import React from 'react'

import { Link } from 'react-router-dom'

const NavigationItems = ({ category, hoverCategories, setHoverCategories }) => {
  const onItemEnter = (item) => {
    if(item.children_data.length > 0 && !hoverCategories.some(el => el.id === item.id)) {
      setHoverCategories([...hoverCategories.filter(el => el.level !== item.level), {
        id: item.id,
        level: item.level
      }])
    }
  }

  const onItemLeave = (category) => {
    setHoverCategories(hoverCategories.filter(el => el.id !== category.id && el.level <= category.level))
  }

  if (category.is_active) {
    if (category.children_data && category.children_data.length > 0 && hoverCategories.some((el) => el.id === category.id)) {
      const childCategory = category.children_data.map(el => {
        return (
          <NavigationItems category={el} key={el.id} hoverCategories={hoverCategories} setHoverCategories={setHoverCategories} />
        )
      })
  
      return (
        <li 
          key={category.id}
          className="item"
          onMouseEnter={() => onItemEnter(category)}
          onMouseLeave={() => onItemLeave(category)}
        >
          <Link to={`/category/${category.id}`}>
            <span>{category.name}</span>
          </Link>
          <ul className={`children-category level-${category.level}`}>
            {childCategory}
          </ul>
        </li>
      )
    }
  
    if (category.level === 2 || hoverCategories.some((el) => el.id === category.parent_id)) {
      return (
        <li 
          key={category.id}
          className="item"
          onMouseEnter={() => onItemEnter(category)}
          onMouseLeave={() => onItemLeave(category)}
        >
          <Link to={`/category/${category.id}`}>
            <span>{category.name}</span>
          </Link>
        </li>
      )
    }
  }

  return null
}

export default NavigationItems