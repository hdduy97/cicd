import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [posts, setPosts] = useState([])

  const postsRender = posts.map(post => (
    <li key={post.id}>
      <p>{post.title}</p>
      <p>{post.body}</p>
    </li>
  ))

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts')
    
        setPosts(data)
      } catch(e) {
        alert(e.response.data.message)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div>
      <ul>
        {postsRender}
      </ul>
    </div>
  )
}

export default App;
