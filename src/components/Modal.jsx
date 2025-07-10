function Modal({ message, onConfirm, onCancel, modalContent, onReset }) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-tealLight/20 transform transition-all duration-300 scale-100">
        {/* Cabeçalho do modal com melhor tipografia */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-tealLight to-tealDark rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-lightYellow mb-2">{message}</h3>
          <div className="w-16 h-1 bg-gradient-to-r from-tealLight to-tealDark rounded-full mx-auto"></div>
        </div>

        {/* Conteúdo do modal */}
        <div className="mb-8">
          {modalContent}
        </div>

        {/* Botões com melhor design e simetria */}
        <div className="flex gap-4 justify-center">
          <button
            className="group bg-gradient-to-r from-tealDark to-tealLight text-white px-8 py-3 rounded-xl hover:from-tealLight hover:to-tealDark transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold flex items-center space-x-2 min-w-[120px] justify-center"
            onClick={onConfirm}
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-110 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Confirmar</span>
          </button>
          
          <button
            className="group bg-gradient-to-r from-red-600 to-red-500 text-white px-8 py-3 rounded-xl hover:from-red-500 hover:to-red-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold flex items-center space-x-2 min-w-[120px] justify-center"
            onClick={() => {
              if (onReset) onReset();
              onCancel();
            }}
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-110 duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Cancelar</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;

