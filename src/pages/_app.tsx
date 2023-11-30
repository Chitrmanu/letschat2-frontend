import "@/styles/globals.css";
import "@/styles/global.scss";
import type { AppProps } from "next/app";
import { UserContextProvider } from "@/context/Context";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserContextProvider>
      <Component {...pageProps} />
    </UserContextProvider>
  );
};