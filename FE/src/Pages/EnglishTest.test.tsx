import React from 'react';
import { render } from '@testing-library/react';
import EnglishTest from './EnglishTest';
import { PlayerContext } from '../App';

jest.mock('../SocketIoClient/SocketIo', () => ({
  on: jest.fn(),
  emit: jest.fn(),
  off: jest.fn()
}));

describe('QuizComponent snapshot', () => {
  it('matches snapshot when user is not joined', () => {
    const mockSetPlayer = jest.fn();

    const { container } = render(
      <PlayerContext.Provider value={{ player: '', setPlayer: mockSetPlayer }}>
        <EnglishTest />
      </PlayerContext.Provider>
    );

    expect(container).toMatchSnapshot();
  });

  it('matches snapshot when user has joined', () => {
    const mockSetPlayer = jest.fn();

    const { container } = render(
      <PlayerContext.Provider value={{ player: 'Alice', setPlayer: mockSetPlayer }}>
        <EnglishTest />
      </PlayerContext.Provider>
    );

    expect(container).toMatchSnapshot();
  });
});
