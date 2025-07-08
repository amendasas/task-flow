function Modal({ message, onConfirm, onCancel, modalContent, onReset }) {
  return (
    <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-dark p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-xl font-semibold text-lightYellow mb-4">{message}</h3>
        {modalContent}
        <div className="flex justify-between mt-4">
          <button
            className="bg-tealDark text-white px-4 py-2 rounded-lg hover:bg-tealLight transition"
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button
            className="bg-primary text-white px-3 py-1 rounded-lg hover:bg-red-600/50 transition"
            onClick={() => {
              if (onReset) onReset(); // Reseta os campos se a função foi passada
              onCancel();
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
