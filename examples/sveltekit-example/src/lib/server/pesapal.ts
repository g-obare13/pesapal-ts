import { PesapalClient } from "pesapal-ts";
import {
  PESAPAL_CONSUMER_KEY,
  PESAPAL_CONSUMER_SECRET,
  PESAPAL_ENVIRONMENT,
} from "$env/static/private";

export const pesapal = new PesapalClient({
  consumerKey: PESAPAL_CONSUMER_KEY || "",
  consumerSecret: PESAPAL_CONSUMER_SECRET || "",
  environment: (PESAPAL_ENVIRONMENT as "sandbox" | "production") || "sandbox",
});
