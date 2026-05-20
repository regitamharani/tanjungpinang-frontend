import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { post, isLoggedIn } from "../services/api";

const STEPS = {
  DURATION: "duration",
  CATEGORY: "category",
  BUDGET: "budget",
  TRAVELER: "traveler",
  CHAT: "chat",
};

const durasiOptions = ["1 Hari", "2 Hari", "3 Hari", "4 Hari"];

const kategoriOptions = [
  "Wisata Alam",
  "Wisata Budaya",
  "Wisata Religi",
  "Kuliner",
  "Semua Kategori",
];

const budgetOptions = [
  "Hemat (backpacker)",
  "Menengah (comfort)",
  "Premium (nyaman)",
];

const travelerOptions = [
  "Solo Traveler",
  "Berdua / Pasangan",
  "Keluarga",
  "Rombongan / Grup",
];

function getDayCount(duration) {
  const match = duration?.match(/\d+/);
  return match ? Number(match[0]) : 1;
}

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getBudgetRange(budget) {
  if (budget?.includes("Hemat")) return "Rp 150.000 - Rp 250.000";
  if (budget?.includes("Premium")) return "Rp 600.000 - Rp 1.000.000";
  return "Rp 300.000 - Rp 500.000";
}

function getShortBudget(budget) {
  if (budget?.includes("Hemat")) return "Hemat";
  if (budget?.includes("Premium")) return "Premium";
  return "Menengah";
}

function getShortTraveler(traveler) {
  if (traveler?.includes("Solo")) return "Solo";
  if (traveler?.includes("Pasangan")) return "Berdua";
  if (traveler?.includes("Keluarga")) return "Keluarga";
  return "Grup";
}

function getTotalPlaces(data) {
  return data?.days?.reduce((total, day) => {
    return total + (day.items?.length || 0);
  }, 0);
}

