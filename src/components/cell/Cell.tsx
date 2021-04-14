import React from 'react';

export default function Cell(props: { color: number }) {
  return <div className="Cell" data-color={props.color} />;
}
