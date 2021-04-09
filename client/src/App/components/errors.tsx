import React from "react";
import {ErrorsTitle, ErrorsWrapper } from "Styles/components/errors/styles";

export type ErrorsProps = {
  errors: string[]
};

export default function Errors(props: ErrorsProps) {
  return (
    <ErrorsWrapper>
      <ErrorsTitle>Errors:</ErrorsTitle>
      {props.errors.map(x => <p>{x.toTitleCase()}</p>)}
    </ErrorsWrapper>
  );
}
