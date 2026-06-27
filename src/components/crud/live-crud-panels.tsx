"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { canRole } from "@/lib/auth/rbac";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Badge, SectionPanel } from "@/components/ui";
import { formatCop } from "@/lib/money";
import { isPositiveCopAmount } from "@/lib/auth/crud-validation";

type PropertyRow = {
  id: string;
  code: string;
  display_name: string;
  status: string;
};
type ParticipantRow = {
  id: string;
  basis_points: number;
  effective_from: string;
  effective_to: string | null;
  profiles?: { display_name: string } | null;
  properties?: { display_name: string } | null;
};
type CollectionRow = {
  id: string;
  property_id: string;
  period_month: string;
  amount_cop: number | string;
  status: string;
  properties?: { display_name: string } | null;
};
type ExpenseRow = {
  id: string;
  property_id: string | null;
  period_month: string;
  category: string;
  description: string;
  amount_cop: number | string;
  status: string;
  properties?: { display_name: string } | null;
};
type ChangeRequestRow = {
  id: string;
  request_type: string;
  status: string;
  details: Record<string, unknown>;
  created_at: string;
};

function money(value: number | string) {
  return formatCop(Number(value));
}

function useLiveCrud() {
  const auth = useAuth();
  const [properties, setProperties] = useState<PropertyRow[]>([]);
  const [participants, setParticipants] = useState<ParticipantRow[]>([]);
  const [collections, setCollections] = useState<CollectionRow[]>([]);
  const [expenses, setExpenses] = useState<ExpenseRow[]>([]);
  const [requests, setRequests] = useState<ChangeRequestRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const enabled =
    auth.isAuthEnabled && Boolean(auth.session && auth.organizationId);
  const isOwner = auth.role === "owner_readonly";

  async function reload() {
    if (!enabled || !auth.organizationId) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const emptyResult = { data: [], error: null };
      let requestsQuery = supabase
        .from("change_requests")
        .select("id, request_type, status, details, created_at")
        .eq("organization_id", auth.organizationId)
        .order("created_at", { ascending: false })
        .limit(20);

      if (isOwner && auth.user) {
        requestsQuery = requestsQuery.eq("requested_by", auth.user.id);
      }

      const [
        propertiesResult,
        participantsResult,
        collectionsResult,
        expensesResult,
        requestsResult,
      ] = await Promise.all([
        isOwner
          ? Promise.resolve(emptyResult)
          : supabase
              .from("properties")
              .select("id, code, display_name, status")
              .eq("organization_id", auth.organizationId)
              .order("display_name"),
        isOwner
          ? Promise.resolve(emptyResult)
          : supabase
              .from("participation_rules")
              .select(
                "id, basis_points, effective_from, effective_to, profiles(display_name), properties(display_name)",
              )
              .eq("organization_id", auth.organizationId)
              .order("effective_from", { ascending: false })
              .limit(30),
        isOwner
          ? Promise.resolve(emptyResult)
          : supabase
              .from("rent_collections")
              .select(
                "id, property_id, period_month, amount_cop, status, properties(display_name)",
              )
              .eq("organization_id", auth.organizationId)
              .order("period_month", { ascending: false })
              .limit(20),
        isOwner
          ? Promise.resolve(emptyResult)
          : supabase
              .from("expenses")
              .select(
                "id, property_id, period_month, category, description, amount_cop, status, properties(display_name)",
              )
              .eq("organization_id", auth.organizationId)
              .order("period_month", { ascending: false })
              .limit(20),
        requestsQuery,
      ]);

      for (const result of [
        propertiesResult,
        participantsResult,
        collectionsResult,
        expensesResult,
        requestsResult,
      ]) {
        if (result.error) throw result.error;
      }

      setProperties((propertiesResult.data ?? []) as PropertyRow[]);
      setParticipants(
        (participantsResult.data ?? []) as unknown as ParticipantRow[],
      );
      setCollections(
        (collectionsResult.data ?? []) as unknown as CollectionRow[],
      );
      setExpenses((expensesResult.data ?? []) as unknown as ExpenseRow[]);
      setRequests((requestsResult.data ?? []) as ChangeRequestRow[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar los datos.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reload();
  }, [enabled, auth.organizationId]);

  async function write(
    action: () => PromiseLike<{ error: unknown }>,
    success: string,
  ) {
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const result = await action();
      if (result.error) throw result.error;
      setMessage(success);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.");
    } finally {
      setLoading(false);
    }
  }

  return {
    auth,
    enabled,
    loading,
    message,
    error,
    properties,
    participants,
    collections,
    expenses,
    requests,
    reload,
    write,
  };
}

