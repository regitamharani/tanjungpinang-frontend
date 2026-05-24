import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { post } from "../services/api";

const panelContent = {
  login: {
    title: (
      <>
        Jelajahi Surga
        <br />
        <span className="text-[#BDEFFF]">Kepulauan Riau</span>
        <br />
        Bersama Kami
      </>
    ),
    desc: "Temukan keindahan destinasi wisata, kuliner khas, dan budaya Melayu yang kaya di Tanjung Pinang.",
  },
  register: {
    title: (
      <>
        Jelajahi Surga
        <br />
        <span className="text-[#BDEFFF]">Kepulauan Riau</span>
        <br />
        Bersama Kami
      </>
    ),
    desc: "Temukan keindahan destinasi wisata, kuliner khas, dan budaya Melayu yang kaya di Tanjung Pinang.",
  },
  forgot: {
    title: (
      <>
        Keamanan Akun
        <br />
        <span className="text-[#BDEFFF]">Kami Jaga</span>
        <br />
        Dengan Serius
      </>
    ),
    desc: "Reset password Anda dengan mudah dan aman. Akun Anda akan tetap terlindungi.",
  },
};

const panelStats = [
  { icon: "◎", val: "50+", label: "Destinasi" },
  { icon: "★", val: "4.8", label: "Rating" },
  { icon: "♙", val: "10K+", label: "Pengunjung" },
];

const forgotSteps = [
  "Keamanan Terjamin — Data Anda dilindungi & aman",
  "Verifikasi Email — Link reset dikirim ke email Anda",
  "Password Baru — Buat password yang kuat & baru",
];

