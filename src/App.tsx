import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Rootcomponent from "./Rootcomponent";

const App = () => {
  const queryclient = new QueryClient();
  return (
    <div>
      <QueryClientProvider client={queryclient}>
        <Rootcomponent />
      </QueryClientProvider>
    </div>
  );
};

export default App;
