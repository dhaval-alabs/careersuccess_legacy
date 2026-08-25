"use client";

import { COURSE_FACTS } from "../constants/courseFacts";

const navy = "#09263F";
const teal = "#29E8A4";
const blue = "#239bf5";

interface FeeTableProps {
  courseType?: 'data-science' | 'data-analytics' | 'ds' | 'da';
  onOpenDemo?: () => void;
}

export default function FeeTable({ courseType = 'data-science', onOpenDemo }: FeeTableProps) {
  const normalizedKey = courseType === 'da' || courseType === 'data-analytics' ? 'data-analytics' : 'data-science';
  const facts = COURSE_FACTS[normalizedKey];
  const feeRows = facts.fees;

  return (
    <section id="fees" className="py-20 px-4 sm:px-6 bg-[#f0faf8]">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-[#e8f4fd] text-[12px] font-bold uppercase tracking-[0.1em] px-[18px] py-[5px] rounded-full border border-[#b8ddf7] mb-4">
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">
              TRANSPARENT COURSE FEES
            </span>
          </span>
          <h2
            className="font-extrabold leading-tight tracking-tight mb-3"
            style={{ fontFamily: "var(--font-outfit)", fontSize: "clamp(2rem,4vw,3rem)", color: navy }}
          >
            Three Ways to Learn.<br />
            <span className="bg-gradient-to-r from-[#19dfaf] to-[#07b2e8] bg-clip-text text-transparent">
              All Inclusive Pricing.
            </span>
          </h2>
          <p className="text-sm max-w-lg mx-auto" style={{ color: "#4A6275" }}>
            Pick the mode that fits your schedule. Same syllabus, same mentors, and recognized certification across all tracks. All fees are inclusive of taxes.
          </p>
        </div>

        {/* Consolidated Fee Table */}
        <div className="bg-white rounded-2xl border border-[#D6ECEB] shadow-[0_4px_24px_rgba(9,38,63,0.06)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#09263F] text-white">
                  <th className="py-4 px-5 text-sm font-bold tracking-wide">Mode</th>
                  <th className="py-4 px-5 text-sm font-bold tracking-wide">
                    NASSCOM FutureSkills Prime
                  </th>
                  <th className="py-4 px-5 text-sm font-bold tracking-wide">
                    TIH at IIT Bombay / Patna
                  </th>
                  <th className="py-4 px-5 text-sm font-bold tracking-wide hidden sm:table-cell">Duration</th>
                  <th className="py-4 px-5 text-sm font-bold tracking-wide">EMI / Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6F0F7] text-sm">
                {feeRows.map((row, idx) => (
                  <tr
                    key={row.mode}
                    className={`transition-colors ${
                      row.featured ? "bg-[#F0FDF9]/80 font-medium" : "hover:bg-[#F9FCFC]"
                    }`}
                  >
                    <td className="py-5 px-5 font-bold text-[#09263F]">
                      <div className="flex items-center gap-2">
                        {row.mode}
                        {row.featured && (
                          <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#1DE5B5]/20 text-[#09263F] px-2 py-0.5 rounded-md">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-normal text-[#4A6275] mt-1 sm:hidden">
                        {row.duration}
                      </p>
                    </td>
                    <td className="py-5 px-5 font-extrabold text-[#00AEEF] text-base">
                      {row.nasscomPrice}
                    </td>
                    <td className="py-5 px-5 font-extrabold text-[#09263F] text-base">
                      {row.tihPrice}
                    </td>
                    <td className="py-5 px-5 text-[#4A6275] hidden sm:table-cell">
                      {row.duration}
                    </td>
                    <td className="py-5 px-5 text-[#4A6275] text-xs leading-relaxed">
                      {row.emi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sub-table note */}
          <div className="p-4 sm:px-6 bg-[#F8FCFC] border-t border-[#E6F0F7] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#4A6275]">
            <p className="font-medium text-[#09263F]">
              ℹ️ {facts.tihNote}
            </p>
            <p className="text-[#6B7A96]">
              All figures inclusive of taxes. 0% interest EMI options available.
            </p>
          </div>
        </div>

        {/* Demo Button */}
        {onOpenDemo && (
          <div className="text-center mt-8">
            <button
              onClick={onOpenDemo}
              className="bg-[#1DE5B5] hover:bg-[#19cf9e] text-[#09263F] font-bold px-8 py-4 rounded-xl text-base transition-all shadow-[0_8px_30px_rgba(29,229,181,0.3)] inline-block active:scale-95"
            >
              Signup for a Free Demo →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
