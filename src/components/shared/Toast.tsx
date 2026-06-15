import { useEnquiryStore } from '../../stores/enquiryStore'

export function Toast() {
  const visible = useEnquiryStore((s) => s.toastVisible)
  const message = useEnquiryStore((s) => s.toastMessage)
  const hideToast = useEnquiryStore((s) => s.hideToast)

  if (!visible) return null

  return (
    <div className="fixed bottom-6 right-6 z-[200] bg-green text-white px-5 py-4 flex items-center gap-3 shadow-lg min-w-[280px]" style={{ animation: 'toast-in 0.3s ease-out' }}>
      <span className="text-lg">✓</span>
      <div>
        <strong className="block text-sm">Enquiry created</strong>
        <small className="text-[11px] text-white/70">{message}</small>
      </div>
      <button onClick={hideToast} className="ml-auto bg-transparent border-0 text-white/60 cursor-pointer text-lg">×</button>
    </div>
  )
}
