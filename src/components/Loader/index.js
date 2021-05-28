import React from "react";
import ReactLoading from "react-loading";

/**
 * Renders a loading animation (...).
 *
 * @example
 * // JSX
 * <Loader />
 * @returns {React.Component} The loader component
 */
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
  );
}
