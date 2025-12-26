import React from 'react'

export default function Loader() {
  return (
    <div title="Loader" role="region" className="loader mx-auto pt-5">
      <ReactLoading
        className={"mx-auto"}
        type={"bubbles"}
        color={"#3876e4"}
        height={100}
        width={100}
      />
    </div>
  )
}