function LiveState({
  enabled,
  loading,
  error,
  message,
}: {
  enabled: boolean;
  loading: boolean;
  error: string | null;
  message: string | null;
}) {
  if (!enabled) {
    return (
      <p className="text-xs text-atria-mist">
        CRUD real disponible al iniciar sesion en modo live. Esta vista conserva
        datos de prueba.
      </p>
    );
  }
  return (
    <div className="grid gap-2 text-xs">
      {loading ? (
        <p className="text-atria-mist">Sincronizando con Supabase...</p>
      ) : null}
      {message ? (
        <p className="rounded-lg border border-atria-violet/20 bg-atria-violet/[0.06] px-3 py-2 text-atria-lavender">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-atria-rose/25 bg-atria-rose/10 px-3 py-2 text-atria-rose">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ParticipantsCrudPanel() {
  const crud = useLiveCrud();

  return (
    <SectionPanel>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-atria-fog">
            Consulta real de propietarios
          </h2>
          <p className="mt-1 text-xs text-atria-mist">
            Lee participaciones y perfiles con RLS. La creacion de propietarios
            queda pendiente de invitacion segura.
          </p>
        </div>
        <Badge tone={crud.enabled ? "success" : "neutral"}>
          {crud.enabled ? crud.auth.roleLabel : "Demo"}
        </Badge>
      </div>
      <div className="mt-4 grid gap-2">
        {crud.participants.map((row) => (
          <div
            className="grid gap-2 rounded-lg border border-atria-edge bg-atria-elevated/60 px-3 py-2 sm:grid-cols-[1fr_auto_auto] sm:items-center"
            key={row.id}
          >
            <div>
              <p className="text-sm font-semibold text-atria-fog">
                {row.profiles?.display_name ?? "Propietario"}
              </p>
              <p className="text-2xs text-atria-mist">
                {row.properties?.display_name ?? "Participacion general"}
              </p>
            </div>
            <span className="text-sm font-semibold text-atria-lavender">
              {Math.round(row.basis_points / 100)}%
            </span>
            <Badge tone={row.effective_to ? "neutral" : "success"}>
              {row.effective_to ? "Historico" : "Vigente"}
            </Badge>
          </div>
        ))}
        <LiveState
          enabled={crud.enabled}
          error={crud.error}
          loading={crud.loading}
          message={crud.message}
        />
      </div>
    </SectionPanel>
  );
}

export function PropertiesCrudPanel() {
  const crud = useLiveCrud();
  const canWrite = canRole(crud.auth.role, "properties:write");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  async function createProperty(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!crud.auth.organizationId || !canWrite || !name.trim() || !code.trim())
      return;
    const supabase = createSupabaseBrowserClient();
    await crud.write(
      () =>
        supabase.from("properties").insert({
          organization_id: crud.auth.organizationId,
          code: code.trim(),
          display_name: name.trim(),
          status: "active",
        }),
      "Propiedad guardada en datos de prueba.",
    );
    setName("");
    setCode("");
  }

  return (
    <SectionPanel>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-atria-fog">
            CRUD base de propiedades
          </h2>
          <p className="mt-1 text-xs text-atria-mist">
            Lee y crea propiedades mediante RLS, sin datos reales.
          </p>
        </div>
        <Badge tone={crud.enabled ? "success" : "neutral"}>
          {crud.enabled ? crud.auth.roleLabel : "Demo"}
        </Badge>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="grid gap-2">
          {(crud.enabled ? crud.properties : []).map((property) => (
            <div
              className="rounded-lg border border-atria-edge bg-atria-elevated/60 px-3 py-2"
              key={property.id}
            >
              <p className="text-sm font-semibold text-atria-fog">
                {property.display_name}
              </p>
              <p className="text-2xs text-atria-mist">
                Codigo {property.code} - {property.status}
              </p>
            </div>
          ))}
          <LiveState
            enabled={crud.enabled}
            error={crud.error}
            loading={crud.loading}
            message={crud.message}
          />
        </div>
        <form className="grid gap-2" onSubmit={createProperty}>
          <input
            aria-label="Nombre de propiedad de prueba"
            className="focus-ring rounded-lg border border-atria-edge bg-atria-elevated px-3 py-2 text-sm"
            disabled={!crud.enabled || !canWrite}
            onChange={(e) => setName(e.target.value)}
            placeholder="Propiedad demo"
            value={name}
          />
          <input
            aria-label="Codigo de propiedad de prueba"
            className="focus-ring rounded-lg border border-atria-edge bg-atria-elevated px-3 py-2 text-sm"
            disabled={!crud.enabled || !canWrite}
            onChange={(e) => setCode(e.target.value)}
            placeholder="COD-DEMO"
            value={code}
          />
          <button
            className="focus-ring rounded-full bg-atria-violet px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            disabled={!crud.enabled || !canWrite || !name || !code}
            type="submit"
          >
            Crear propiedad
          </button>
        </form>
      </div>
    </SectionPanel>
  );
}

export function CollectionsCrudPanel() {
  const crud = useLiveCrud();
  const canWrite = canRole(crud.auth.role, "income:write");
  const [propertyId, setPropertyId] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("2026-06-01");
  const firstProperty = useMemo(
    () => crud.properties[0]?.id ?? "",
    [crud.properties],
  );

  async function createCollection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!crud.auth.organizationId || !canWrite || !isPositiveCopAmount(amount))
      return;
    const supabase = createSupabaseBrowserClient();
    await crud.write(
      () =>
        supabase.from("rent_collections").insert({
          organization_id: crud.auth.organizationId,
          property_id: propertyId || firstProperty,
          period_month: period,
          amount_cop: Number(amount),
          status: "draft",
          source: "manual",
        }),
      "Ingreso guardado como borrador.",
    );
    setAmount("");
  }

  return (
    <SectionPanel>
      <h2 className="text-sm font-semibold text-atria-fog">
        CRUD base de ingresos
      </h2>
      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="grid gap-2">
          {crud.collections.map((row) => (
            <div
              className="flex items-center justify-between rounded-lg border border-atria-edge bg-atria-elevated/60 px-3 py-2"
              key={row.id}
            >
              <span className="text-sm text-atria-fog">
                {row.properties?.display_name ?? "Propiedad"}
              </span>
              <span className="text-sm font-semibold text-atria-fog">
                {money(row.amount_cop)}
              </span>
            </div>
          ))}
          <LiveState
            enabled={crud.enabled}
            error={crud.error}
            loading={crud.loading}
            message={crud.message}
          />
        </div>
        <form className="grid gap-2" onSubmit={createCollection}>
          <select
            aria-label="Propiedad del ingreso"
            className="focus-ring rounded-lg border border-atria-edge bg-atria-elevated px-3 py-2 text-sm"
            disabled={!crud.enabled || !canWrite}
            onChange={(e) => setPropertyId(e.target.value)}
            value={propertyId || firstProperty}
          >
            {crud.properties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.display_name}
              </option>
            ))}
          </select>
          <input
            aria-label="Periodo"
            className="focus-ring rounded-lg border border-atria-edge bg-atria-elevated px-3 py-2 text-sm"
            disabled={!crud.enabled || !canWrite}
            onChange={(e) => setPeriod(e.target.value)}
            type="date"
            value={period}
          />
          <input
            aria-label="Monto en COP"
            className="focus-ring rounded-lg border border-atria-edge bg-atria-elevated px-3 py-2 text-sm"
            disabled={!crud.enabled || !canWrite}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            placeholder="Monto COP"
            step="1"
            type="number"
            value={amount}
          />
          <button
            className="focus-ring rounded-full bg-atria-violet px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            disabled={
              !crud.enabled ||
              !canWrite ||
              !isPositiveCopAmount(amount) ||
              !(propertyId || firstProperty)
            }
            type="submit"
          >
            Registrar ingreso
          </button>
        </form>
      </div>
    </SectionPanel>
  );
}

