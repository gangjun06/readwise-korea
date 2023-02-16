// import Options from "src/components/Options.svelte";
import { storage } from "src/utils/storage";
import Page from "./page.svelte";

const app = document.getElementById("app");

function render() {
  // storage.get().then(({ count }) => {
  // });
  new Page({ target: app });
}

document.addEventListener("DOMContentLoaded", render);
