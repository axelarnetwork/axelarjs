import { FC } from "react";

import tw from "./tw";

const Container = tw.div`
  inset-0 grid h-screen place-items-center 
  bg-gradient-to-br from-indigo-600 via-orange-500 to-pink-600
`;

const App: FC = () => (
  <Container>
    <div className="grid gap-4">
      <h1 className="text-primary-content max-w-xs text-center text-2xl font-bold">
        nothing to see here.
        <br /> go run <code className="text-success text-3xl">Storybook</code>!
      </h1>
      <div className="mockup-code">
        <pre data-prefix=">">
          <code className="text-info">pnpm storybook</code>
        </pre>
      </div>
    </div>
  </Container>
);

export default App;
