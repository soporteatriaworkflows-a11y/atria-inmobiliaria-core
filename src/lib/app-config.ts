export const appMode = process.env.NEXT_PUBLIC_APP_MODE ?? "demo";

export const isDemoMode = appMode === "demo";
