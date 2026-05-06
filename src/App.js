import { useState, useEffect } from "react";

// ── Helpers ───────────────────────────────────────────────────────
const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const mesKey = (y, m) => `${y}-${String(m + 1).padStart(2, "0")}`;
const mesLabel = (key) => {
  const [y, m] = key.split("-");
  return `${MESES[parseInt(m) - 1]} ${y}`;
};
const hoy = new Date();
const mesActual = mesKey(hoy.getFullYear(), hoy.getMonth());

const mesesHistorial = (() => {
  const arr = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
    arr.push(mesKey(d.getFullYear(), d.getMonth()));
  }
  return arr;
})();

// ── Datos iniciales ───────────────────────────────────────────────
const INITIAL_LOCALES = [
  {
    id: 1,
    nombre: "Local 1",
    inquilino: "Juan Pérez",
    monto: 1200,
    vencimiento: 5,
    color: "#C8A96E",
    pagos: { "2026-01": true, "2026-02": true, "2026-03": true, "2026-04": true, "2026-05": false },
    notas: { "2026-04": "Pagó completo el día 4." },
  },
  {
    id: 2,
    nombre: "Local 2",
    inquilino: "María López",
    monto: 950,
    vencimiento: 10,
    color: "#7EB8A4",
    pagos: { "2026-01": true, "2026-02": true, "2026-03": true, "2026-04": false, "2026-05": false },
    notas: { "2026-04": "Abonó $500 el día 8. Resto pendiente." },
  },
  {
    id: 3,
    nombre: "Local 3",
    inquilino: "Carlos Ruiz",
    monto: 1500,
    vencimiento: 1,
    color: "#E07B6A",
    pagos: { "2026-01": true, "2026-02": true, "2026-03": true, "2026-04": true, "2026-05": true },
    notas: {},
  },
];

// ── Estado ────────────────────────────────────────────────────────
function getEstado(local) {
  if (local.pagos[mesActual]) return "pagado";
  if (hoy.getDate() > local.vencimiento) return "atrasado";
  return "pendiente";
}

const estadoConfig = {
  pagado:    { label: "Pagado",    bg: "#1a3a2a", text: "#6fcf97", border: "#6fcf9733" },
  pendiente: { label: "Pendiente", bg: "#3a3010", text: "#f2c94c", border: "#f2c94c33" },
  atrasado:  { label: "Atrasado",  bg: "#3a1010", text: "#eb5757", border: "#eb575733" },
};

