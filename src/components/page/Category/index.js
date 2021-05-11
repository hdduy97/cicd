import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

const Index = () => {
    const [products, setProducts] = useState([])
    const params = useParams()

    const { id } = params

    const renderProducts = products.map(product => <li key={product.id}>{product.name}</li>)

    useEffect(() => {
        const fetchProducts = async () => {
            const { data } = await axios.get(`${process.env.REACT_APP_RESTURL}/products`, {
                params: {
                    'searchCriteria[filter_groups][0][filters][0][field]': 'category_id',
                    'searchCriteria[filter_groups][0][filters][0][value]': id,
                    'searchCriteria[filter_groups][0][filters][0][condition_type]': 'eq',
                    'searchCriteria[filter_groups][1][filters][0][field]': 'visibility',
                    'searchCriteria[filter_groups][1][filters][0][value]': '[2,4]',
                    'searchCriteria[filter_groups][1][filters][0][condition_type]': 'in',
                    'searchCriteria[filter_groups][2][filters][0][field]': 'status',
                    'searchCriteria[filter_groups][2][filters][0][value]': '1',
                    'searchCriteria[filter_groups][2][filters][0][condition_type]': 'eq'
                }
            })

            setProducts(data.items)
        }

        fetchProducts()
    }, [id])

    return (
        <div>
            <ul>{renderProducts}</ul>
        </div>
    )
}

export default Index