function buildItineraryData(selections) {
  const totalDays = getDayCount(selections[STEPS.DURATION]);
  const budgetText = selections[STEPS.BUDGET] || "Menengah (comfort)";

  const budgetPerDay = budgetText.includes("Hemat")
    ? 180000
    : budgetText.includes("Premium")
    ? 650000
    : 350000;

  const dayTemplates = [
    {
      title: "Surga Pantai Trikora",
      subtitle: "Hari pertama menikmati suasana alam dan pantai.",
      items: [
        {
          time: "07.30",
          duration: "2 jam",
          title: "Pantai Trikora",
          category: "Wisata Alam",
          cost: "Rp10.000 - Rp20.000",
          tip: "Berangkat pagi hari agar mendapat spot terbaik dan hindari panas terik.",
          location: "Jl. Trikora, Bintan, Kepulauan Riau",
          description:
            "Menikmati sunrise di pantai berpasir putih dengan air laut jernih kehijauan yang memukau.",
          color: "bg-[#0077B6]",
        },
        {
          time: "10.00",
          duration: "1.5 jam",
          title: "Snorkeling Pantai Trikora",
          category: "Wisata",
          cost: "Rp50.000 - Rp100.000",
          tip: "Gunakan pelampung dan ikuti arahan pemandu lokal.",
          location: "Area Pantai Trikora, Kepulauan Riau",
          description:
            "Menjelajahi keindahan bawah laut dengan melihat terumbu karang dan ikan warna-warni.",
          color: "bg-green-500",
        },
        {
          time: "13.00",
          duration: "1 jam",
          title: "Makan Siang Seafood Lokal",
          category: "Kuliner",
          cost: "Rp40.000 - Rp80.000",
          tip: "Pilih menu ikan bakar, gonggong, atau otak-otak khas Kepri.",
          location: "Warung lokal sekitar Pantai Trikora",
          description:
            "Istirahat sambil menikmati kuliner laut khas Kepulauan Riau.",
          color: "bg-orange-400",
        },
      ],
    },
    {
      title: "Budaya Melayu & Pulau Penyengat",
      subtitle: "Menjelajahi sejarah dan budaya Melayu Kepulauan Riau.",
      items: [
        {
          time: "08.30",
          duration: "2 jam",
          title: "Masjid Raya Sultan Riau Penyengat",
          category: "Wisata Religi",
          cost: "Rp20.000 - Rp40.000",
          tip: "Gunakan pakaian sopan dan siapkan uang kecil untuk transport lokal.",
          location: "Pulau Penyengat, Tanjung Pinang",
          description:
            "Mengunjungi masjid bersejarah yang menjadi ikon budaya dan religi Melayu Riau.",
          color: "bg-purple-500",
        },
        {
          time: "11.00",
          duration: "2 jam",
          title: "Keliling Pulau Penyengat",
          category: "Wisata Budaya",
          cost: "Rp30.000 - Rp60.000",
          tip: "Sewa becak motor lokal agar perjalanan lebih mudah dan hemat waktu.",
          location: "Pulau Penyengat, Kepulauan Riau",
          description:
            "Menjelajahi peninggalan sejarah kerajaan Melayu dan suasana pulau yang tenang.",
          color: "bg-pink-500",
        },
        {
          time: "15.00",
          duration: "1.5 jam",
          title: "Gedung Gonggong",
          category: "Ikon Kota",
          cost: "Gratis",
          tip: "Datang sore hari untuk foto dengan cahaya yang lebih bagus.",
          location: "Tepi Laut Tanjung Pinang",
          description:
            "Berfoto di ikon kota Tanjung Pinang dengan bentuk bangunan yang unik.",
          color: "bg-[#0077B6]",
        },
      ],
    },
    {
      title: "Ikon Kota & Kuliner",
      subtitle: "Menikmati pusat kota dan kuliner khas Tanjung Pinang.",
      items: [
        {
          time: "08.00",
          duration: "1 jam",
          title: "Sarapan Mie Lendir",
          category: "Kuliner",
          cost: "Rp20.000 - Rp35.000",
          tip: "Datang pagi agar pilihan menu masih lengkap.",
          location: "Pusat Kota Tanjung Pinang",
          description:
            "Mencoba sarapan khas Tanjung Pinang dengan cita rasa lokal.",
          color: "bg-orange-400",
        },
        {
          time: "10.00",
          duration: "1.5 jam",
          title: "Patung Seribu",
          category: "Wisata Budaya",
          cost: "Rp10.000 - Rp25.000",
          tip: "Gunakan alas kaki nyaman karena area cukup luas untuk berjalan.",
          location: "Tanjung Pinang, Kepulauan Riau",
          description:
            "Melihat kawasan wisata budaya dengan banyak patung dan ornamen unik.",
          color: "bg-pink-500",
        },
        {
          time: "16.00",
          duration: "1 jam",
          title: "Tugu Pesawat Simpang Bandara",
          category: "Ikon Kota",
          cost: "Gratis",
          tip: "Cocok dikunjungi sore hari agar tidak terlalu panas.",
          location: "Simpang Bandara, Tanjung Pinang",
          description:
            "Mengunjungi salah satu ikon kota yang mudah dijangkau.",
          color: "bg-[#0077B6]",
        },
      ],
    },
    {
      title: "Oleh-oleh & Penutup Trip",
      subtitle: "Hari terakhir untuk santai, belanja, dan persiapan pulang.",
      items: [
        {
          time: "09.00",
          duration: "1.5 jam",
          title: "Belanja Oleh-oleh Khas Tanjung Pinang",
          category: "Belanja",
          cost: "Rp50.000 - Rp200.000",
          tip: "Cari otak-otak, kerupuk ikan, atau makanan khas lokal.",
          location: "Pusat Oleh-oleh Tanjung Pinang",
          description:
            "Membeli buah tangan khas Kepulauan Riau sebelum pulang.",
          color: "bg-yellow-500",
        },
        {
          time: "12.00",
          duration: "1 jam",
          title: "Makan Siang Menu Melayu",
          category: "Kuliner",
          cost: "Rp50.000 - Rp100.000",
          tip: "Coba menu lokal sebelum meninggalkan Tanjung Pinang.",
          location: "Rumah Makan Melayu Tanjung Pinang",
          description:
            "Menutup perjalanan dengan kuliner Melayu khas daerah setempat.",
          color: "bg-orange-400",
        },
        {
          time: "15.00",
          duration: "1 jam",
          title: "Persiapan Pulang",
          category: "Transportasi",
          cost: "Sesuai tujuan",
          tip: "Pastikan tiba lebih awal di bandara atau pelabuhan.",
          location: "Bandara atau Pelabuhan Tanjung Pinang",
          description:
            "Mengatur waktu perjalanan pulang agar lebih aman dan nyaman.",
          color: "bg-gray-500",
        },
      ],
    },
  ];

  return {
    title: `Itinerary Tanjung Pinang ${selections[STEPS.DURATION]}`,
    duration: selections[STEPS.DURATION],
    category: selections[STEPS.CATEGORY],
    budget: selections[STEPS.BUDGET],
    traveler: selections[STEPS.TRAVELER],
    totalBudget: formatRupiah(budgetPerDay * totalDays),
    days: dayTemplates.slice(0, totalDays),
  };
}

