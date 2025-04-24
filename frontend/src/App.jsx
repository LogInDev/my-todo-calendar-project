import React from 'react';
import MainPage from '@pages/index/index';
// React DnD
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
// CSS

const App = () => {

  return (
    <DndProvider backend={HTML5Backend}>
      <MainPage />
    </DndProvider>

  )
};

export default App;
