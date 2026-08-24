type TurnstileResult = {
  success: boolean;

  hostname?: string;

  "error-codes"?: string[];
};

export async function verifyTurnstile(
  token: string,
  remoteIp?: string
) {
  const secret =
    process.env
      .TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error(
      "TURNSTILE_SECRET_KEY is missing."
    );

    return false;
  }

  if (!token) {
    return false;
  }

  const formData =
    new FormData();

  formData.append(
    "secret",
    secret
  );

  formData.append(
    "response",
    token
  );

  if (remoteIp) {
    formData.append(
      "remoteip",
      remoteIp
    );
  }

  try {
    const response =
      await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method:
            "POST",

          body:
            formData,

          cache:
            "no-store",
        }
      );

    const result =
      (await response.json()) as TurnstileResult;

    return Boolean(
      result.success
    );
  } catch (error) {
    console.error(
      "Turnstile verification error:",
      error
    );

    return false;
  }
}