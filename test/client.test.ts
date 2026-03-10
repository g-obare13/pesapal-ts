import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PesapalClient } from "../src/client";
import { PesapalAuthenticationError, PesapalError } from "../src/errors";

describe("PesapalClient", () => {
  const mockConfig = {
    consumerKey: "test-key",
    consumerSecret: "test-secret",
    environment: "sandbox" as const,
  };

  let client: PesapalClient;
  let fetchSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    client = new PesapalClient(mockConfig);
    // @ts-ignore
    fetchSpy = vi.spyOn(global, "fetch");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should initialize correctly", () => {
    expect(client).toBeInstanceOf(PesapalClient);
  });

  it("should throw if initialized without credentials", () => {
    expect(
      () => new PesapalClient({ consumerKey: "", consumerSecret: "" }),
    ).toThrow("Pesapal config must include consumerKey and consumerSecret");
  });

  it("should request token successfully", async () => {
    fetchSpy.mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify({ token: "fake-token" }),
    });

    const response = await client.authenticate();

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          consumer_key: "test-key",
          consumer_secret: "test-secret",
        }),
      }),
    );
    expect(response.token).toBe("fake-token");
    expect(client.getToken()).toBe("fake-token");
  });

  it("should throw PesapalAuthenticationError on API failure", async () => {
    fetchSpy.mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      text: async () =>
        JSON.stringify({ error: { message: "Invalid credentials" } }),
    });

    await expect(client.authenticate()).rejects.toThrow(
      PesapalAuthenticationError,
    );
  });

  it("should send authorized requests after authentication", async () => {
    client.setToken("valid-token");

    fetchSpy.mockResolvedValue({
      ok: true,
      text: async () => JSON.stringify([{ url: "http://example.com" }]),
    });

    await client.getIPNList();

    expect(fetchSpy).toHaveBeenCalledWith(
      "https://cybqa.pesapal.com/pesapalv3/api/URLSetup/GetIpnList",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer valid-token",
        }),
      }),
    );
  });

  it("should throw PesapalAuthenticationError if calling guarded endpoints without token", async () => {
    await expect(client.getIPNList()).rejects.toThrow(
      PesapalAuthenticationError,
    );
  });
});
