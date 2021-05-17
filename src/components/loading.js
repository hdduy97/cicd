import React from 'react'

import Loader from 'react-loader-spinner'

import './loading.scss'

const Loading = () => {
  return (
    <div className="loader">
      <Loader
        type="ThreeDots"
        color="#00BFFF"
        height={100}
        width={100}
      />
    </div>
  )
}

export default Loading
