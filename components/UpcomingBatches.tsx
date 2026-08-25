'use client';

const PinIcon = ({ color = "#1a2b4a" }: { color?: string }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.8" />
        <circle cx="12" cy="9" r="2.5" fill={color} />
    </svg>
);

interface BatchInfo {
    date: string;
    month: string;
    city: string;
    color: string;
    textColor: string;
    pinColor: string;
}

function DualBatchCard({ date, month, city, color, textColor, pinColor }: BatchInfo) {
    return (
        <div style={{
            display: "flex", alignItems: "center", gap: 12,
            background: color, borderRadius: 14, padding: "14px 20px",
            minWidth: 150, flex: 1
        }}>
            <div>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: textColor, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1 }}>{date}</p>
                <p style={{ margin: "1px 0 0", fontSize: 13, fontWeight: 600, color: textColor, fontFamily: "'DM Sans', sans-serif", opacity: 0.85 }}>{month}</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <PinIcon color={pinColor} />
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: textColor, fontFamily: "'DM Sans', sans-serif", opacity: 0.9 }}>{city}</p>
            </div>
        </div>
    );
}

function SquareBatchCard({ date, month, city, color, textColor, pinColor }: BatchInfo) {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
            textAlign: "center", gap: 8,
            background: color, borderRadius: 18, padding: "20px",
            aspectRatio: "1/1", width: "100%", maxWidth: "220px", margin: "0 auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
        }}>
            <PinIcon color={pinColor} />
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: textColor, fontFamily: "'DM Sans', sans-serif" }}>{city}</p>
            <div style={{ marginTop: 4 }}>
                <p style={{ margin: 0, fontSize: 26, fontWeight: 900, color: textColor, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.1 }}>{date}</p>
                <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: textColor, fontFamily: "'DM Sans', sans-serif", opacity: 0.85 }}>{month}</p>
            </div>
        </div>
    );
}

export type BatchLocation = 'noida' | 'gurgaon' | 'bangalore';

interface Props {
    locations: BatchLocation[];
}

const BATCH_DATA: Record<BatchLocation, { city: string, color: string, textColor: string, pinColor: string }> = {
    noida: {
        city: 'Noida (Sector 2)',
        color: '#d4f5e9', // Teal
        textColor: '#1a3d2b',
        pinColor: '#2e7d5e'
    },
    gurgaon: {
        city: 'Gurgaon',
        color: '#fef5c8', // Yellow
        textColor: '#3d3010',
        pinColor: '#9a7c0a'
    },
    bangalore: {
        city: 'Bangalore',
        color: '#fef5c8', // Yellow
        textColor: '#3d3010',
        pinColor: '#9a7c0a'
    }
};

const getEnvDate = (loc: BatchLocation): string => {
    switch (loc) {
        case 'noida': return process.env.NEXT_PUBLIC_BATCH_NOIDA || '';
        case 'gurgaon': return process.env.NEXT_PUBLIC_BATCH_GURGAON || '';
        case 'bangalore': return process.env.NEXT_PUBLIC_BATCH_BANGALORE || '';
        default: return '';
    }
};

const parseBatchDate = (str: string) => {
    const trimmed = str.trim();
    if (!trimmed) return { date: 'TBD', month: '' };

    const MONTHS: Record<string, number> = {
        jan: 0, january: 0,
        feb: 1, february: 1,
        mar: 2, march: 2,
        apr: 3, april: 3,
        may: 4,
        jun: 5, june: 5,
        jul: 6, july: 6,
        aug: 7, august: 7,
        sep: 8, sept: 8, september: 8,
        oct: 9, october: 9,
        nov: 10, november: 10,
        dec: 11, december: 11,
    };

    let dayNum: number | null = null;
    let dayStr = '';
    let monthStr = '';
    let yearNum: number | null = null;

    // Pattern 1: "07 Sept 2026", "07 Sept", "7th September"
    const p1 = trimmed.match(/^(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]+)(?:\s+(\d{4}))?$/);
    if (p1) {
        dayNum = parseInt(p1[1], 10);
        dayStr = p1[1];
        monthStr = p1[2];
        if (p1[3]) yearNum = parseInt(p1[3], 10);
    } else {
        // Pattern 2: "Sept 07 2026", "Sept 07", "September 7th"
        const p2 = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2})(?:st|nd|rd|th)?(?:\s+(\d{4}))?$/);
        if (p2) {
            dayNum = parseInt(p2[2], 10);
            dayStr = p2[2];
            monthStr = p2[1];
            if (p2[3]) yearNum = parseInt(p2[3], 10);
        }
    }

    if (dayNum !== null && monthStr) {
        const mKey = monthStr.toLowerCase();
        const monthIndex = MONTHS[mKey];
        if (monthIndex !== undefined) {
            const currentYear = new Date().getFullYear();
            const year = yearNum || currentYear;
            const batchDate = new Date(year, monthIndex, dayNum, 23, 59, 59);
            // If date is in the past, return TBD
            if (batchDate.getTime() < Date.now()) {
                return { date: 'TBD', month: '' };
            }
            return { date: dayStr, month: monthStr };
        }
    }

    return { date: trimmed, month: '' };
};

export default function UpcomingBatches({ locations }: Props) {
    const isSingle = locations.length === 1;

    const cards = locations.map(loc => {
        const config = BATCH_DATA[loc];
        const dateStr = getEnvDate(loc);
        const { date, month } = parseBatchDate(dateStr);

        return {
            ...config,
            date,
            month
        };
    });

    return (
        <div style={{ padding: "0" }}>
            <p style={{ 
                margin: "0 0 16px", fontSize: 11, fontWeight: 700, 
                letterSpacing: "0.15em", textTransform: "uppercase", 
                color: "#6b7a96", textAlign: "center", opacity: 0.8 
            }}>Upcoming Batches</p>
            
            <div className={isSingle ? "flex justify-center" : "grid grid-cols-2 lg:flex lg:flex-col gap-4 justify-center"}>
                {cards.map((data, idx) => (
                    isSingle ? (
                        <SquareBatchCard key={idx} {...data} />
                    ) : (
                        <DualBatchCard key={idx} {...data} />
                    )
                ))}
            </div>
        </div>
    );
}
