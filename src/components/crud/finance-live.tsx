"use client";
import { useCallback, useState } from "react";
import { SectionPanel, Badge } from "@/components/ui";
import { canRole } from "@/lib/auth/rbac";
import { type LiveContext } from "@/lib/live/shared";
import {
  createFinance,
  listFinance,
  propertyOptions,
  currentMonth,
  type FinanceKind,
} from "@/lib/live/finance";
import { isPositiveCopAmount } from "@/lib/auth/crud-validation";
import { formatCop } from "@/lib/money";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  LiveModule,
  LiveFeedback,
  ListControls,
  useLiveCreate,
  useLiveResource,
  fieldClass,
  buttonClass,
} from "./live-state";

const statusLabels: Record<string, string> = {
  draft: "Borrador",
  review: "En revisión",
  posted: "Contabilizado",
  reversed: "Reversado",
};
export function FinanceLivePanel({ kind }: { kind: FinanceKind }) {
  return (
    <LiveModule
      permission={kind === "income" ? "income:read" : "expenses:read"}
    >
      {(context) => <FinanceContent key={kind} context={context} kind={kind} />}
    </LiveModule>
  );
}
function FinanceContent({
  context,
  kind,
}: {
  context: LiveContext;
  kind: FinanceKind;
}) {
  const income = kind === "income";
  const [page, setPage] = useState(0);
  const load = useCallback(
    () => listFinance(createSupabaseBrowserClient(), context, kind, page),
    [context, kind, page],
  );
  const loadProperties = useCallback(
    () => propertyOptions(createSupabaseBrowserClient(), context),
    [context],
  );
  const resource = useLiveResource(load);
  const properties = useLiveResource(loadProperties);
  const write = useLiveCreate(resource.reload);
  const [propertyId, setPropertyId] = useState("");
  const [amount, setAmount] = useState("");
  const [month, setMonth] = useState(currentMonth);
  const [description, setDescription] = useState("");
  const [scope, setScope] = useState<"global" | "property">("global");
  const needsProperty = income || scope === "property";
  const canWrite = canRole(
    context.role,
    income ? "income:write" : "expenses:write",
  );
  const disabled = resource.loading || write.saving;
  const validProperty =
    !needsProperty ||
    Boolean(properties.data?.some((p) => p.id === propertyId));
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      await write.save(
        () =>
          createFinance(createSupabaseBrowserClient(), context, kind, {
            amount,
            month,
            propertyId,
            description,
            scope,
          }),
        income
          ? "Ingreso guardado como borrador."
          : "Gasto guardado como borrador.",
      )
    ) {
      setAmount("");
      setDescription("");
      setPage(0);
    }
  }
  return (
    <SectionPanel>
      <div className="grid gap-4">
        <h2 className="text-base font-semibold">
          {income ? "Ingresos registrados" : "Gastos registrados"}
        </h2>
        <LiveFeedback
          {...resource}
          success={write.success}
          writeError={write.error}
          empty={!resource.data?.rows.length}
          emptyText={
            income
              ? "No hay ingresos registrados en esta organización."
              : "No hay gastos registrados en esta organización."
          }
        />
        {!resource.loading && resource.data ? (
          <ul className="grid gap-3">
            {resource.data.rows.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-atria-edge bg-atria-elevated/60 p-3"
              >
                <p className="font-semibold">
                  {income
                    ? (row.properties?.display_name ??
                      "Propiedad no disponible")
                    : row.description}
                </p>
                <p className="text-sm text-atria-mist">
                  {row.property_id
                    ? row.properties
                      ? row.properties.code +
                        " · " +
                        row.properties.display_name
                      : "Propiedad no disponible"
                    : "Gasto global"}{" "}
                  · Periodo {row.period_month.slice(0, 7)}
                </p>
                <p className="font-semibold">
                  {formatCop(Number(row.amount_cop))}
                </p>
                <Badge>{statusLabels[row.status] ?? row.status}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
        <ListControls
          page={page}
          hasNext={resource.data?.hasNext ?? false}
          disabled={disabled}
          onPage={setPage}
          reload={resource.reload}
        />
        {canWrite ? (
          <form
            onSubmit={submit}
            className="grid gap-3 border-t border-atria-edge pt-4"
          >
            <h3 className="font-semibold">
              {income ? "Nuevo ingreso" : "Nuevo gasto"}
            </h3>
            <p className="text-sm text-atria-mist">
              Se guardará como borrador, pendiente de revisión.
            </p>
            {!income ? (
              <>
                <label className="grid gap-1 text-sm">
                  Descripción del gasto
                  <input
                    required
                    className={fieldClass}
                    value={description}
                    disabled={disabled}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-sm">
                  Alcance del gasto
                  <select
                    aria-label="Alcance del gasto"
                    className={fieldClass}
                    value={scope}
                    disabled={disabled}
                    onChange={(e) =>
                      setScope(e.target.value as "global" | "property")
                    }
                  >
                    <option value="global">Global</option>
                    <option value="property">Por propiedad</option>
                  </select>
                </label>
              </>
            ) : null}
            {needsProperty ? (
              <div className="grid gap-2">
                {properties.loading ? (
                  <p role="status">Cargando propiedades...</p>
                ) : null}
                {properties.error ? (
                  <div role="alert">
                    <p>{properties.error}</p>
                    <button
                      className={buttonClass}
                      type="button"
                      onClick={() => void properties.reload()}
                    >
                      Reintentar propiedades
                    </button>
                  </div>
                ) : null}
                {!properties.loading &&
                !properties.error &&
                !properties.data?.length ? (
                  <p>
                    No hay propiedades disponibles. Solicita a administración
                    crear una propiedad.
                  </p>
                ) : null}
                <label className="grid gap-1 text-sm">
                  {income ? "Propiedad del ingreso" : "Propiedad del gasto"}
                  <select
                    aria-label={
                      income ? "Propiedad del ingreso" : "Propiedad del gasto"
                    }
                    required
                    className={fieldClass}
                    disabled={
                      disabled ||
                      properties.loading ||
                      Boolean(properties.error)
                    }
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                  >
                    <option value="">Selecciona una propiedad</option>
                    {properties.data?.map((p) => (
                      <option value={p.id} key={p.id}>
                        {p.code} · {p.display_name}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  className={buttonClass}
                  type="button"
                  disabled={disabled || properties.loading}
                  onClick={() => void properties.reload()}
                >
                  Actualizar propiedades
                </button>
              </div>
            ) : null}
            <label className="grid gap-1 text-sm">
              Periodo
              <input
                type="month"
                required
                className={fieldClass}
                value={month}
                disabled={disabled}
                onChange={(e) => setMonth(e.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm">
              Monto en COP
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]+"
                maxLength={14}
                required
                className={fieldClass}
                value={amount}
                disabled={disabled}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Pesos enteros, sin separadores"
              />
            </label>
            <button
              type="submit"
              className={buttonClass}
              disabled={
                disabled ||
                Boolean(resource.error) ||
                !isPositiveCopAmount(amount) ||
                !month ||
                !validProperty ||
                (needsProperty &&
                  (properties.loading || Boolean(properties.error))) ||
                (!income && !description.trim())
              }
            >
              {write.saving
                ? "Guardando..."
                : income
                  ? "Registrar ingreso"
                  : "Registrar gasto"}
            </button>
          </form>
        ) : null}
      </div>
    </SectionPanel>
  );
}
