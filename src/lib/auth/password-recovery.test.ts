import { describe, expect, it, vi } from "vitest";
import {
  getPasswordRecoveryRedirect,
  isPasswordRecoveryEvent,
  requestPasswordReset,
  updateRecoveredPassword,
  validatePasswordUpdate,
  type PasswordRecoveryClient,
} from "@/lib/auth/password-recovery";

function createClient(): PasswordRecoveryClient & {
  resetPasswordForEmail: ReturnType<typeof vi.fn>;
  updateUser: ReturnType<typeof vi.fn>;
} {
  const resetPasswordForEmail = vi.fn().mockResolvedValue({ error: null });
  const updateUser = vi.fn().mockResolvedValue({ error: null });
  return {
    auth: {
      resetPasswordForEmail,
      updateUser,
    },
    resetPasswordForEmail,
    updateUser,
  };
}

describe("password recovery", () => {
  it("builds the explicit update password redirect URL", () => {
    expect(getPasswordRecoveryRedirect("http://localhost:3000")).toBe(
      "http://localhost:3000/auth/update-password",
    );
    expect(getPasswordRecoveryRedirect("http://localhost:3000/")).toBe(
      "http://localhost:3000/auth/update-password",
    );
  });

  it("requests reset emails with a redirect and normalized email", async () => {
    const client = createClient();

    await requestPasswordReset(
      client,
      " soporteatriaworkflows@gmail.com ",
      "http://localhost:3000/auth/update-password",
    );

    expect(client.resetPasswordForEmail).toHaveBeenCalledWith(
      "soporteatriaworkflows@gmail.com",
      { redirectTo: "http://localhost:3000/auth/update-password" },
    );
  });

  it("detects Supabase password recovery events", () => {
    expect(isPasswordRecoveryEvent("PASSWORD_RECOVERY")).toBe(true);
    expect(isPasswordRecoveryEvent("SIGNED_IN")).toBe(false);
  });

  it("rejects invalid reset email requests", async () => {
    const client = createClient();

    await expect(
      requestPasswordReset(client, "correo-invalido", "http://localhost:3000"),
    ).rejects.toThrow("correo válido");
    expect(client.resetPasswordForEmail).not.toHaveBeenCalled();
  });

  it("validates password length and confirmation", () => {
    expect(validatePasswordUpdate("short", "short")).toEqual({
      ok: false,
      message: "La contraseña debe tener al menos 8 caracteres.",
    });
    expect(validatePasswordUpdate("password-1", "password-2")).toEqual({
      ok: false,
      message: "Las contraseñas no coinciden.",
    });
    expect(validatePasswordUpdate("password-1", "password-1")).toEqual({
      ok: true,
    });
  });

  it("updates the recovered password only after validation", async () => {
    const client = createClient();

    await updateRecoveredPassword(client, "password-1", "password-1");

    expect(client.updateUser).toHaveBeenCalledWith({
      password: "password-1",
    });
  });

  it("surfaces Supabase update errors", async () => {
    const client = createClient();
    client.updateUser.mockResolvedValueOnce({
      error: new Error("Recovery session expired"),
    });

    await expect(
      updateRecoveredPassword(client, "password-1", "password-1"),
    ).rejects.toThrow("Recovery session expired");
  });
});