export function ExpensesCrudPanel() {
  const crud = useLiveCrud();
  const canWrite = canRole(crud.auth.role, "expenses:write");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState("2026-06-01");

  async function createExpense(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!crud.auth.organizationId || !canWrite || !isPositiveCopAmount(amount))
      return;
    const supabase = createSupabaseBrowserClient();
    await crud.write(
      () =>
        supabase.from("expenses").insert({
          organization_id: crud.auth.organizationId,
          property_id: null,
          period_month: period,
          category: "global",
          description: description.trim(),
          amount_cop: Number(amount),
          status: "draft",
        }),
      "Gasto guardado como borrador.",
    );
    setDescription("");
    setAmount("");
  }

  return (
    <SectionPanel>
      <h2 className="text-sm font-semibold text-atria-fog">
        CRUD base de gastos
      </h2>
      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="grid gap-2">
          {crud.expenses.map((row) => (
            <div
              className="flex items-center justify-between rounded-lg border border-atria-edge bg-atria-elevated/60 px-3 py-2"
              key={row.id}
            >
              <span className="text-sm text-atria-fog">{row.description}</span>
              <span className="text-sm font-semibold text-atria-fog">
                {money(row.amount_cop)}
              </span>
            </div>
          ))}
          <LiveState
            enabled={crud.enabled}
            error={crud.error}
            loading={crud.loading}
            message={crud.message}
          />
        </div>
        <form className="grid gap-2" onSubmit={createExpense}>
          <input
            aria-label="Descripcion del gasto de prueba"
            className="focus-ring rounded-lg border border-atria-edge bg-atria-elevated px-3 py-2 text-sm"
            disabled={!crud.enabled || !canWrite}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Gasto demo"
            value={description}
          />
          <input
            aria-label="Periodo"
            className="focus-ring rounded-lg border border-atria-edge bg-atria-elevated px-3 py-2 text-sm"
            disabled={!crud.enabled || !canWrite}
            onChange={(e) => setPeriod(e.target.value)}
            type="date"
            value={period}
          />
          <input
            aria-label="Monto en COP"
            className="focus-ring rounded-lg border border-atria-edge bg-atria-elevated px-3 py-2 text-sm"
            disabled={!crud.enabled || !canWrite}
            onChange={(e) => setAmount(e.target.value)}
            min="1"
            placeholder="Monto COP"
            step="1"
            type="number"
            value={amount}
          />
          <button
            className="focus-ring rounded-full bg-atria-violet px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            disabled={
              !crud.enabled ||
              !canWrite ||
              !description.trim() ||
              !isPositiveCopAmount(amount)
            }
            type="submit"
          >
            Registrar gasto
          </button>
        </form>
      </div>
    </SectionPanel>
  );
}

