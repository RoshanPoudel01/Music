import Inter from "@artist/assets/fonts/Inter.ttf";
import { css, Global } from "@emotion/react";

const globalStyles = () => {
  return (
    <Global
      styles={() => css`
        @font-face {
          font-family: "Inter";
          font-style: normal;
          font-weight: regular;
          src: url(${Inter}) format("truetype");
        }
        html,
        body {
          margin: 0;
          padding: 0;
          min-height: 100%;
          font-family: "Inter";
          scroll-behavior: smooth;
        }
        body {
          -moz-osx-font-smoothing: grayscale;
          -webkit-text-size-adjust: 100%;
          -webkit-font-smoothing: antialiased;
          font-size: 14px;
          padding-top: 0px;
          margin: 0px;
          font-family: "Inter";
        }
        * {
          box-sizing: border-box;
          &:before,
          &:after {
            box-sizing: border-box;
          }
        }
        h1,
        h2,
        h3,
        h4,
        h5,
        ul,
        li,
        h6,
        p,
        img,
        figure {
          margin: 0px;
          padding: 0px;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          box-shadow: 0 0 0 30px white inset !important;
          z-index: 0;
        }

        .react-multi-carousel-list container {
          position: static;
          height: max-content;
        }

        .react-multiple-carousel__arrow {
          z-index: 9999 !important;
        }

        .react-multi-carousel-dot-list {
          margin-top: 20px;
          position: static;
          display: flex;
          justify-content: center;
          gap: 5px;
        }

        .react-multi-carousel-dot button {
          width: 20px;
          height: 10px;
          border-radius: 4px !important;
        }

        .react-multi-carousel-dot react-multi-carousel-dot--active button {
          background: #2f4389 !important;
        }

        .react-multiple-carousel__arrow--left {
          left: 0;
        }

        .react-multiple-carousel__arrow--right {
          right: 0;
        }
      `}
    />
  );
};

export { globalStyles };
