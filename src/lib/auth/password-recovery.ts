export const minimumPasswordLength = 8;

export type PasswordValidationResult =
  | { ok: true }
  | { ok: false; message: string };

export type PasswordRecoveryClient = {
  auth: {
    resetPasswordForEmail: (
      email: string,
      options: { redirectTo: string },
    ) => Promise<{ error: Error | null }>;
    updateUser: (attributes: {
      password: string;
    }) => Promise<{ error: Error | null }>;
  };
};

export function getPasswordRecoveryRedirect(origin: string) {
  return `${origin.replace(/\/$/, "")}/auth/update-password`;
}

export function isPasswordRecoveryEvent(event: string) {
  return event === "PASSWORD_RECOVERY";
}

export function validateRecoveryEmail(email: string): PasswordValidationResult {
  const normalized = email.trim();
  if (!normalized) {
    return { ok: false, message: "Escribe el correo de acceso." };
  }
  if (!normalized.includes("@")) {
    return { ok: false, message: "Escribe un correo válido." };
  }
  return { ok: true };
}

export function validatePasswordUpdate(
  password: string,
  confirmPassword: string,
): PasswordValidationResult {
  if (password.length < minimumPasswordLength) {
    return {
      ok: false,
      message: `La contraseña debe tener al menos ${minimumPasswordLength} caracteres.`,
    };
  }
  if (password !== confirmPassword) {
    return { ok: false, message: "Las contraseñas no coinciden." };
  }
  return { ok: true };
}

export async function requestPasswordReset(
  client: PasswordRecoveryClient,
  email: string,
  redirectTo: string,
) {
  const emailValidation = validateRecoveryEmail(email);
  if (!emailValidation.ok) {
    throw new Error(emailValidation.message);
  }

  const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
    redirectTo,
  });
  if (error) throw error;
}

export async function updateRecoveredPassword(
  client: PasswordRecoveryClient,
  password: string,
  confirmPassword: string,
) {
  const passwordValidation = validatePasswordUpdate(password, confirmPassword);
  if (!passwordValidation.ok) {
    throw new Error(passwordValidation.message);
  }

  const { error } = await client.auth.updateUser({ password });
  if (error) throw error;
}
