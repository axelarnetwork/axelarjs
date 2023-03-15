import { FC } from "react";

import tw from "tailwind-styled-components";

const Container = tw.div`
  inset-0 grid h-screen place-items-center 
  bg-gradient-to-br from-indigo-600 via-orange-500 to-pink-600
`;

const Surface = tw.div`
  glass rounded-xl bg-white/10 
  p-6 px-8 
  text-lg text-black/40 
  transition-all
`;

const App: FC = () => (
  <Container>
    <Surface>
      run <b className="font-bold text-indigo-500/80">pnpm storybook</b> to view
      the <em className="font-bold text-pink-500">storybook</em>
    </Surface>
  </Container>
);

export default App;
