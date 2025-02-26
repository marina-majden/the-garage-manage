import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import theme from './utils/theme';
import Homepage from './pages/Homepage';


function App() {
  return (
    <BrowserRouter>
    <ThemeProvider theme={theme}>
      <Routes>
          <Route path="/" element={<Homepage />} />
   
      </Routes></ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
