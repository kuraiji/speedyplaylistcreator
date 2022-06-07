import { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import Landing from "@/pages/Landing";
import Loading from "@/pages/Loading";
import Main from "@/pages/Main"
import { getCurrentPage } from "@/store";

const App: Component = () => {
  const PageOptions = {
    0: Landing,
    1: Loading,
    2: Main
  }

  return (
      <Dynamic component={PageOptions[getCurrentPage()]}/>
  );
};

export default App;