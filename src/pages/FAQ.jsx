import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Berapa biaya untuk mengikuti program magang?",
      answer: "Biaya bervariasi tergantung program. Silakan hubungi admin kami untuk rincian lengkap. Kami juga menyediakan opsi pembayaran bertahap."
    },
    {
      question: "Apakah harus bisa bahasa Jepang sebelum mendaftar?",
      answer: "Tidak wajib. Kami menyediakan pelatihan bahasa dari nol sampai tingkat yang dibutuhkan (N4/N3)."
    },
    {
      question: "Berapa lama proses pelatihan sampai berangkat?",
      answer: "Rata-rata 4-6 bulan untuk pelatihan bahasa dan proses dokumen."
    },
    {
      question: "Apakah ada batasan usia?",
      answer: "Untuk program magang umumnya 18-30 tahun. Untuk Tokutei Ginou bisa lebih fleksibel."
    },
    {
      question: "Bagaimana jika gagal wawancara dengan perusahaan Jepang?",
      answer: "Anda akan diberikan kesempatan untuk mengikuti wawancara dengan perusahaan lain tanpa biaya tambahan."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">Pertanyaan Umum</h1>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden">
            <button
              className="w-full px-6 py-4 text-left flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors focus:outline-none"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              <span className="font-semibold text-gray-800">{faq.question}</span>
              {openIndex === index ? <ChevronUp className="text-blue-600" /> : <ChevronDown className="text-gray-400" />}
            </button>
            {openIndex === index && (
              <div className="px-6 py-4 border-t border-gray-100 text-gray-600 leading-relaxed bg-white">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
