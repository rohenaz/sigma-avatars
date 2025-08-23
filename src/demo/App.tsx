import { Playground } from './playground';
import { ThemeProvider } from './theme-provider';

const App = () => (
  <ThemeProvider defaultTheme="system">
    <Playground />
  </ThemeProvider>
);

export default App;
