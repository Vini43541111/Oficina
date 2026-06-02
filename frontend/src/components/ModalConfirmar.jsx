export default function ModalConfirmar({ visivel, mensagem, onConfirmar, onCancelar }) {
  if (!visivel) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirmar ação</h5>
            <button type="button" className="btn-close" onClick={onCancelar} />
          </div>
          <div className="modal-body">
            <p>{mensagem}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onCancelar}>
              Cancelar
            </button>
            <button className="btn btn-danger" onClick={onConfirmar}>
              Confirmar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
