import {createGlobalStyle} from "styled-components";

import LatoWoff from "./lato-v17-latin-regular.woff";
import LatoWoff2 from "./lato-v17-latin-regular.woff2";
import montserrat400Woff from "./montserrat-v15-latin-regular.woff";
import montserrat400Woff2 from "./montserrat-v15-latin-regular.woff2";
import montserrat500Woff from "./montserrat-v15-latin-500.woff";
import montserrat500Woff2 from "./montserrat-v15-latin-500.woff2";
import montserrat700Woff from "./montserrat-v15-latin-700.woff";
import montserrat700Woff2 from "./montserrat-v15-latin-700.woff2";

export default createGlobalStyle`
  @font-face {
    font-family: "Lato";
    src: local(""),
    url(${LatoWoff2}) format("woff2"),
    url(${LatoWoff}) format("woff");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "Montserrat";
    src: local(""),
    url(${montserrat400Woff2}) format("woff2"),
    url(${montserrat400Woff}) format("woff");
    font-weight: 400;
    font-style: normal;
  }

  @font-face {
    font-family: "Montserrat";
    src: local(""),
    url(${montserrat500Woff}) format("woff2"),
    url(${montserrat500Woff2}) format("woff");
    font-weight: 500;
    font-style: normal;
  }

  @font-face {
    font-family: "Montserrat";
    src: local(""),
    url(${montserrat700Woff}) format("woff2"),
    url(${montserrat700Woff2}) format("woff");
    font-weight: 700;
    font-style: normal;
  }
`;