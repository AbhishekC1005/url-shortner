import React from 'react'
import ShortenItem from './ShortenItem'

const ShortenUrlList = ({ data, onShowAnalytics, refetch }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {data.map((item) => (
        <ShortenItem key={item.id} {...item} onShowAnalytics={onShowAnalytics} refetch={refetch} />
      ))}
    </div>
  )
}

export default ShortenUrlList