// ── Estilos inline reutilizables ──────────────────────────────────
const S = {
  card: {
    background: "#161820",
    border: "1px solid #252530",
    borderRadius: 14,
    overflow: "hidden",
  },
  label: {
    fontSize: 11,
    color: "#555",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  btn: (active, colors) => ({
    background: active ? colors.activeBg : colors.inactiveBg,
    color: active ? colors.activeText : colors.inactiveText,
    border: `1px solid ${active ? colors.activeBorder : colors.inactiveBorder}`,
    borderRadius: 8,
    cursor: "pointer",
    fontFamily: "inherit",
    transition: "all 0.2s",
    WebkitTapHighlightColor: "transparent",
  }),
};

// ── Modal Notas ───────────────────────────────────────────────────
function ModalNotas({ local, mes, onClose, onSave }) {
  const [texto, setTexto] = useState(local.notas[mes] || "");

  // Evitar scroll del body cuando el modal está abierto
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.8)",
        display: "flex", alignItems: "flex-end",
        padding: 0,
      }}
    >
      {/* Sheet desde abajo en móvil */}
      <div style={{
        background: "#161820",
        border: "1px solid #2a2a35",
        borderRadius: "20px 20px 0 0",
        padding: "20px 20px 32px",
        width: "100%",
        maxHeight: "90vh",
        overflowY: "auto",
      }}>
        {/* Handle */}
        <div style={{ width: 36, height: 4, background: "#333", borderRadius: 2, margin: "0 auto 20px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div>
            <div style={{ ...S.label, marginBottom: 4 }}>Nota — {mesLabel(mes)}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#e8e3d9" }}>{local.nombre}</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{local.inquilino}</div>
          </div>
          <button onClick={onClose} style={{
            background: "#1e2030", border: "none", color: "#888",
            width: 32, height: 32, borderRadius: "50%",
            fontSize: 18, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        {/* Plantillas */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ ...S.label, marginBottom: 8 }}>Plantillas rápidas</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              `Abonó $${Math.round(local.monto / 2).toLocaleString()} el día ${hoy.getDate()}.`,
              "Pagó el monto completo.",
              "Pago pendiente, acordó pagar el día ___.",
              "Solicitó prórroga hasta el día ___.",
            ].map((t, i) => (
              <button key={i} onClick={() => setTexto(prev => prev ? prev + " " + t : t)} style={{
                background: "#1e2030", border: "1px solid #2a2a40",
                borderRadius: 8, padding: "10px 14px",
                fontSize: 13, color: "#888", cursor: "pointer",
                fontFamily: "inherit", textAlign: "left", lineHeight: 1.4,
              }}>
                + {t}
              </button>
            ))}
          </div>
        </div>

        <textarea
          autoFocus
          value={texto}
          onChange={e => setTexto(e.target.value)}
          placeholder="Ej: Abonó $600 el día 3, resto lo paga el día 15..."
          rows={4}
          style={{
            width: "100%", background: "#0f1117",
            border: "1px solid #2a2a40", borderRadius: 10,
            padding: "14px", color: "#e8e3d9", fontSize: 15,
            fontFamily: "inherit", outline: "none",
            lineHeight: 1.6, marginBottom: 14,
          }}
        />

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => onSave(texto)} style={{
            flex: 1, background: "#C8A96E", color: "#0f1117", border: "none",
            borderRadius: 10, padding: "15px", fontSize: 15, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5,
          }}>Guardar</button>
          {local.notas[mes] && (
            <button onClick={() => onSave("")} style={{
              background: "#1e1010", color: "#eb5757",
              border: "1px solid #eb575733", borderRadius: 10,
              padding: "15px 18px", fontSize: 14, cursor: "pointer", fontFamily: "inherit",
            }}>Borrar</button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Modal Editar ──────────────────────────────────────────────────
function ModalEditar({ local, onClose, onSave }) {
  const [form, setForm] = useState({
    nombre: local.nombre,
    inquilino: local.inquilino,
    monto: local.monto,
    vencimiento: local.vencimiento,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const campos = [
    { label: "Nombre del local", key: "nombre", type: "text" },
    { label: "Inquilino", key: "inquilino", type: "text" },
    { label: "Monto mensual ($)", key: "monto", type: "number" },
    { label: "Día de vencimiento", key: "vencimiento", type: "number" },
  ];

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.8)",
      display: "flex", alignItems: "flex-end",
    }}>
      <div style={{
        background: "#161820", border: "1px solid #2a2a35",
        borderRadius: "20px 20px 0 0",
        padding: "20px 20px 32px", width: "100%",
        maxHeight: "90vh", overflowY: "auto",
      }}>
        <div style={{ width: 36, height: 4, background: "#333", borderRadius: 2, margin: "0 auto 20px" }} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
          <div>
            <div style={{ ...S.label, marginBottom: 4 }}>Editando</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#e8e3d9" }}>{local.nombre}</div>
          </div>
          <button onClick={onClose} style={{
            background: "#1e2030", border: "none", color: "#888",
            width: 32, height: 32, borderRadius: "50%",
            fontSize: 18, cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        {campos.map(f => (
          <div key={f.key} style={{ marginBottom: 18 }}>
            <label style={{ display: "block", ...S.label, marginBottom: 8 }}>{f.label}</label>
            <input
              type={f.type}
              value={form[f.key]}
              onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
              style={{
                width: "100%", background: "#0f1117",
                border: "1px solid #2a2a40", borderRadius: 10,
                padding: "14px", color: "#e8e3d9", fontSize: 16,
                fontFamily: "inherit", outline: "none",
              }}
            />
          </div>
        ))}

        <button onClick={() => onSave({ ...form, monto: Number(form.monto), vencimiento: Number(form.vencimiento) })} style={{
          width: "100%", background: "#C8A96E", color: "#0f1117", border: "none",
          borderRadius: 10, padding: "16px", fontSize: 16, fontWeight: 700,
          cursor: "pointer", fontFamily: "inherit", letterSpacing: 0.5, marginTop: 4,
        }}>
          Guardar cambios
        </button>
      </div>
    </div>
  );
}

// ── App Principal ─────────────────────────────────────────────────
export default function App() {
  const [locales, setLocales] = useState(() => {
    try {
      const guardado = localStorage.getItem("alquileres_locales");
      return guardado ? JSON.parse(guardado) : INITIAL_LOCALES;
    } catch { return INITIAL_LOCALES; }
  });

  const [vista, setVista] = useState("dashboard");
  const [modalNota, setModalNota] = useState(null);
  const [modalEditar, setModalEditar] = useState(null);

  // Persistir en localStorage
  useEffect(() => {
    try { localStorage.setItem("alquileres_locales", JSON.stringify(locales)); }
    catch {}
  }, [locales]);

  const togglePago = (localId, mes) =>
    setLocales(prev => prev.map(l =>
      l.id === localId ? { ...l, pagos: { ...l.pagos, [mes]: !l.pagos[mes] } } : l
    ));

  const guardarNota = (localId, mes, texto) => {
    setLocales(prev => prev.map(l => {
      if (l.id !== localId) return l;
      const notas = { ...l.notas };
      if (texto.trim()) notas[mes] = texto.trim();
      else delete notas[mes];
      return { ...l, notas };
    }));
    setModalNota(null);
  };

  const guardarEditar = (localId, datos) => {
    setLocales(prev => prev.map(l => l.id === localId ? { ...l, ...datos } : l));
    setModalEditar(null);
  };

  const totalMes = locales.reduce((a, l) => a + (l.pagos[mesActual] ? l.monto : 0), 0);
  const totalEsperado = locales.reduce((a, l) => a + l.monto, 0);
  const localNotaModal = modalNota ? locales.find(l => l.id === modalNota.localId) : null;
  const localEditarModal = modalEditar ? locales.find(l => l.id === modalEditar) : null;

  return (
    <div style={{ minHeight: "100dvh", background: "#0f1117", color: "#e8e3d9", fontFamily: "'Georgia', serif" }}>

      {/* Modales */}
      {modalNota && localNotaModal && (
        <ModalNotas local={localNotaModal} mes={modalNota.mes}
          onClose={() => setModalNota(null)}
          onSave={(texto) => guardarNota(modalNota.localId, modalNota.mes, texto)} />
      )}
      {modalEditar && localEditarModal && (
        <ModalEditar local={localEditarModal}
          onClose={() => setModalEditar(null)}
          onSave={(datos) => guardarEditar(modalEditar, datos)} />
      )}

      {/* Header */}
      <div style={{
        borderBottom: "1px solid #1e1e28",
        padding: "env(safe-area-inset-top, 16px) 20px 16px",
        paddingTop: "max(env(safe-area-inset-top, 0px), 16px)",
        background: "#0f1117",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: "#555", textTransform: "uppercase", marginBottom: 2 }}>
              Gestión de Propiedades
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#e8e3d9" }}>Mis Locales</div>
          </div>
          <div style={{ fontSize: 12, color: "#C8A96E" }}>
            {mesLabel(mesActual)}
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px 100px" }}>

        {/* ── DASHBOARD ── */}
        {vista === "dashboard" && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
              {[
                { label: "Cobrado", value: `$${totalMes.toLocaleString()}`, sub: `de $${totalEsperado.toLocaleString()}`, color: "#6fcf97" },
                { label: "Al día", value: `${locales.filter(l => l.pagos[mesActual]).length}/${locales.length}`, sub: "locales", color: "#C8A96E" },
                { label: "Pendiente", value: `$${(totalEsperado - totalMes).toLocaleString()}`, sub: "por cobrar", color: totalEsperado - totalMes > 0 ? "#eb5757" : "#6fcf97" },
              ].map((s, i) => (
                <div key={i} style={{ ...S.card, padding: "14px 12px" }}>
                  <div style={{ fontSize: 9, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: s.color, letterSpacing: -0.5 }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Tarjetas locales */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {locales.map(local => {
                const estado = getEstado(local);
                const cfg = estadoConfig[estado];
                const notaMes = local.notas[mesActual];
                return (
                  <div key={local.id} style={S.card}>
                    {/* Fila principal */}
                    <div style={{ padding: "18px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
                      {/* Barra color */}
                      <div style={{ width: 4, minHeight: 60, borderRadius: 4, background: local.color, flexShrink: 0, marginTop: 2 }} />

                      {/* Info + acciones */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: "#e8e3d9" }}>{local.nombre}</span>
                          <span style={{
                            fontSize: 9, letterSpacing: 1.5, textTransform: "uppercase",
                            background: cfg.bg, color: cfg.text, borderRadius: 4,
                            padding: "3px 7px", border: `1px solid ${cfg.border}`, whiteSpace: "nowrap",
                          }}>{cfg.label}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#666", marginBottom: 12 }}>
                          {local.inquilino} · Vence día {local.vencimiento}
                        </div>

                        {/* Monto + botones en fila */}
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                          <div style={{ fontSize: 20, fontWeight: 700, color: "#e8e3d9", marginRight: 4 }}>
                            ${local.monto.toLocaleString()}
                            <span style={{ fontSize: 11, color: "#555", fontWeight: 400 }}>/mes</span>
                          </div>

                          <button onClick={() => togglePago(local.id, mesActual)} style={{
                            background: local.pagos[mesActual] ? "#1a3a2a" : "#1e2a1e",
                            color: local.pagos[mesActual] ? "#6fcf97" : "#4a8a5a",
                            border: `1px solid ${local.pagos[mesActual] ? "#6fcf97" : "#2a4a2a"}`,
                            borderRadius: 8, padding: "8px 14px", fontSize: 12,
                            cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap",
                          }}>
                            {local.pagos[mesActual] ? "✓ Pagado" : "Marcar pagado"}
                          </button>

                          <button onClick={() => setModalNota({ localId: local.id, mes: mesActual })} style={{
                            background: notaMes ? "#1e1a10" : "transparent",
                            color: notaMes ? "#C8A96E" : "#555",
                            border: `1px solid ${notaMes ? "#C8A96E44" : "#2a2a35"}`,
                            borderRadius: 8, padding: "8px 12px", fontSize: 12,
                            cursor: "pointer", fontFamily: "inherit",
                          }}>
                            {notaMes ? "📝" : "+ Nota"}
                          </button>

                          <button onClick={() => setModalEditar(local.id)} style={{
                            background: "transparent", color: "#555",
                            border: "1px solid #2a2a35", borderRadius: 8,
                            padding: "8px 12px", fontSize: 12,
                            cursor: "pointer", fontFamily: "inherit",
                          }}>✎</button>
                        </div>
                      </div>
                    </div>

                    {/* Nota visible */}
                    {notaMes && (
                      <div onClick={() => setModalNota({ localId: local.id, mes: mesActual })} style={{
                        margin: "0 16px 14px", background: "#1a1608",
                        border: "1px solid #C8A96E22", borderLeft: "3px solid #C8A96E",
                        borderRadius: "0 8px 8px 0", padding: "10px 12px",
                        fontSize: 13, color: "#b89a5a", cursor: "pointer", lineHeight: 1.5,
                      }}>
                        <span style={{ fontSize: 9, color: "#7a6a40", letterSpacing: 1.5, textTransform: "uppercase", display: "block", marginBottom: 4 }}>
                          Nota · {mesLabel(mesActual)}
                        </span>
                        {notaMes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── HISTORIAL ── */}
        {vista === "historial" && (
          <>
            <div style={{ ...S.label, marginBottom: 20 }}>Últimos 5 meses</div>
            {locales.map(local => (
              <div key={local.id} style={{ ...S.card, marginBottom: 16 }}>
                {/* Cabecera */}
                <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e1e28", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: local.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#e8e3d9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {local.nombre}
                    </div>
                    <div style={{ fontSize: 11, color: "#555" }}>{local.inquilino}</div>
                  </div>
                  <div style={{ fontSize: 13, color: "#C8A96E", fontWeight: 700, flexShrink: 0 }}>${local.monto.toLocaleString()}/mes</div>
                </div>

                {/* Meses — scroll horizontal si es necesario */}
                <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
                  <div style={{ display: "flex", minWidth: "max-content" }}>
                    {mesesHistorial.map((mes, idx) => {
                      const pagado = local.pagos[mes];
                      const nota = local.notas[mes];
                      const esMesActual = mes === mesActual;
                      return (
                        <div key={mes} style={{
                          minWidth: 110, padding: "14px 12px",
                          borderRight: idx < 4 ? "1px solid #1e1e28" : "none",
                          background: esMesActual ? "#1a1820" : "transparent",
                        }}>
                          <div style={{ fontSize: 10, color: esMesActual ? "#C8A96E" : "#555", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 10, whiteSpace: "nowrap" }}>
                            {mesLabel(mes)}
                          </div>
                          <button onClick={() => togglePago(local.id, mes)} style={{
                            width: "100%", padding: "9px 0",
                            background: pagado ? "#1a3a2a" : "#1a1a22",
                            color: pagado ? "#6fcf97" : "#444",
                            border: `1px solid ${pagado ? "#6fcf9766" : "#2a2a35"}`,
                            borderRadius: 8, fontSize: 13, cursor: "pointer",
                            fontFamily: "inherit", marginBottom: 8, whiteSpace: "nowrap",
                          }}>
                            {pagado ? "✓ Pagado" : "—"}
                          </button>
                          <button onClick={() => setModalNota({ localId: local.id, mes })} style={{
                            width: "100%", padding: "7px 0",
                            background: nota ? "#1a1608" : "transparent",
                            color: nota ? "#C8A96E" : "#3a3a45",
                            border: `1px solid ${nota ? "#C8A96E33" : "#2a2a35"}`,
                            borderRadius: 7, fontSize: 11, cursor: "pointer", fontFamily: "inherit",
                          }}>
                            {nota ? "📝 Ver nota" : "+ Nota"}
                          </button>
                          {nota && (
                            <div style={{
                              marginTop: 8, fontSize: 11, color: "#7a6a40", lineHeight: 1.4,
                              display: "-webkit-box", WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical", overflow: "hidden",
                            }}>
                              {nota}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total */}
                <div style={{ borderTop: "1px solid #1e1e28", padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#555", letterSpacing: 1, textTransform: "uppercase" }}>Total cobrado</span>
                  <span style={{ fontSize: 16, fontWeight: 700, color: "#C8A96E" }}>
                    ${(mesesHistorial.filter(m => local.pagos[m]).length * local.monto).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Barra de navegación inferior fija */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "#0f1117",
        borderTop: "1px solid #1e1e28",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}>
        {[
          { id: "dashboard", label: "Resumen", icon: "⬛" },
          { id: "historial", label: "Historial", icon: "📋" },
        ].map(tab => (
          <button key={tab.id} onClick={() => setVista(tab.id)} style={{
            flex: 1, padding: "14px 0 12px",
            background: "transparent", border: "none",
            color: vista === tab.id ? "#C8A96E" : "#555",
            fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase",
            cursor: "pointer", fontFamily: "inherit",
            borderTop: `2px solid ${vista === tab.id ? "#C8A96E" : "transparent"}`,
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
          }}>
            <span style={{ fontSize: 18 }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