// ── Toast Component ───────────────────────────────────────────────────────────
function Toast({ message, type }) {
  if (!message) return null;

  return (
    <div
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[999] flex w-[calc(100%-2rem)] max-w-md items-center justify-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-semibold ${
        type === "error" ? "bg-red-500" : "bg-green-500"
      }`}
    >
      <span>{type === "error" ? "❌" : "✅"}</span>
      <span className="text-center">{message}</span>
    </div>
  );
}

// ── Reusable Icons ────────────────────────────────────────────────────────────
function EmailIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#AEB7C2"
      strokeWidth="2"
      className="shrink-0"
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function PasswordIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#AEB7C2"
      strokeWidth="2"
      className="shrink-0"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#AEB7C2"
      strokeWidth="2"
      className="shrink-0"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#AEB7C2"
      strokeWidth="2"
      className="shrink-0"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function PasswordToggleButton({ show, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-gray-400 hover:text-gray-600 shrink-0"
      aria-label={show ? "Sembunyikan password" : "Tampilkan password"}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        {show ? (
          <>
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </>
        ) : (
          <>
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </>
        )}
      </svg>
    </button>
  );
}

function FormField({
  label,
  icon,
  type = "text",
  value,
  onChange,
  placeholder,
  rightElement,
  height = "h-[47px]",
}) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-600 mb-2 block">
        {label}
      </label>

      <div
        className={`${height} flex items-center gap-3 border border-gray-200 rounded-[10px] px-4 bg-white focus-within:border-[#0AABCF] focus-within:ring-2 focus-within:ring-[#0AABCF]/10 transition-all`}
      >
        {icon}

        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="min-w-0 flex-1 text-[12px] outline-none text-gray-700 placeholder-gray-400 bg-transparent"
        />

        {rightElement}
      </div>
    </div>
  );
}

// ── Left / Right Image Panel ──────────────────────────────────────────────────
function LeftPanel({ mode, position = "left", className = "" }) {
  const { title, desc } = panelContent[mode];

  const roundedClass =
    position === "left" ? "lg:rounded-r-[44px]" : "lg:rounded-l-[44px]";

  return (
    <div
      className={`relative w-full min-h-[430px] sm:min-h-[520px] lg:min-h-0 lg:h-screen flex items-center justify-center overflow-hidden text-white py-10 lg:py-6 ${roundedClass} ${className}`}
      style={{
        backgroundImage: "url('/login.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-[#0878B8]/30" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0064B4]/90 via-[#12A9D0]/50 to-[#00658F]/90" />
      <div className="absolute inset-0 backdrop-blur-[1px]" />

      <div className="relative z-10 w-full max-w-[500px] px-5 text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-[54px] h-[54px] sm:w-[58px] sm:h-[58px] rounded-full border-2 border-white/80 bg-white/10 flex items-center justify-center overflow-hidden">
            <img
              src="/logologin.png"
              alt="Tanjung Pinang Guide"
              className="w-[44px] h-[44px] sm:w-[48px] sm:h-[48px] object-contain"
            />
          </div>

          <span className="text-white font-bold text-[16px] sm:text-[18px] drop-shadow-sm">
            Tanjung Pinang Guide
          </span>
        </div>

        <div className="inline-flex items-center gap-2 bg-white/18 text-white/95 text-[12px] sm:text-[13px] px-4 py-2 rounded-full border border-white/20 backdrop-blur-md mb-5 shadow-sm">
          <span>📍</span>
          <span className="font-semibold">
            Tanjung Pinang, Kepulauan Riau
          </span>
        </div>

        <h2 className="text-[30px] sm:text-[38px] md:text-[44px] lg:text-[46px] font-extrabold leading-[1.08] mb-5 text-white drop-shadow-sm">
          {title}
        </h2>

        <p className="font-['Instrument_Sans'] text-[#D7EAF2] text-[14px] sm:text-[16px] md:text-[17px] leading-[1.45] max-w-[355px] mx-auto mb-7 font-normal text-center">
          {desc}
        </p>

        {mode !== "forgot" && (
          <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-[500px] mx-auto mb-7 lg:mb-9">
            {panelStats.map((stat) => (
              <div
                key={stat.label}
                className="h-[72px] sm:h-[78px] bg-white/16 rounded-[15px] border border-white/18 backdrop-blur-md flex flex-col items-center justify-center shadow-sm"
              >
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span
                    className={`text-sm ${
                      stat.icon === "★" ? "text-yellow-300" : "text-white"
                    }`}
                  >
                    {stat.icon}
                  </span>

                  <p className="text-white text-[16px] sm:text-[18px] font-extrabold">
                    {stat.val}
                  </p>
                </div>

                <p className="text-[#D6F4FF]/85 text-[10px] font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {mode === "forgot" && (
          <div className="max-w-[410px] mx-auto space-y-3 mb-8 text-left">
            {forgotSteps.map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white/20 border border-white/25 flex items-center justify-center shrink-0">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>

                <p className="text-[#E2F8FF] text-sm leading-relaxed">
                  {item}
                </p>
              </div>
            ))}
          </div>
        )}

        {mode !== "forgot" && (
          <div className="max-w-[410px] mx-auto bg-white/14 backdrop-blur-md rounded-[14px] p-5 border border-white/18 text-left shadow-lg">
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  className="text-yellow-300 text-[22px] leading-none"
                >
                  ★
                </span>
              ))}
            </div>

            <p className="font-['Instrument_Sans'] text-[#E9FBFF] text-[14px] leading-relaxed mb-4 font-medium">
              "Pinang Guide membuat perjalanan wisata saya ke Tanjung Pinang
              jauh lebih mudah dan menyenangkan!"
            </p>

            <p className="text-[#D7F5FF]/85 text-[12px] font-bold">
              — Rahma S., Wisatawan Jakarta
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Login Form ────────────────────────────────────────────────────────────────
function LoginForm({ onSwitch, onToast }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [ingat, setIngat] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      onToast("Email dan password harus diisi", "error");
      return;
    }

    try {
      const res = await post("/auth/login", { email, password });
      const json = await res.json();

      if (!json.success) {
        onToast(json.message || "Login gagal", "error");
        return;
      }

      localStorage.setItem("token", json.data.token);
      localStorage.setItem("refreshToken", json.data.refreshToken);
      localStorage.setItem("user", JSON.stringify(json.data.user));

      onToast("Login berhasil! Selamat datang 👋", "success");
      setTimeout(() => navigate("/"), 1200);
    } catch {
      onToast("Tidak bisa terhubung ke server. Coba lagi.", "error");
    }
  };

  return (
    <div className="w-full max-w-[345px] mx-auto text-left">
      <h2 className="text-[28px] sm:text-[32px] leading-tight font-extrabold text-gray-900 mb-2">
        Selamat Datang
      </h2>

      <p className="text-[13px] text-gray-400 mb-7">
        Login untuk melanjutkan ke Pinang Guide
      </p>

      <div className="space-y-4">
        <FormField
          label="Email"
          icon={<EmailIcon />}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nama@email.com"
        />

        <FormField
          label="Password"
          icon={<PasswordIcon />}
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Masukkan password"
          rightElement={
            <PasswordToggleButton
              show={showPass}
              onClick={() => setShowPass(!showPass)}
            />
          }
        />

        <div className="flex items-center justify-between gap-4 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ingat}
              onChange={(event) => setIngat(event.target.checked)}
              className="w-3.5 h-3.5 accent-[#0AABCF]"
            />

            <span className="text-[11px] text-gray-500">Ingat saya</span>
          </label>

          <button
            type="button"
            onClick={() => onSwitch("forgot")}
            className="text-[11px] text-[#0AABCF] font-semibold hover:underline whitespace-nowrap"
          >
            Lupa password?
          </button>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="w-full h-[46px] bg-[#05A9D6] text-white text-[12px] font-bold rounded-[9px] shadow-md shadow-cyan-200 hover:bg-[#0799C3] transition-colors"
        >
          Login
        </button>

        <div className="flex items-center gap-3 pt-2">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[11px] text-gray-400">atau</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-center text-[11px] text-gray-500">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={() => onSwitch("register")}
            className="text-[#0AABCF] font-bold hover:underline"
          >
            Daftar sekarang
          </button>
        </p>

        <div className="text-center pt-1">
          <Link
            to="/"
            className="text-[11px] text-gray-300 hover:text-gray-500 transition-colors"
          >
            ← Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Register Form ─────────────────────────────────────────────────────────────
function RegisterForm({ onSwitch, onToast }) {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [telepon, setTelepon] = useState("");
  const [password, setPassword] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [setuju, setSetuju] = useState(false);

  const handleDaftar = async () => {
    if (!nama || !email || !password || !konfirmasi) {
      onToast("Semua field harus diisi", "error");
      return;
    }

    if (password.length < 8) {
      onToast("Password minimal 8 karakter", "error");
      return;
    }

    if (password !== konfirmasi) {
      onToast("Password tidak cocok", "error");
      return;
    }

    if (!setuju) {
      onToast("Setujui syarat & ketentuan terlebih dahulu", "error");
      return;
    }

    try {
      const body = { nama, email, password };
      if (telepon.trim()) body.telepon = telepon.trim();
      const res = await post("/auth/register", body);
      const json = await res.json();

      if (!json.success) {
        onToast(json.message || "Registrasi gagal", "error");
        return;
      }

      onToast("Akun berhasil dibuat! Silakan login 🎉", "success");
      setTimeout(() => onSwitch("login"), 1200);
    } catch {
      onToast("Tidak bisa terhubung ke server. Coba lagi.", "error");
    }
  };

  return (
    <div className="w-full max-w-[360px] mx-auto text-left">
      <h2 className="text-[26px] sm:text-[30px] leading-tight font-extrabold text-gray-900 mb-2">
        Daftar Akun Baru
      </h2>

      <p className="text-[13px] text-gray-400 mb-5">
        Buat akun untuk mulai menjelajahi Tanjung Pinang
      </p>

      <div className="space-y-3">
        <FormField
          label="Nama Lengkap"
          icon={<UserIcon />}
          value={nama}
          onChange={(event) => setNama(event.target.value)}
          placeholder="Nama lengkap"
          height="h-[43px]"
        />

        <FormField
          label="Email"
          icon={<EmailIcon />}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nama@email.com"
          height="h-[43px]"
        />

        <FormField
          label="No. Telepon (opsional)"
          icon={<PhoneIcon />}
          type="tel"
          value={telepon}
          onChange={(event) => setTelepon(event.target.value)}
          placeholder="08xxxxxxxxxx"
          height="h-[43px]"
        />

        <FormField
          label="Password"
          icon={<PasswordIcon />}
          type={showPass ? "text" : "password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Minimal 8 karakter"
          height="h-[43px]"
          rightElement={
            <PasswordToggleButton
              show={showPass}
              onClick={() => setShowPass(!showPass)}
            />
          }
        />

        <FormField
          label="Konfirmasi Password"
          icon={<PasswordIcon />}
          type={showKonfirmasi ? "text" : "password"}
          value={konfirmasi}
          onChange={(event) => setKonfirmasi(event.target.value)}
          placeholder="Masukkan password lagi"
          height="h-[43px]"
          rightElement={
            <PasswordToggleButton
              show={showKonfirmasi}
              onClick={() => setShowKonfirmasi(!showKonfirmasi)}
            />
          }
        />

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={setuju}
            onChange={(event) => setSetuju(event.target.checked)}
            className="w-3.5 h-3.5 accent-[#0AABCF] mt-0.5 shrink-0"
          />

          <span className="text-[11px] text-gray-500 leading-relaxed">
            Saya setuju dengan{" "}
            <button type="button" className="text-[#0AABCF] hover:underline">
              Syarat & Ketentuan
            </button>{" "}
            dan{" "}
            <button type="button" className="text-[#0AABCF] hover:underline">
              Kebijakan Privasi
            </button>
          </span>
        </label>

        <button
          type="button"
          onClick={handleDaftar}
          className="w-full h-[43px] bg-[#05A9D6] text-white text-[12px] font-bold rounded-[9px] shadow-md shadow-cyan-200 hover:bg-[#0799C3] transition-colors"
        >
          Daftar
        </button>

        <div className="flex items-center gap-3 pt-1">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[11px] text-gray-400">atau</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-center text-[11px] text-gray-500">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="text-[#0AABCF] font-bold hover:underline"
          >
            Login sekarang
          </button>
        </p>

        <div className="text-center pt-0.5">
          <Link
            to="/"
            className="text-[11px] text-gray-300 hover:text-gray-500 transition-colors"
          >
            ← Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Forgot Password Form ──────────────────────────────────────────────────────
function ForgotForm({ onSwitch, onToast }) {
  const [email, setEmail] = useState("");
  const [terkirim, setTerkirim] = useState(false);

  const handleKirim = () => {
    if (!email) {
      onToast("Email harus diisi", "error");
      return;
    }

    onToast("Link reset password telah dikirim ke email Anda ✅", "success");
    setTerkirim(true);
  };

  if (terkirim) {
    return (
      <div className="w-full max-w-[345px] mx-auto text-center">
        <div className="w-16 h-16 rounded-full bg-cyan-50 border-2 border-[#0AABCF] flex items-center justify-center mx-auto mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#0AABCF"
            strokeWidth="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h2 className="text-[28px] sm:text-[32px] leading-tight font-extrabold text-gray-900 mb-2">
          Email Terkirim!
        </h2>

        <p className="text-[13px] text-gray-400 mb-1">
          Link reset password telah dikirim ke
        </p>

        <p className="text-sm text-[#0AABCF] font-semibold mb-6 break-all">
          {email}
        </p>

        <p className="text-xs text-gray-400 mb-8 leading-relaxed">
          Cek folder inbox atau spam jika email tidak ditemukan dalam beberapa
          menit.
        </p>

        <button
          type="button"
          onClick={() => onSwitch("login")}
          className="w-full h-[46px] bg-[#05A9D6] text-white text-[12px] font-bold rounded-[9px] hover:bg-[#0799C3] transition-colors mb-3"
        >
          Kembali ke Login
        </button>

        <button
          type="button"
          onClick={() => {
            setTerkirim(false);
            setEmail("");
          }}
          className="w-full text-xs text-gray-400 hover:text-gray-600"
        >
          Kirim ulang email
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[345px] mx-auto text-left">
      <h2 className="text-[28px] sm:text-[32px] leading-tight font-extrabold text-gray-900 mb-2">
        Lupa Password?
      </h2>

      <p className="text-[13px] text-gray-400 mb-7">
        Masukkan email Anda untuk menerima link reset password
      </p>

      <div className="space-y-5">
        <div>
          <FormField
            label="Alamat Email"
            icon={<EmailIcon />}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nama@email.com"
          />

          <p className="text-xs text-gray-400 mt-2">
            Pastikan email yang Anda masukkan adalah email yang terdaftar.
          </p>
        </div>

        <button
          type="button"
          onClick={handleKirim}
          className="w-full h-[46px] bg-[#05A9D6] text-white text-[12px] font-bold rounded-[9px] shadow-md shadow-cyan-200 hover:bg-[#0799C3] transition-colors"
        >
          Kirim Link Reset
        </button>

        <div className="text-center space-y-2">
          <button
            type="button"
            onClick={() => onSwitch("login")}
            className="block w-full text-[11px] text-gray-500 hover:text-gray-700"
          >
            ← Kembali ke Login
          </button>

          <Link
            to="/"
            className="block text-[11px] text-gray-300 hover:text-gray-500"
          >
            ← Kembali ke Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Main Auth Page ────────────────────────────────────────────────────────────
export default function AuthPage({ defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type) => {
    setToast({ message, type });

    setTimeout(() => {
      setToast({ message: "", type: "" });
    }, 3000);
  };

  const isRegister = mode === "register";

  const panelOrder = isRegister
    ? "order-1 lg:order-2"
    : "order-1 lg:order-1";

  const formOrder = isRegister
    ? "order-2 lg:order-1"
    : "order-2 lg:order-2";

  return (
    <div className="min-h-screen w-full bg-white lg:h-screen lg:overflow-hidden">
      <Toast message={toast.message} type={toast.type} />

      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 lg:h-screen">
        <LeftPanel
          mode={mode}
          position={isRegister ? "right" : "left"}
          className={panelOrder}
        />

        <div
          className={`${formOrder} min-h-[560px] lg:h-screen flex items-center justify-center bg-white px-5 sm:px-10 md:px-16 lg:px-20 py-10 lg:py-6 lg:overflow-y-auto`}
        >
          {mode === "login" && (
            <LoginForm onSwitch={setMode} onToast={showToast} />
          )}

          {mode === "register" && (
            <RegisterForm onSwitch={setMode} onToast={showToast} />
          )}

          {mode === "forgot" && (
            <ForgotForm onSwitch={setMode} onToast={showToast} />
          )}
        </div>
      </div>
    </div>
  );
}