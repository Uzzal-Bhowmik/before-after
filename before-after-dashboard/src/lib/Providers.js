"use client";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import { mainTheme } from "../theme/mainTheme";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

export default function Providers({ children }) {
  return (
    <AntdRegistry>
      <ConfigProvider theme={mainTheme}>
        <ReduxProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {children}
          </PersistGate>
        </ReduxProvider>
      </ConfigProvider>

      <NextTopLoader />

      <Toaster />
    </AntdRegistry>
  );
}
