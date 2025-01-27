import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { ColorStyles } from "./ColorStyle";
import { buttonRecipes } from "./recipes/button.recipe";

const config = defineConfig({
  globalCss: {
    "html, body": {
      bg: "gray.50",
    },
  },

  theme: {
    tokens: {
      fonts: {
        body: { value: "Inter" },
      },
      cursor: {
        radio: { value: "pointer" },
      },
      colors: ColorStyles,
    },
    semanticTokens: {
      colors: {
        error: {
          solid: { value: "{colors.error.500}" },
          contrast: { value: "white" },
          fg: { value: "{colors.error.700}" },
          muted: { value: "{colors.error.100}" },
          subtle: { value: "{colors.error.50}" },
          emphasized: { value: "{colors.error.900}" },
          focusRing: { value: "{colors.error.500}" },
        },
        success: {
          solid: { value: "{colors.success.500}" },
          contrast: { value: "white" },
          fg: { value: "{colors.success.700}" },
          muted: { value: "{colors.success.100}" },
          subtle: { value: "{colors.success.50}" },
          emphasized: { value: "{colors.success.900}" },
          focusRing: { value: "{colors.success.500}" },
        },
        warning: {
          solid: { value: "{colors.warning.500}" },
          contrast: { value: "white" },
          fg: { value: "{colors.warning.700}" },
          muted: { value: "{colors.warning.100}" },
          subtle: { value: "{colors.warning.50}" },
          emphasized: { value: "{colors.warning.900}" },
          focusRing: { value: "{colors.warning.500}" },
        },
      },
    },
    recipes: {
      button: buttonRecipes,
    },
  },
});

export const system = createSystem(defaultConfig, config);
