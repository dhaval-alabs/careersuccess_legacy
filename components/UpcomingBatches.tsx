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
            background: color, borderRadius: 14, padding: "16px 22px",
            minWidth: 150, flex: 1
        }}>
            <div>
                <p style={{ margin: 0, fontSize: 32, fontWeight: 900, color: textColor, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>{date}</p>
                <p style={{ margin: "2px 0 0", fontSize: 14, fontWeight: 600, color: textColor, fontFamily: "'DM Sans', sans-serif", opacity: 0.85 }}>{month}</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <PinIcon color={pinColor} />
                <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: textColor, fontFamily: "'DM Sans', sans-serif", opacity: 0.9 }}>{city}</p>
            </div>
        </div>
    );
}

function SquareBatchCard({ date, month, city, color, textColor, pinColor }: BatchInfo) {
    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", 
            textAlign: "center", gap: 8,
            background: color, borderRadius: 18, padding: "24px",
            aspectRatio: "1/1", width: "100%", maxWidth: "240px", margin: "0 auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.04)"
        }}>
            <PinIcon color={pinColor} />
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: textColor, fontFamily: "'DM Sans', sans-serif" }}>{city}</p>
            <div style={{ marginTop: 4 }}>
                <p style={{ margin: 0, fontSize: 34, fontWeight: 900, color: textColor, fontFamily: "'DM Sans', sans-serif", lineHeight: 1 }}>{date}</p>
                <p style={{ margin: "2px 0 0", fontSize: 16, fontWeight: 600, color: textColor, fontFamily: "'DM Sans', sans-serif", opacity: 0.85 }}>{month}</p>
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
        city: 'Noida',
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
    
    // Pattern 1: "16 Aug" or "16th August"
    const p1 = trimmed.match(/^(\d{1,2}(?:st|nd|rd|th)?)\s+([A-Za-z]+)$/);
    if (p1) return { date: p1[1], month: p1[2] };
    
    // Pattern 2: "Aug 16" or "August 16th"
    const p2 = trimmed.match(/^([A-Za-z]+)\s+(\d{1,2}(?:st|nd|rd|th)?)$/);
    if (p2) return { date: p2[2], month: p2[1] };
    
    // Fallback: Use string as date
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
