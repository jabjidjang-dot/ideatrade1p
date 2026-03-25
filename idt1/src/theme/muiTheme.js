import { createTheme } from "@mui/material/styles";
import { colors } from "./theme";

export const muiTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: colors.bg.main,
      paper: colors.bg.card,
    },
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.premium,
    },
    text: {
      primary: colors.text.main,
      secondary: colors.text.soft,
    },
  },
  shape: {
    borderRadius: 16,
  },
});
