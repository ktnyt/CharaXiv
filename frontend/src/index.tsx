/* @refresh reload */
import { render } from "solid-js/web";
import "tailwindcss/tailwind.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./styles";
import App from "./App";
import "./github-markdown.css";

render(() => <App />, document.getElementById("root") as HTMLElement);
