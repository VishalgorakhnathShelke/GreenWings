import { Link } from 'react-router-dom'
import { BrandMark } from './BrandMark'
import { useLoginStore } from '../../stores/loginStore'

export function Footer() {
  const openLogin = useLoginStore((s) => s.openLogin)

  return (
    <footer className="bg-deep text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 px-[8vw] py-16">
        <div>
          <Link to="/" className="flex items-center gap-2.5 no-underline text-white mb-6">
            <BrandMark />
            <span>
              <strong className="font-serif block text-xl leading-none text-white">GreenWings</strong>
              <small className="text-[8px] tracking-[0.13em] uppercase opacity-68 text-white">Farmers Producer Company Limited</small>
            </span>
          </Link>
          <p className="text-sm text-white/70 mb-4">Jalgaon Neur, Yeola,<br />Nashik, Maharashtra, India</p>
          <a href="tel:+919921155128" className="text-white/90 text-sm no-underline">+91 99211 55128</a>
          <p className="text-[9px] text-white/50 mt-4">CIN: U01133MH2023PTC398524<br />PAN: AAKCG3098B · GSTIN: 27AAKCG3098B1ZK</p>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Explore</h4>
          <div className="flex flex-col gap-2">
            <Link to="/about" className="text-white/70 text-sm no-underline hover:text-lime">About GreenWings</Link>
            <Link to="/services" className="text-white/70 text-sm no-underline hover:text-lime">Services</Link>
            <Link to="/impact" className="text-white/70 text-sm no-underline hover:text-lime">Projects & impact</Link>
            <Link to="/stories" className="text-white/70 text-sm no-underline hover:text-lime">Success stories</Link>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold text-sm mb-4">Resources</h4>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-white/70 text-sm no-underline hover:text-lime">News & updates</a>
            <a href="#" className="text-white/70 text-sm no-underline hover:text-lime">Gallery</a>
            <a href="#" className="text-white/70 text-sm no-underline hover:text-lime">Farmer resources</a>
            <a href="#" className="text-white/70 text-sm no-underline hover:text-lime">Annual reports</a>
          </div>
        </div>

        <div className="bg-green p-6">
          <span className="text-[9px] text-gold uppercase tracking-[0.12em] font-bold">Member support</span>
          <h3 className="font-serif text-xl mt-3 mb-4 text-white">Have a question about your farm or membership?</h3>
          <button onClick={openLogin} className="border border-white/30 bg-transparent text-white px-4 py-2 text-sm cursor-pointer hover:bg-white/10">
            Open member portal →
          </button>
        </div>
      </div>

      <div className="border-t border-white/10 px-[8vw] py-4 flex flex-wrap justify-between gap-4 text-[10px] text-white/50">
        <span>© 2026 GREEN WINGS FARMERS PRODUCER COMPANY LIMITED</span>
        <span>Privacy · Terms · Accessibility</span>
        <span>English · हिन्दी · मराठी</span>
      </div>
    </footer>
  )
}
