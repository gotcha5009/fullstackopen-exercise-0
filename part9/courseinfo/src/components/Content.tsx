import React from 'react';
import * as types from '../types';
import Part from './Part';

// interface ContentProps {
//   name: string;
//   exerciseCount: number;
// }

const Content = ({ content }: { content: types.CoursePart[] }): JSX.Element => (
  <div>
    {content.map((c) => (
      <Part key={c.name} part={c} />
    ))}
  </div>
);

export default Content;
