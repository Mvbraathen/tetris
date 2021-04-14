import React from 'react';

import './Display.scss';

export default function Display(props: { content: string | number }) {
  return <div className="display">{props.content}</div>;
}