function getLocalAIReply(question) {
  const lower = question.toLowerCase();

  if (lower.includes("kuliner") || lower.includes("makan")) {
    return "Untuk kuliner khas Tanjung Pinang, kamu bisa coba Mie Lendir, Gonggong, Otak-otak, seafood tepi laut, dan makanan Melayu lokal. 🍜";
  }

  if (lower.includes("pantai") || lower.includes("alam")) {
    return "Untuk wisata alam, Pantai Trikora cocok untuk perjalanan santai. Berangkat pagi agar tidak terlalu panas. 🌊";
  }

  if (lower.includes("penyengat") || lower.includes("religi")) {
    return "Pulau Penyengat dan Masjid Raya Sultan Riau Penyengat cocok untuk wisata religi dan budaya. Gunakan pakaian sopan dan datang pagi agar nyaman. 🕌";
  }

  if (lower.includes("budget") || lower.includes("biaya")) {
    return "Untuk budget hemat, siapkan sekitar Rp150.000–Rp250.000 per hari. Untuk comfort sekitar Rp300.000–Rp500.000 per hari. 💰";
  }

  return "Bisa! Untuk perjalanan di Tanjung Pinang, saya sarankan susun rute berdasarkan lokasi agar lebih hemat waktu. 🗺️";
}

