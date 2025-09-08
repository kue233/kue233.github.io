import React, { useEffect, useState } from "react";

export default function App() {
  const [img, setImg] = useState("");
  const [expires, setExpires] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    setImg("");
    try {
      const res = await fetch(`/data/current.json?ts=${Date.now()}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("配置加载失败");
      const data = await res.json();
      if (!data?.qr) throw new Error("缺少 qr 字段");
      setImg(`${data.qr}${data.qr.includes("?") ? "&" : "?"}ts=${Date.now()}`);
      setExpires(data.expires || "");
    } catch (e) {
      setErr(String(e.message || e));
    }
  }

  useEffect(() => {
    load();
  }, []);

  const expired = (() => {
    if (!expires) return false;
    const t = new Date(expires);
    return !isNaN(t) && t < new Date();
  })();

  return (
    <div
      style={{
        minHeight: "100svh",
        display: "grid",
        placeItems: "center",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ maxWidth: 720, width: "100%", padding: 24 }}>
        <h1 style={{ margin: "0 0 8px" }}>微信群活码</h1>
        <p style={{ opacity: 0.8, margin: "0 0 12px" }}>
          扫描下方二维码加入。本页会随二维码更新。
        </p>
        <div
          style={{
            border: "1px solid #ddd",
            borderRadius: 16,
            padding: 20,
            textAlign: "center",
          }}
        >
          {err && (
            <p style={{ color: "#b00020", fontWeight: 600 }}>错误：{err}</p>
          )}
          {!err && !img && <p>正在加载二维码…</p>}
          {img && (
            <img
              src={img}
              alt="微信群二维码"
              style={{ width: "min(80vw,380px)", borderRadius: 12 }}
            />
          )}
          <div style={{ marginTop: 12, opacity: 0.8 }}>
            {expires && !expired && (
              <>有效期至：{new Date(expires).toLocaleString()}</>
            )}
            {expires && expired && (
              <span style={{ color: "#b00020", fontWeight: 600 }}>
                ⚠️ 当前二维码已过期
              </span>
            )}
          </div>
          <div style={{ marginTop: 12 }}>
            <button
              onClick={load}
              style={{
                padding: "10px 16px",
                borderRadius: 999,
                border: "1px solid #999",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              手动刷新
            </button>
          </div>
        </div>
        <p style={{ opacity: 0.7, marginTop: 12 }}>无法加入请联系管理员。</p>
      </div>
    </div>
  );
}
