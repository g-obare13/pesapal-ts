import { PesapalClient } from "pesapal-ts";

let _pesapal: PesapalClient | null = null;

export const usePesapal = () => {
  if (_pesapal) return _pesapal;

  const config = useRuntimeConfig();

  _pesapal = new PesapalClient({
    consumerKey: config.pesapalConsumerKey,
    consumerSecret: config.pesapalConsumerSecret,
    environment: config.pesapalEnvironment as "sandbox" | "production",
  });

  return _pesapal;
};