function ItineraryResult({ data, onSave }) {
  if (!data) return null;

  return (
    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="bg-[#0077B6] px-4 py-3">
        <p className="text-white text-sm font-bold leading-snug">
          🗺️ {data.title}
        </p>
        <p className="text-white/80 text-[11px] mt-1 leading-relaxed">
          {data.category} • {data.budget} • {data.traveler}
        </p>
      </div>

      <div className="p-4 space-y-5">
        {data.days.map((day, dayIndex) => (
          <div key={dayIndex}>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-cyan-50 text-[#0077B6] flex items-center justify-center text-xs font-bold flex-shrink-0">
                {dayIndex + 1}
              </div>

              <div>
                <p className="text-sm font-bold text-gray-800">
                  Hari {dayIndex + 1} — {day.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                  {day.subtitle}
                </p>
              </div>
            </div>

            <div className="relative pl-4 ml-4 space-y-4">
              <div className="absolute left-[6px] top-1 bottom-1 w-px bg-gray-200" />

              {day.items.map((item, index) => (
                <div key={index} className="relative pl-5">
                  <span
                    className={`absolute left-0 top-1.5 w-3 h-3 rounded-full ${item.color} ring-4 ring-white`}
                  />

                  <div className="bg-gray-50 rounded-xl px-3 py-3 border border-gray-100">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-[11px] font-bold text-[#0077B6]">
                        {item.time}
                      </p>

                      <span className="text-[10px] bg-white text-gray-500 px-2 py-0.5 rounded-full border border-gray-100">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                      {item.title}
                    </p>

                    <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
                      Estimasi biaya:{" "}
                      <span className="font-semibold text-gray-700">
                        {item.cost}
                      </span>
                    </p>

                    <div className="mt-2 rounded-lg bg-yellow-50 border border-yellow-100 px-2 py-1.5">
                      <p className="text-[10px] text-yellow-700 leading-relaxed">
                        💡 {item.tip}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-2xl bg-cyan-50 border border-cyan-100 px-4 py-3">
          <p className="text-xs font-bold text-gray-700">
            Estimasi Total Budget
          </p>
          <p className="text-lg font-bold text-[#0077B6] mt-1">
            {data.totalBudget}
          </p>
          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Estimasi dapat berubah tergantung transportasi, pilihan makan, dan
            tiket masuk destinasi.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSave?.(data)}
          className="w-full bg-[#0077B6] text-white text-xs font-semibold py-3 rounded-xl hover:bg-cyan-600 transition-colors"
        >
          Simpan Itinerary ke Profil
        </button>
      </div>
    </div>
  );
}

function HistoryItineraryDetail({ item, onClose }) {
  const data = item?.itinerary || item;

  const duration =
    data?.duration || item?.selections?.[STEPS.DURATION] || "1 Hari";

  const budget =
    data?.budget || item?.selections?.[STEPS.BUDGET] || "Hemat";

  const traveler =
    data?.traveler || item?.selections?.[STEPS.TRAVELER] || "Solo Traveler";

  const totalPlaces = getTotalPlaces(data);
  const budgetRange = getBudgetRange(budget);

  const openMaps = (placeName) => {
    const query = encodeURIComponent(
      `${placeName} Tanjung Pinang Kepulauan Riau`
    );

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const openRoute = (placeName) => {
    const query = encodeURIComponent(
      `${placeName} Tanjung Pinang Kepulauan Riau`
    );

    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${query}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const downloadItinerary = () => {
    const text = data.days
      .map((day, dayIndex) => {
        const items = day.items
          .map(
            (dest) =>
              `- ${dest.time} | ${dest.title}\n  Kategori: ${dest.category}\n  Biaya: ${dest.cost}\n  Tips: ${dest.tip}`
          )
          .join("\n\n");

        return `Hari ${dayIndex + 1} - ${day.title}\n${items}`;
      })
      .join("\n\n");

    const content = `${data.title}\n${duration} - ${totalPlaces} tempat\nBudget: ${budgetRange}\n\n${text}`;

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `itinerary-tanjung-pinang-${duration}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  if (!data?.days) {
    return (
      <div className="h-full flex items-center justify-center bg-white">
        <p className="text-sm text-gray-500">Data itinerary tidak tersedia.</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col overflow-hidden">
      <div className="bg-[#0077B6] px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                stroke="white"
                strokeWidth="2"
                fill="none"
              />
              <circle cx="12" cy="9" r="3" stroke="white" strokeWidth="2" />
            </svg>
          </div>

          <div>
            <p className="text-white text-sm font-bold leading-none">
              Detail Destinasi
            </p>
            <p className="text-white/75 text-[11px] mt-1">
              Itinerary Tanjung Pinang {duration} - {totalPlaces} tempat
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadItinerary}
            className="h-8 px-3 rounded-full bg-white/20 text-white text-[11px] font-semibold flex items-center gap-1 hover:bg-white/30 transition-colors"
          >
            ⬇ Unduh
          </button>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center gap-4 text-[11px] text-gray-600">
        <span>📅 {duration}</span>
        <span>💰 {getShortBudget(budget)}</span>
        <span>🚶 {getShortTraveler(traveler)}</span>
        <span className="ml-auto font-bold text-[#0077B6]">
          {budgetRange}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {data.days.map((day, dayIndex) => (
          <div key={dayIndex}>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#0077B6] text-white text-[10px] font-bold flex items-center justify-center">
                {dayIndex + 1}
              </span>

              <p className="text-xs font-bold text-gray-700 flex-1">
                Hari {dayIndex + 1} — {day.title}
              </p>

              <span className="text-[10px] text-gray-400">
                {day.items?.[0]?.category}
              </span>
            </div>

            <div className="px-4 py-4 space-y-5">
              {day.items.map((dest, index) => (
                <div key={index} className="relative">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-50 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="[#0077B6]"
                        strokeWidth="2"
                      >
                        <path d="M3 7h4l2-3h6l2 3h4v13H3V7z" />
                        <circle cx="12" cy="13" r="3" />
                      </svg>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-gray-800 leading-tight">
                          {dest.title}
                        </p>

                        <span className="text-[9px] font-bold text-[#0077B6] bg-cyan-50 px-2 py-0.5 rounded-full">
                          {dest.category}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-1 text-[11px] text-gray-400">
                        <span>☀️ {dest.time}</span>
                        <span>⏱️ {dest.duration}</span>
                      </div>

                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {dest.description}
                      </p>

                      <div className="mt-3 rounded-xl bg-yellow-50 border border-yellow-100 px-3 py-2">
                        <p className="text-[11px] text-yellow-700 leading-relaxed">
                          💡 Tips: {dest.tip}
                        </p>
                      </div>

                      <p className="text-[11px] text-gray-400 mt-3">
                        📍 {dest.location}
                      </p>

                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => openRoute(dest.title)}
                          className="px-4 py-2 rounded-full bg-[#0077B6] text-white text-[11px] font-semibold hover:bg-cyan-600 transition-colors"
                        >
                          ➤ Rute ke Sini
                        </button>

                        <button
                          onClick={() => openMaps(dest.title)}
                          className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-[11px] font-semibold hover:bg-gray-200 transition-colors"
                        >
                          ⧉ Lihat di Maps
                        </button>
                      </div>
                    </div>
                  </div>

                  {index < day.items.length - 1 && (
                    <div className="ml-11 mt-5 h-px bg-gray-100" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AIChatGuide() {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [step, setStep] = useState(STEPS.DURATION);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Halo! 👋 Saya **Pinang AI Planner** — siap membuatkan rencana perjalanan Tanjung Pinang yang sempurna untukmu. Aku akan bantu buatkan itinerary lengkap hari per hari. Siap mulai? 🗺️",
    },
    {
      role: "assistant",
      content: "Berapa hari kamu akan berada di Tanjung Pinang?",
      options: durasiOptions,
      optionType: STEPS.DURATION,
    },
  ]);

  const [selections, setSelections] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [history, setHistory] = useState(() => {
    return JSON.parse(localStorage.getItem("itineraryHistory") || "[]");
  });

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const addMessage = (role, content, extra = {}) => {
    setMessages((prev) => [...prev, { role, content, ...extra }]);
  };

  const saveHistory = (newHistory) => {
    setHistory(newHistory);
    localStorage.setItem("itineraryHistory", JSON.stringify(newHistory));
  };

  const handleSaveItinerary = (itineraryData) => {
    const saved = JSON.parse(localStorage.getItem("savedItinerary") || "[]");

    const updated = [
      ...saved,
      {
        id: Date.now(),
        ...itineraryData,
      },
    ];

    localStorage.setItem("savedItinerary", JSON.stringify(updated));
    alert("Itinerary berhasil disimpan ke profil!");
  };

  const handleOption = (option, optionType) => {
    addMessage("user", option);

    const newSelections = {
      ...selections,
      [optionType]: option,
    };

    setSelections(newSelections);

    if (optionType === STEPS.DURATION) {
      setTimeout(() => {
        addMessage(
          "assistant",
          `Oke, ${option} di Tanjung Pinang! 🎯 Sekarang, apa fokus wisata yang kamu inginkan?`,
          {
            options: kategoriOptions,
            optionType: STEPS.CATEGORY,
          }
        );

        setStep(STEPS.CATEGORY);
      }, 400);
    } else if (optionType === STEPS.CATEGORY) {
      setTimeout(() => {
        addMessage(
          "assistant",
          "Pilihan yang keren! 😊 Bagaimana dengan budget perjalananmu?",
          {
            options: budgetOptions,
            optionType: STEPS.BUDGET,
          }
        );

        setStep(STEPS.BUDGET);
      }, 400);
    } else if (optionType === STEPS.BUDGET) {
      setTimeout(() => {
        addMessage("assistant", "Siap! Terakhir, kamu pergi bersama siapa?", {
          options: travelerOptions,
          optionType: STEPS.TRAVELER,
        });

        setStep(STEPS.TRAVELER);
      }, 400);
    } else if (optionType === STEPS.TRAVELER) {
      setStep(STEPS.CHAT);
      setLoading(true);

      addMessage(
        "assistant",
        `Siap! Saya sedang menyusun itinerary ${newSelections[STEPS.DURATION]} untuk ${option}. ✈️`
      );

      setTimeout(() => {
        const finalSelections = {
          ...newSelections,
          [STEPS.TRAVELER]: option,
        };

        const itineraryData = buildItineraryData(finalSelections);

        setLoading(false);

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "",
            isItinerary: true,
            itinerary: itineraryData,
          },
        ]);

        const newHistory = [
          ...history,
          {
            id: Date.now(),
            title: itineraryData.title,
            selections: finalSelections,
            itinerary: itineraryData,
            preview: `${itineraryData.days.length} hari perjalanan • Estimasi budget ${itineraryData.totalBudget}`,
          },
        ];

        saveHistory(newHistory);
      }, 900);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();

    setInput("");
    addMessage("user", userMsg);
    setLoading(true);

    try {
      const res = await post("/chat", { message: userMsg });
      const json = await res.json();
      setLoading(false);
      if (json.success) {
        addMessage("assistant", json.data.reply);
      } else {
        addMessage("assistant", getLocalAIReply(userMsg));
      }
    } catch {
      setLoading(false);
      addMessage("assistant", getLocalAIReply(userMsg));
    }
  };

  const resetChat = () => {
    setStep(STEPS.DURATION);
    setSelections({});
    setActiveTab("chat");
    setSelectedHistory(null);

    setMessages([
      {
        role: "assistant",
        content:
          "Halo! 👋 Saya **Pinang AI Planner** — siap membuatkan rencana perjalanan Tanjung Pinang yang sempurna untukmu. Siap mulai? 🗺️",
      },
      {
        role: "assistant",
        content: "Berapa hari kamu akan berada di Tanjung Pinang?",
        options: durasiOptions,
        optionType: STEPS.DURATION,
      },
    ]);
  };

  const openHistoryItem = (item) => {
    setSelectedHistory(item);
  };

  const formatText = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br/>");
  };

  return (
    <>
      <button
        onClick={() => (isLoggedIn() ? setIsOpen(true) : navigate("/login"))}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50 w-[82px] h-[82px] md:w-[112px] md:h-[112px] rounded-full bg-[#0090D1] flex items-center justify-center shadow-2xl hover:bg-[#0077B6] hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Buka Pinang AI Planner"
      >
        <svg
          className="w-9 h-9 md:w-12 md:h-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5A8.48 8.48 0 0 1 21 11v.5z" />
        </svg>

        <span className="absolute -top-1 -right-1 w-[48px] h-[22px] md:w-[58px] md:h-[24px] rounded-full bg-[#ff3131] flex items-center justify-center shadow-md">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
            <path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
            <path d="M5 14l.6 1.6L7 16l-1.4.4L5 18l-.6-1.6L3 16l1.4-.4L5 14z" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 md:p-6">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-[390px] h-[620px] max-h-[88vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            {activeTab === "riwayat" && selectedHistory ? (
              <HistoryItineraryDetail
                item={selectedHistory}
                onClose={() => setSelectedHistory(null)}
              />
            ) : (
              <>
                <div className="bg-[#0077B6] px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                          stroke="white"
                          strokeWidth="2"
                          fill="none"
                        />
                        <circle
                          cx="12"
                          cy="9"
                          r="3"
                          stroke="white"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>

                    <div>
                      <p className="text-white text-sm font-semibold leading-none">
                        Pinang AI Planner
                      </p>
                      <p className="text-white/70 text-xs mt-0.5">
                        Siap buatkan itinerary terbaik
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={resetChat}
                      className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                    >
                      ↻
                    </button>

                    <button
                      onClick={() => setIsOpen(false)}
                      className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors text-white"
                    >
                      ×
                    </button>
                  </div>
                </div>

                <div className="flex border-b border-gray-100 bg-white">
                  <button
                    onClick={() => {
                      setActiveTab("chat");
                      setSelectedHistory(null);
                    }}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors ${
                      activeTab === "chat"
                        ? "text-[#0077B6] border-b-2 border-[#0077B6]"
                        : "text-gray-400"
                    }`}
                  >
                    💬 Chat
                  </button>

                  <button
                    onClick={() => {
                      setActiveTab("riwayat");
                      setSelectedHistory(null);
                    }}
                    className={`flex-1 py-2.5 text-xs font-medium transition-colors relative ${
                      activeTab === "riwayat"
                        ? "text-[#0077B6] border-b-2 border-[#0077B6]"
                        : "text-gray-400"
                    }`}
                  >
                    📋 Riwayat

                    {history.length > 0 && (
                      <span className="absolute top-1.5 right-8 min-w-4 h-4 px-1 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center">
                        {history.length}
                      </span>
                    )}
                  </button>
                </div>

                {activeTab === "chat" && (
                  <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                      {messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${
                            msg.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={
                              msg.isItinerary
                                ? "max-w-full w-full"
                                : "max-w-[85%]"
                            }
                          >
                            {msg.role === "assistant" && (
                              <div
                                className={`flex items-start gap-2 ${
                                  msg.isItinerary ? "w-full" : ""
                                }`}
                              >
                                {!msg.isItinerary && (
                                  <div className="w-6 h-6 rounded-full bg-[#0077B6] flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <svg
                                      width="10"
                                      height="10"
                                      viewBox="0 0 24 24"
                                      fill="none"
                                    >
                                      <path
                                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                                        stroke="white"
                                        strokeWidth="2.5"
                                        fill="none"
                                      />
                                    </svg>
                                  </div>
                                )}

                                <div
                                  className={msg.isItinerary ? "w-full" : ""}
                                >
                                  {msg.isItinerary ? (
                                    <ItineraryResult
                                      data={msg.itinerary}
                                      onSave={handleSaveItinerary}
                                    />
                                  ) : (
                                    <div
                                      className="bg-white text-gray-700 text-xs leading-relaxed px-3 py-2 rounded-2xl rounded-tl-none shadow-sm"
                                      dangerouslySetInnerHTML={{
                                        __html: formatText(msg.content),
                                      }}
                                    />
                                  )}

                                  {!msg.isItinerary && msg.options && (
                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                      {msg.options.map((opt) => (
                                        <button
                                          key={opt}
                                          onClick={() =>
                                            handleOption(opt, msg.optionType)
                                          }
                                          disabled={step !== msg.optionType}
                                          className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                                            step !== msg.optionType
                                              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                              : "bg-white text-[#0077B6] border-[#0077B6] hover:bg-cyan-50"
                                          }`}
                                        >
                                          {opt}
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {msg.role === "user" && (
                              <div className="bg-[#0077B6] text-white text-xs px-3 py-2 rounded-2xl rounded-tr-none">
                                {msg.content}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {loading && (
                        <div className="flex justify-start">
                          <div className="bg-white px-3 py-2 rounded-2xl rounded-tl-none shadow-sm flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-t border-gray-100 bg-white">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-full px-3 py-2">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handleSend()
                          }
                          placeholder="Tanya tentang Tanjung Pinang..."
                          className="flex-1 text-xs outline-none bg-transparent text-gray-700 placeholder-gray-400"
                        />

                        <button
                          onClick={handleSend}
                          disabled={!input.trim() || loading}
                          className="w-7 h-7 bg-[#0077B6] rounded-full flex items-center justify-center disabled:opacity-40 hover:bg-cyan-600 transition-colors flex-shrink-0"
                        >
                          ➤
                        </button>
                      </div>

                      <p className="text-center text-gray-400 text-[10px] mt-1.5">
                        Powered by Pinang AI · Berwisata cerdas bersama Tanjung
                        Pinang
                      </p>
                    </div>
                  </>
                )}

                {activeTab === "riwayat" && (
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    {history.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-12 h-12 rounded-full bg-cyan-50 flex items-center justify-center mb-3">
                          💬
                        </div>

                        <p className="text-sm text-gray-500">
                          Belum ada riwayat itinerary
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Buat itinerary pertamamu!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-xs text-gray-400">
                          {history.length} itinerary tersimpan
                        </p>

                        {history.map((h) => (
                          <button
                            key={h.id}
                            onClick={() => openHistoryItem(h)}
                            className="w-full text-left bg-white rounded-xl p-3 border border-gray-100 shadow-sm hover:border-[#0077B6]/40 hover:bg-cyan-50/30 transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2 mb-1.5">
                              <p className="text-xs font-semibold text-gray-800 leading-relaxed">
                                {h.title}
                              </p>

                              <span className="text-[10px] text-[#0077B6] bg-cyan-50 px-2 py-0.5 rounded-full flex-shrink-0">
                                {h.selections?.[STEPS.DURATION]}
                              </span>
                            </div>

                            <p className="text-xs text-gray-500 leading-relaxed">
                              {h.preview}
                            </p>

                            <div className="flex gap-1.5 mt-2 flex-wrap">
                              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                {h.selections?.[STEPS.CATEGORY]}
                              </span>

                              <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                {h.selections?.[STEPS.BUDGET]}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}