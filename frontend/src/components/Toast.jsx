import { useEffect } from 'react';

export default function Toast({ mensagem, tipo, onFechar }) {
  useEffect(() => {
    if (!mensagem) return;
    const timer = setTimeout(onFechar, 3500);
    return () => clearTimeout(timer);
  }, [mensagem, onFechar]);

  if (!mensagem) return null;

  const classes = {
    sucesso: 'success',
    erro: 'danger',
    aviso: 'warning',
  };

  return (
    <div
      className="position-fixed top-0 end-0 p-3"
      style={{ zIndex: 9999 }}
    >
      <div className={`toast show align-items-center text-white bg-${classes[tipo] || 'secondary'} border-0`}>
        <div className="d-flex">
          <div className="toast-body fw-semibold">{mensagem}</div>
          <button
            type="button"
            className="btn-close btn-close-white me-2 m-auto"
            onClick={onFechar}
          />
        </div>
      </div>
    </div>
  );
}
