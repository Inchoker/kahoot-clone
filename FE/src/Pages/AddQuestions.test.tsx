import React from 'react';
import { render } from '@testing-library/react';
import AddQuestions from './AddQuestions'; 

describe('AddQuestion component', () => {
  it('renders correctly and matches snapshot', () => {
    const { container } = render(<AddQuestions />);
    expect(container).toMatchSnapshot();
  });
});
