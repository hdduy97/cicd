import React from 'react'

import { useParams } from 'react-router-dom'

const Index = () => {
    const params = useParams()

    const { id } = params

    return (
        <div>
            Category {id}
        </div>
    )
}

export default Index
