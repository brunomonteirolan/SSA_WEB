import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: "#ffe5e5",
      100: "#ffb3b3",
      200: "#ff8080",
      300: "#ff4d4d",
      400: "#ff2020",
      500: "#E3001B",
      600: "#cc0018",
      700: "#990012",
      800: "#66000c",
      900: "#330006",
    },
  },
  styles: {
    global: {
      body: {
        bg: "#0A0A0A",
        color: "white",
      },
      "::selection": {
        bg: "#E3001B",
        color: "white",
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
    IconButton: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Badge: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Table: {
      variants: {
        simple: {
          th: {
            borderColor: "#2D2D2D",
            color: "#888888",
            fontSize: "xs",
            letterSpacing: "wider",
            textTransform: "uppercase",
          },
          td: {
            borderColor: "#1F1F1F",
          },
        },
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: "#141414",
          border: "1px solid #2D2D2D",
        },
        overlay: {
          bg: "blackAlpha.800",
        },
      },
    },
    Drawer: {
      baseStyle: {
        dialog: {
          bg: "#141414",
        },
      },
    },
    Popover: {
      baseStyle: {
        content: {
          bg: "#141414",
          border: "1px solid #2D2D2D",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        },
        arrow: {
          bg: "#141414",
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            bg: "#1A1A1A",
            border: "1px solid #2D2D2D",
            color: "white",
            _hover: { borderColor: "#E3001B" },
            _focus: { borderColor: "#E3001B", boxShadow: "0 0 0 1px #E3001B" },
            _placeholder: { color: "#555" },
          },
        },
      },
      defaultProps: {
        variant: "outline",
      },
    },
    Select: {
      variants: {
        outline: {
          field: {
            bg: "#1A1A1A",
            border: "1px solid #2D2D2D",
            color: "white",
            _hover: { borderColor: "#E3001B" },
            _focus: { borderColor: "#E3001B", boxShadow: "0 0 0 1px #E3001B" },
          },
        },
      },
      defaultProps: {
        variant: "outline",
      },
    },
    Textarea: {
      variants: {
        outline: {
          bg: "#1A1A1A",
          border: "1px solid #2D2D2D",
          color: "white",
          _hover: { borderColor: "#E3001B" },
          _focus: { borderColor: "#E3001B", boxShadow: "0 0 0 1px #E3001B" },
          _placeholder: { color: "#555" },
        },
      },
      defaultProps: {
        variant: "outline",
      },
    },
    Menu: {
      baseStyle: {
        list: {
          bg: "#141414",
          border: "1px solid #2D2D2D",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        },
        item: {
          bg: "#141414",
          color: "white",
          _hover: { bg: "#1F1F1F" },
          _focus: { bg: "#1F1F1F" },
        },
      },
    },
    Switch: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
    Divider: {
      baseStyle: {
        borderColor: "#2D2D2D",
      },
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  );
}

export default MyApp;