export function ChangeRequestsCrudPanel() {
  const crud = useLiveCrud();
  const canCreate = canRole(crud.auth.role, "requests:create");
  const [detail, setDetail] = useState("");

  async function createRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      !crud.auth.organizationId ||
      !crud.auth.user ||
      !canCreate ||
      !detail.trim()
    )
      return;
    const supabase = createSupabaseBrowserClient();
    const userId = crud.auth.user.id;
    await crud.write(
      () =>
        supabase.from("change_requests").insert({
          organization_id: crud.auth.organizationId,
          requested_by: userId,
          request_type: "adjustment",
          details: { resumen: detail.trim(), origen: "ui_base" },
        }),
      "Solicitud enviada a revision.",
    );
    setDetail("");
  }

  return (
    <SectionPanel>
      <h2 className="text-sm font-semibold text-atria-fog">
        CRUD base de solicitudes
      </h2>
      <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_18rem]">
        <div className="grid gap-2">
          {crud.requests.map((row) => (
            <div
              className="rounded-lg border border-atria-edge bg-atria-elevated/60 px-3 py-2"
              key={row.id}
            >
              <p className="text-sm font-medium text-atria-fog">
                {String(row.details?.resumen ?? row.request_type)}
              </p>
              <p className="text-2xs text-atria-mist">{row.status}</p>
            </div>
          ))}
          <LiveState
            enabled={crud.enabled}
            error={crud.error}
            loading={crud.loading}
            message={crud.message}
          />
        </div>
        <form className="grid gap-2" onSubmit={createRequest}>
          <textarea
            aria-label="Detalle de la solicitud de ajuste"
            className="focus-ring min-h-24 rounded-lg border border-atria-edge bg-atria-elevated px-3 py-2 text-sm"
            disabled={!crud.enabled || !canCreate}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Describe el ajuste solicitado"
            value={detail}
          />
          <button
            className="focus-ring rounded-full bg-atria-violet px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
            disabled={!crud.enabled || !canCreate || !detail.trim()}
            type="submit"
          >
            Crear solicitud
          </button>
        </form>
      </div>
    </SectionPanel>
  );
}
