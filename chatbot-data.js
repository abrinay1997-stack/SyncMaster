// Base de datos de modelos de speakers (Combinada y Optimizada)
const SPEAKER_DATABASE = {
    // --- L-Acoustics ---
    "k1": { brand: "L-Acoustics", name: "K1", spl: 149, weight: 106, impedance: 8, dispersion: 5, category: "Line Array Large" },
    "k2": { brand: "L-Acoustics", name: "K2", spl: 147, weight: 56, impedance: 8, dispersion: 10, category: "Line Array Large" },
    "k3": { brand: "L-Acoustics", name: "K3", spl: 143, weight: 43, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "kara": { brand: "L-Acoustics", name: "Kara II", spl: 142, weight: 26, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "kiva": { brand: "L-Acoustics", name: "Kiva II", spl: 138, weight: 14, impedance: 16, dispersion: 15, category: "Line Array Medium" },
    "ks28": { brand: "L-Acoustics", name: "KS28", spl: 145, weight: 79, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "sb28": { brand: "L-Acoustics", name: "SB28", spl: 142, weight: 93, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "x15": { brand: "L-Acoustics", name: "X15 HiQ", spl: 138, weight: 21, impedance: 8, dispersion: 40, category: "Monitor" },
    "x12": { brand: "L-Acoustics", name: "X12", spl: 136, weight: 20, impedance: 8, dispersion: 60, category: "Monitor" },
    "kara-side": { brand: "L-Acoustics", name: "Kara II (Side)", spl: 142, weight: 26, impedance: 8, dispersion: 10, category: "Monitor" },

    // --- Meyer Sound ---
    "panther": { brand: "Meyer Sound", name: "Panther", spl: 150, weight: 68, impedance: 8, dispersion: 7, category: "Line Array Large" },
    "leo": { brand: "Meyer Sound", name: "LEO-M", spl: 146, weight: 120, impedance: 8, dispersion: 5, category: "Line Array Large" },
    "lyon": { brand: "Meyer Sound", name: "Lyon-M", spl: 144, weight: 90, impedance: 8, dispersion: 9, category: "Line Array Large" },
    "leopard": { brand: "Meyer Sound", name: "Leopard", spl: 139, weight: 34, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "lina": { brand: "Meyer Sound", name: "LINA", spl: 138, weight: 19, impedance: 8, dispersion: 15, category: "Line Array Medium" },
    "1100-lfc": { brand: "Meyer Sound", name: "1100-LFC", spl: 140, weight: 113, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "900-lfc": { brand: "Meyer Sound", name: "900-LFC", spl: 136, weight: 61, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "750-lfc": { brand: "Meyer Sound", name: "750-LFC", spl: 135, weight: 47, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "mjf-212a": { brand: "Meyer Sound", name: "MJF-212A", spl: 139, weight: 48, impedance: 8, dispersion: 50, category: "Monitor" },
    "mjf-210": { brand: "Meyer Sound", name: "MJF-210", spl: 136, weight: 30, impedance: 8, dispersion: 50, category: "Monitor" },
    "um-1p": { brand: "Meyer Sound", name: "UM-1P", spl: 133, weight: 21, impedance: 8, dispersion: 45, category: "Monitor" },

    // --- d&b audiotechnik ---
    "gsl8": { brand: "d&b audiotechnik", name: "GSL8", spl: 150, weight: 80, impedance: 8, dispersion: 7, category: "Line Array Large" },
    "ksl8": { brand: "d&b audiotechnik", name: "KSL8", spl: 145, weight: 58, impedance: 8, dispersion: 7, category: "Line Array Large" },
    "j8": { brand: "d&b audiotechnik", name: "J8", spl: 145, weight: 60, impedance: 8, dispersion: 7, category: "Line Array Large" },
    "v8": { brand: "d&b audiotechnik", name: "V8", spl: 142, weight: 34, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "y8": { brand: "d&b audiotechnik", name: "Y8", spl: 139, weight: 20, impedance: 8, dispersion: 14, category: "Line Array Medium" },
    "sl-sub": { brand: "d&b audiotechnik", name: "SL-SUB", spl: 144, weight: 138, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "j-sub": { brand: "d&b audiotechnik", name: "J-SUB", spl: 139, weight: 64, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "m2": { brand: "d&b audiotechnik", name: "M2", spl: 143, weight: 38, impedance: 8, dispersion: 45, category: "Monitor" },
    "m4": { brand: "d&b audiotechnik", name: "M4", spl: 138, weight: 20, impedance: 8, dispersion: 50, category: "Monitor" },
    "max2": { brand: "d&b audiotechnik", name: "MAX2", spl: 135, weight: 23, impedance: 8, dispersion: 75, category: "Monitor" },

    // --- JBL Professional ---
    "vtx-a12": { brand: "JBL Professional", name: "VTX A12", spl: 146, weight: 61, impedance: 8, dispersion: 10, category: "Line Array Large" },
    "vtx-v25": { brand: "JBL Professional", name: "VTX V25", spl: 147, weight: 88, impedance: 8, dispersion: 10, category: "Line Array Large" },
    "vtx-a8": { brand: "JBL Professional", name: "VTX A8", spl: 139, weight: 29, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "vrx932la": { brand: "JBL Professional", name: "VRX932LA-1", spl: 130, weight: 21, impedance: 8, dispersion: 15, category: "Line Array Medium" },
    "srx910la": { brand: "JBL Professional", name: "SRX910LA", spl: 137, weight: 27, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "vtx-b28": { brand: "JBL Professional", name: "VTX B28", spl: 141, weight: 87, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "vtx-g28": { brand: "JBL Professional", name: "VTX G28", spl: 142, weight: 93, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "srx928s": { brand: "JBL Professional", name: "SRX928S", spl: 140, weight: 70, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "vtx-m22": { brand: "JBL Professional", name: "VTX M22", spl: 138, weight: 27, impedance: 8, dispersion: 60, category: "Monitor" },
    "vtx-m20": { brand: "JBL Professional", name: "VTX M20", spl: 136, weight: 23, impedance: 8, dispersion: 60, category: "Monitor" },
    "srx812p": { brand: "JBL Professional", name: "SRX812P", spl: 136, weight: 26, impedance: 8, dispersion: 60, category: "Monitor" },

    // --- Adamson ---
    "e15": { brand: "Adamson", name: "E15", spl: 147, weight: 80, impedance: 8, dispersion: 6, category: "Line Array Large" },
    "e12": { brand: "Adamson", name: "E12", spl: 145, weight: 60, impedance: 8, dispersion: 8, category: "Line Array Large" },
    "s10": { brand: "Adamson", name: "S10", spl: 141, weight: 27, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "cs10": { brand: "Adamson", name: "CS10", spl: 141, weight: 31, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "e219": { brand: "Adamson", name: "E219", spl: 144, weight: 106, impedance: 4, dispersion: 0, category: "Subwoofer" },

    // --- RCF ---
    "hdl-50": { brand: "RCF", name: "HDL 50-A 4K", spl: 143, weight: 58, impedance: 8, dispersion: 10, category: "Line Array Large" },
    "hdl-30": { brand: "RCF", name: "HDL 30-A", spl: 137, weight: 25, impedance: 8, dispersion: 15, category: "Line Array Medium" },
    "hdl-20": { brand: "RCF", name: "HDL 20-A", spl: 135, weight: 30, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "hdl-6a": { brand: "RCF", name: "HDL 6-A", spl: 131, weight: 11, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "sub-9006": { brand: "RCF", name: "SUB 9006-AS", spl: 142, weight: 86, impedance: 8, dispersion: 0, category: "Subwoofer" },
    "sub-8006": { brand: "RCF", name: "SUB 8006-AS", spl: 137, weight: 90, impedance: 8, dispersion: 0, category: "Subwoofer" },
    "tt-25-cxa": { brand: "RCF", name: "TT 25-CXA", spl: 133, weight: 18, impedance: 8, dispersion: 60, category: "Monitor" },
    "nx-12-sma": { brand: "RCF", name: "NX 12-SMA", spl: 129, weight: 16, impedance: 8, dispersion: 60, category: "Monitor" },

    // --- Electro-Voice (EV) ---
    "x1-212": { brand: "Electro-Voice (EV)", name: "X1-212/90", spl: 143, weight: 42, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "x2-212": { brand: "Electro-Voice (EV)", name: "X2-212/90", spl: 146, weight: 42, impedance: 8, dispersion: 10, category: "Line Array Large" },
    "x12-128": { brand: "Electro-Voice (EV)", name: "X12-128", spl: 145, weight: 88, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "etx-35p": { brand: "Electro-Voice (EV)", name: "ETX-35P", spl: 136, weight: 38, impedance: 8, dispersion: 40, category: "Point Source" },
    "etx-18sp": { brand: "Electro-Voice (EV)", name: "ETX-18SP", spl: 135, weight: 51, impedance: 8, dispersion: 0, category: "Subwoofer" },
    "pxm-12mp": { brand: "Electro-Voice (EV)", name: "PXM-12MP", spl: 129, weight: 13, impedance: 8, dispersion: 90, category: "Monitor" },

    // --- Audio Center ---
    "avanda-212a": { brand: "Audio Center", name: "AVANDA 212A", spl: 142, weight: 67, impedance: 8, dispersion: 7, category: "Line Array Large" },
    "k-la212-dsp": { brand: "Audio Center", name: "K-LA212-DSP", spl: 139, weight: 55, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "k-la210-dsp": { brand: "Audio Center", name: "K-LA210-DSP", spl: 135, weight: 36, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "artis-t45": { brand: "Audio Center", name: "Artis T45-DSP", spl: 136, weight: 12, impedance: 8, dispersion: 20, category: "Line Array Medium" },
    "k-la218-dsp": { brand: "Audio Center", name: "K-LA218-DSP", spl: 140, weight: 101, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "t115s-dsp": { brand: "Audio Center", name: "T115S-DSP", spl: 136, weight: 35, impedance: 4, dispersion: 0, category: "Subwoofer" },

    // --- FBT ---
    "horizon-vha-406a": { brand: "FBT", name: "Horizon VHA 406A", spl: 133, weight: 29, impedance: 8, dispersion: 20, category: "Line Array Medium" },
    "muse-210la": { brand: "FBT", name: "MUSE 210LA", spl: 135, weight: 37, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "mitus-206l": { brand: "FBT", name: "Mitus 206L", spl: 133, weight: 14, impedance: 16, dispersion: 10, category: "Line Array Medium" },
    "muse-218sa": { brand: "FBT", name: "MUSE 218SA", spl: 149, weight: 99, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "vertus-cs-1000": { brand: "FBT", name: "Vertus CS 1000", spl: 129, weight: 31, impedance: 8, dispersion: 30, category: "Line Array Medium" },

    // --- BassBoss ---
    "dv12-mk3": { brand: "BassBoss", name: "DV12-MK3", spl: 138, weight: 28, impedance: 8, dispersion: 40, category: "Point Source" },
    "at212": { brand: "BassBoss", name: "AT212", spl: 142, weight: 39, impedance: 8, dispersion: 50, category: "Point Source" },
    "zv28-mk3": { brand: "BassBoss", name: "ZV28-MK3", spl: 146, weight: 102, impedance: 8, dispersion: 0, category: "Subwoofer" },
    "ssp218-mk3": { brand: "BassBoss", name: "SSP218-MK3", spl: 142, weight: 90, impedance: 8, dispersion: 0, category: "Subwoofer" },

    // --- Yamaha ---
    "dzr12": { brand: "Yamaha", name: "DZR12", spl: 139, weight: 21, impedance: 8, dispersion: 60, category: "Point Source" },
    "dzr15": { brand: "Yamaha", name: "DZR15", spl: 139, weight: 25, impedance: 8, dispersion: 50, category: "Point Source" },
    "dzr315": { brand: "Yamaha", name: "DZR315", spl: 143, weight: 41, impedance: 8, dispersion: 50, category: "Point Source" },
    "dxs18xlf": { brand: "Yamaha", name: "DXS18XLF", spl: 136, weight: 48, impedance: 8, dispersion: 0, category: "Subwoofer" },
    "chr12m": { brand: "Yamaha", name: "CHR12M", spl: 123, weight: 16, impedance: 8, dispersion: 90, category: "Monitor" },
    "dhr12m": { brand: "Yamaha", name: "DHR12M", spl: 129, weight: 18, impedance: 8, dispersion: 90, category: "Monitor" },

    // --- Bose Professional ---
    "showmatch-sm5": { brand: "Bose Professional", name: "ShowMatch SM5", spl: 145, weight: 29, impedance: 8, dispersion: 5, category: "Line Array Large" },
    "f1-812": { brand: "Bose Professional", name: "F1 Model 812", spl: 132, weight: 20, impedance: 8, dispersion: 40, category: "Point Source" },
    "l1-pro32": { brand: "Bose Professional", name: "L1 Pro32", spl: 128, weight: 13, impedance: 8, dispersion: 0, category: "Line Array Medium" },
    "sms118": { brand: "Bose Professional", name: "SMS118", spl: 137, weight: 47, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "f1-sub": { brand: "Bose Professional", name: "F1 Subwoofer", spl: 130, weight: 25, impedance: 8, dispersion: 0, category: "Subwoofer" },

    // --- DAS Audio ---
    "lara": { brand: "DAS Audio", name: "LARA", spl: 146, weight: 89, impedance: 8, dispersion: 8, category: "Line Array Large" },
    "aero-40a": { brand: "DAS Audio", name: "AERO-40A", spl: 138, weight: 68, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "event-210a": { brand: "DAS Audio", name: "EVENT-210A", spl: 134, weight: 34, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "ux-218a": { brand: "DAS Audio", name: "UX-218A", spl: 143, weight: 92, impedance: 8, dispersion: 0, category: "Subwoofer" },

    // --- Mackie ---
    "drm12a": { brand: "Mackie", name: "DRM12A", spl: 135, weight: 25, impedance: 8, dispersion: 20, category: "Line Array Medium" },
    "srm215": { brand: "Mackie", name: "SRM215 V-Class", spl: 136, weight: 22, impedance: 8, dispersion: 60, category: "Point Source" },
    "thump215": { brand: "Mackie", name: "Thump215", spl: 129, weight: 15, impedance: 8, dispersion: 60, category: "Point Source" },
    "drm18s": { brand: "Mackie", name: "DRM18S", spl: 135, weight: 40, impedance: 8, dispersion: 0, category: "Subwoofer" },

    // --- LD Systems ---
    "maui-44-g2": { brand: "LD Systems", name: "MAUI 44 G2", spl: 132, weight: 47, impedance: 8, dispersion: 20, category: "Line Array Medium" },
    "stinger-g3-12": { brand: "LD Systems", name: "STINGER G3 12", spl: 131, weight: 20, impedance: 8, dispersion: 50, category: "Point Source" },

    // --- Alto Professional ---
    "ts415": { brand: "Alto Professional", name: "TS415", spl: 135, weight: 17, impedance: 8, dispersion: 50, category: "Point Source" },
    "ts412": { brand: "Alto Professional", name: "TS412", spl: 132, weight: 15, impedance: 8, dispersion: 50, category: "Point Source" },
    "ts318s": { brand: "Alto Professional", name: "TS318S", spl: 133, weight: 39, impedance: 8, dispersion: 0, category: "Subwoofer" },

    // --- Peavey ---
    "versarray-112": { brand: "Peavey", name: "Versarray 112", spl: 132, weight: 25, impedance: 8, dispersion: 15, category: "Line Array Medium" },
    "sp-2": { brand: "Peavey", name: "SP 2", spl: 131, weight: 34, impedance: 8, dispersion: 40, category: "Point Source" },
    "sp-218-sub": { brand: "Peavey", name: "SP 218 Sub", spl: 141, weight: 66, impedance: 4, dispersion: 0, category: "Subwoofer" },

    // --- Soundbarrier ---
    "core-82p": { brand: "Soundbarrier", name: "Core 82P", spl: 136, weight: 26, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "sbla210": { brand: "Soundbarrier", name: "SBLA210", spl: 137, weight: 28, impedance: 8, dispersion: 8, category: "Line Array Medium" },
    "core-102a": { brand: "Soundbarrier", name: "Core 102A", spl: 136, weight: 36, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "core-8218sa": { brand: "Soundbarrier", name: "Core 8218SA", spl: 131, weight: 61, impedance: 4, dispersion: 0, category: "Subwoofer" },

    // --- Gemini ---
    "wrx-843-col": { brand: "Gemini", name: "WRX-843 (Column)", spl: 126, weight: 11, impedance: 8, dispersion: 40, category: "Line Array Medium" },
    "wrx-843-sub": { brand: "Gemini", name: "WRX-843 (Sub)", spl: 126, weight: 13, impedance: 4, dispersion: 0, category: "Subwoofer" },
    "gd-l115bt": { brand: "Gemini", name: "GD-L115BT", spl: 120, weight: 18, impedance: 8, dispersion: 60, category: "Point Source" },

    // --- K-array ---
    "mugello-kh2": { brand: "K-array", name: "Mugello-KH2", spl: 136, weight: 29, impedance: 8, dispersion: 20, category: "Line Array Medium" },
    "kr802": { brand: "K-array", name: "KR802", spl: 138, weight: 25, impedance: 8, dispersion: 10, category: "Line Array Medium" },

    // --- Crest Audio ---
    "versarray-212": { brand: "Crest Audio", name: "Versarray 212", spl: 138, weight: 38, impedance: 8, dispersion: 15, category: "Line Array Medium" },

    // --- Soundking ---
    "g210a": { brand: "Soundking", name: "G210A", spl: 136, weight: 32, impedance: 8, dispersion: 10, category: "Line Array Medium" },
    "l10": { brand: "Soundking", name: "L10", spl: 131, weight: 18, impedance: 8, dispersion: 45, category: "Point Source" },

    // --- Steren Pro ---
    "baf-1595": { brand: "Steren Pro", name: "BAF-1595", spl: 125, weight: 21, impedance: 8, dispersion: 60, category: "Point Source" },

    // --- Behringer ---
    "b115d": { brand: "Behringer", name: "B115D", spl: 126, weight: 17, impedance: 8, dispersion: 50, category: "Point Source" },
    "b1800xp": { brand: "Behringer", name: "B1800XP", spl: 129, weight: 35, impedance: 8, dispersion: 0, category: "Subwoofer" },

    // --- Clair Brothers ---
    "12am": { brand: "Clair Brothers", name: "12AM", spl: 138, weight: 32, impedance: 8, dispersion: 40, category: "Monitor" }
};

// Función de búsqueda de modelos
function findSpeakerModel(query) {
    const normalized = query.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

    // Búsqueda exacta
    if (SPEAKER_DATABASE[normalized]) {
        return SPEAKER_DATABASE[normalized];
    }

    // Búsqueda parcial
    for (const [key, model] of Object.entries(SPEAKER_DATABASE)) {
        if (key.includes(normalized) || normalized.includes(key)) {
            return model;
        }
        if (model.name.toLowerCase().includes(query.toLowerCase())) {
            return model;
        }
    }

    return null;
}

// Calculadora de bandwidth Dante
function calculateDanteBandwidth(channels, sampleRate = 48) {
    const mbpsPerChannel = sampleRate === 96 ? 2.3 : 1.15;
    const overhead = 1.2; // 20%
    const totalMbps = channels * mbpsPerChannel * overhead;

    return {
        channels: channels,
        sampleRate: sampleRate,
        mbpsPerChannel: mbpsPerChannel,
        overhead: 20,
        totalMbps: Math.round(totalMbps * 100) / 100,
        recommendation: totalMbps < 100 ? "Switch Gigabit (1000 Mbps) suficiente" : "Necesitas múltiples switches o 10Gb"
    };
}

// Calculadora de delay por temperatura
function calculateDelayByTemp(distanceMeters, tempCelsius) {
    const speedOfSound = 331.3 + (0.606 * tempCelsius);
    const delayMs = (distanceMeters / speedOfSound) * 1000;

    return {
        distance: distanceMeters,
        temperature: tempCelsius,
        speedOfSound: Math.round(speedOfSound * 10) / 10,
        delayMs: Math.round(delayMs * 10) / 10
    };
}
