import React from 'react';

import './Display.scss';

export default function Display(props: {
  content: string;
  style?: React.CSSProperties;
}) {
  return (
    <div className="display" style={props.style}>
      {props.content}
    </div>
  );
}
