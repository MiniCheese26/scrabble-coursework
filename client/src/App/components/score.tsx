import React from "react"

type scoreProps = {
  score: number
}

export default function Score(props: scoreProps) {
  return (
    <p>{props.score}</p>
  );
}