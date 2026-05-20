"use client";
import React from "react";
import { Eye } from "lucide-react";

export function SampleTrackingTable({ samples, onViewDetails }) {
  return (
    <div className="bg-card border border-border rounded-[5px] shadow-none overflow-hidden transition-colors w-full">
      {/* Table scroll wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/10 border-b border-border text-[12px] font-bold text-muted-foreground/80">
              <th className="px-[20px] py-[15px] font-bold tracking-normal whitespace-nowrap">
                Patient
              </th>
              <th className="px-[20px] py-[15px] font-bold tracking-normal whitespace-nowrap">
                Tests Ordered
              </th>
              <th className="px-[20px] py-[15px] font-bold tracking-normal whitespace-nowrap">
                Status
              </th>
              <th className="px-[20px] py-[15px] font-bold tracking-normal whitespace-nowrap">
                Current Location
              </th>
              <th className="px-[20px] py-[15px] font-bold tracking-normal whitespace-nowrap">
                Time Elapsed
              </th>
              <th className="px-[20px] py-[15px] font-bold tracking-normal text-center whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-[13px]">
            {samples.length > 0 ? (
              samples.map((row) => {
                const isReceived = row.status === "Received";
                const isProcessing = row.status === "Processing";

                return (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/5 transition-colors duration-150"
                  >
                    {/* Column 1: Patient Details */}
                    <td className="px-[20px] py-[15px] font-bold text-foreground whitespace-nowrap">
                      {row.patientName}{" "}
                      <span className="text-muted-foreground font-semibold">
                        ({row.uhid})
                      </span>
                    </td>

                    {/* Column 2: Tests Ordered */}
                    <td className="px-[20px] py-[15px] text-foreground font-bold whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {row.testList.slice(0, 2).map((test, idx) => (
                          <span
                            key={idx}
                            className="bg-secondary text-secondary-foreground font-bold text-[11px] px-2.5 py-0.5 rounded-[5px] border border-border"
                          >
                            {test}
                          </span>
                        ))}
                        {row.testList.length > 2 && (
                          <span className="text-muted-foreground font-semibold text-[11px] ml-1 select-none">
                            + {row.testList.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Column 3: Status badge matching UI screenshot */}
                    <td className="px-[20px] py-[15px] whitespace-nowrap">
                      {isReceived && (
                        <span className="inline-flex items-center rounded-[5px] bg-[#E8EAF6] dark:bg-[#1A237E]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#3F51B5] dark:text-[#9FA8DA] border border-[#C5CAE9] dark:border-[#303F9F]">
                          Received
                        </span>
                      )}
                      {isProcessing && (
                        <span className="inline-flex items-center rounded-[5px] bg-[#E0F2F1] dark:bg-[#004D40]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#00796B] dark:text-[#4DB6AC] border border-[#B2DFDB] dark:border-[#00796B]">
                          Processing
                        </span>
                      )}
                    </td>

                    {/* Column 4: Location */}
                    <td className="px-[20px] py-[15px] text-muted-foreground font-bold whitespace-nowrap">
                      {row.location}
                    </td>

                    {/* Column 5: Time Elapsed */}
                    <td className="px-[20px] py-[15px] text-muted-foreground font-bold whitespace-nowrap">
                      {row.timeElapsed}
                    </td>

                    {/* Column 6: Action eye icon button */}
                    <td className="px-[20px] py-[15px] text-center whitespace-nowrap">
                      <button
                        onClick={() => onViewDetails(row)}
                        className="p-1.5 border border-border bg-card rounded-[5px] text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer transition-colors shadow-none outline-none inline-flex items-center justify-center"
                        title="View Details"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-[20px] py-[40px] text-center text-muted-foreground font-semibold"
                >
                  No sample tracking records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
