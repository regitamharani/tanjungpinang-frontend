import { useState } from "react";
import { useAppStore } from "@/store/appStore";
import { Save, Globe, Phone, Mail, Instagram, Youtube, Key } from "lucide-react";

export default function Settings() {
  const { settings, updateSettings } = useAppStore();
  const [form, setForm] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setSocial = (k, v) => setForm(p => ({ ...p, socialMedia: { ...p.socialMedia, [k]: v } }));
  const setContact = (k, v) => setForm(p => ({ ...p, contact: { ...p.contact, [k]: v } }));

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200";
  const Section = ({ title, children }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm space-y-4">
      <p className="text-sm font-semibold text-gray-800 border-b border-gray-50 pb-3">{title}</p>
      {children}
    </div>
  );
  const Field = ({ label, hint, children }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}{hint && <span className="text-gray-400 font-normal ml-1">{hint}</span>}</label>
      {children}
    </div>
  );

  return (
    <div className="min-h-full bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 md:px-8 py-5 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-gray-900">Settings Website</h1>
          <p className="text-sm text-gray-500 mt-0.5">Konfigurasi umum Tanjung Pinang Guide</p>
        </div>
        <button onClick={handleSave}
          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors shadow-sm ${saved ? "bg-emerald-600 text-white" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}>
          <Save size={14} /> {saved ? "Tersimpan!" : "Simpan"}
        </button>
      </div>

      <div className="px-6 md:px-8 py-6 max-w-2xl space-y-5">
        <Section title="Identitas Website">
          <Field label="Nama Website">
            <input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Logo URL" hint="(kosongkan jika menggunakan teks)">
            <input value={form.logo} onChange={(e) => set("logo", e.target.value)} placeholder="https://..." className={inputCls} />
            {form.logo && <img src={form.logo} alt="logo" className="mt-2 h-10 object-contain rounded" onError={(e) => { e.target.style.display = "none"; }} />}
          </Field>
          <Field label="Footer Text">
            <input value={form.footerText} onChange={(e) => set("footerText", e.target.value)} className={inputCls} />
          </Field>
        </Section>

        <Section title="Kontak">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email">
              <div className="relative">
                <Mail size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.contact?.email} onChange={(e) => setContact("email", e.target.value)} className={`${inputCls} pl-8`} />
              </div>
            </Field>
            <Field label="Telepon/WhatsApp">
              <div className="relative">
                <Phone size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.contact?.phone} onChange={(e) => setContact("phone", e.target.value)} className={`${inputCls} pl-8`} />
              </div>
            </Field>
          </div>
          <Field label="Alamat">
            <input value={form.contact?.address} onChange={(e) => setContact("address", e.target.value)} className={inputCls} />
          </Field>
        </Section>

        <Section title="Social Media">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Instagram">
              <div className="relative">
                <Instagram size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.socialMedia?.instagram} onChange={(e) => setSocial("instagram", e.target.value)} placeholder="@username atau URL" className={`${inputCls} pl-8`} />
              </div>
            </Field>
            <Field label="Facebook">
              <div className="relative">
                <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.socialMedia?.facebook} onChange={(e) => setSocial("facebook", e.target.value)} placeholder="URL Facebook" className={`${inputCls} pl-8`} />
              </div>
            </Field>
            <Field label="TikTok">
              <div className="relative">
                <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.socialMedia?.tiktok} onChange={(e) => setSocial("tiktok", e.target.value)} placeholder="@username atau URL" className={`${inputCls} pl-8`} />
              </div>
            </Field>
            <Field label="YouTube">
              <div className="relative">
                <Youtube size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={form.socialMedia?.youtube} onChange={(e) => setSocial("youtube", e.target.value)} placeholder="URL channel" className={`${inputCls} pl-8`} />
              </div>
            </Field>
          </div>
        </Section>

        <Section title="Google API Keys">
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg mb-2">
            <Key size={14} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">API key bersifat rahasia. Jangan bagikan ke publik. Digunakan untuk integrasi Google Maps & Places.</p>
          </div>
          <Field label="Google Maps API Key">
            <input value={form.googleMapsApiKey} onChange={(e) => set("googleMapsApiKey", e.target.value)}
              type="password" placeholder="AIza..." className={`${inputCls} font-mono text-xs`} />
          </Field>
          <Field label="Google Places API Key">
            <input value={form.googlePlacesApiKey} onChange={(e) => set("googlePlacesApiKey", e.target.value)}
              type="password" placeholder="AIza..." className={`${inputCls} font-mono text-xs`} />
          </Field>
        </Section>
      </div>
    </div>
  );
}