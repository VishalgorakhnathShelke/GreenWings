import type { Product } from '../types'

export const pulsesProducts: Product[] = [
  {
    id: 'tur',
    name: 'Tur / Arhar / Pigeon Pea',
    slug: 'tur',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/tur/tur_1.jpg',
    overview:
      'Tur, commonly known as arhar or pigeon pea, is one of the most widely cultivated pulse crops across India. As a staple source of plant-based protein for millions of households, it plays an indispensable role in the daily Indian diet, forming the base of beloved dishes such as dal tadka and sambar. India is the largest producer and consumer of pigeon pea globally, with the crop thriving in diverse agro-climatic zones.\n\nThe crop offers exceptional nitrogen-fixing capabilities, making it a preferred choice for sustainable crop rotation and intercropping systems. Its deep root system improves soil health and fertility, benefitting subsequent cereal and oilseed crops. Tur is predominantly grown as a kharif crop, with major sowing coinciding with the monsoon season across central and southern India.\n\nIndia\'s tur production meets a significant portion of global demand, and the grain is increasingly positioned as an export-ready commodity. Premium graded tur dal with consistent quality standards is sought after in international markets, particularly in South Asia, the Middle East, and Africa, where Indian vegetarian cuisine continues to gain popularity.',
    keyBenefits: [
      'Rich source of high-quality plant protein (20–22% by weight)',
      'Excellent nitrogen-fixing ability enhances soil fertility naturally',
      'Drought-tolerant and resilient to marginal growing conditions',
      'Supports sustainable intercropping and crop rotation practices',
      'Long shelf life in whole and split dhal form',
      'High dietary fiber content supports digestive health',
    ],
    growingRegions: [
      'Maharashtra',
      'Karnataka',
      'Madhya Pradesh',
      'Uttar Pradesh',
      'Gujarat',
    ],
    harvestSeason: 'October to January (Kharif / post-monsoon)',
    exportAvailability:
      'Widely exported as whole grain, split dhal, and value-added flour to South Asian, Middle Eastern, and African markets year-round with peak shipments during November–March.',
    storageInfo:
      'Store whole tur in cool, dry conditions at 12–14°C with relative humidity below 60%. Split tur dal should be kept in airtight packaging to prevent moisture absorption and insect infestation. Under proper conditions, whole grain maintains quality for 12–18 months.',
    nutritionalHighlights: [
      'Protein: 20–22 g per 100 g',
      'Dietary fiber: 12–15 g per 100 g',
      'Rich in folate (vitamin B9) and iron',
      'Low glycemic index supports blood sugar management',
      'Good source of potassium, magnesium, and zinc',
      'Contains beneficial polyphenols and antioxidants',
    ],
    marketApplications: [
      'Primary ingredient in traditional Indian dal preparations',
      'Base for packaged ready-to-eat and instant dal mixes',
      'Protein enrichment in snack foods and extruded products',
      'Ingredient in animal feed formulations',
      'Flour base for gluten-free and high-protein food products',
      'Sprouting and microgreen production for health foods',
    ],
    varieties: [
      {
        name: 'Pusa Ageti',
        slug: 'pusa-ageti',
        imagePlaceholder: '/assets/placeholders/tur-pusa-ageti.png',
        overview:
          'Pusa Ageti is an early-maturing pigeon pea variety developed by IARI, New Delhi, designed for regions with shorter growing seasons. It matures in approximately 120–130 days, making it suitable for early harvest before the onset of winter. This variety has gained popularity among farmers seeking a quick turnaround without compromising on yield.\n\nThe variety exhibits strong resistance to fusarium wilt and sterility mosaic disease, two of the most damaging pigeon pea pathogens. Its erect plant architecture facilitates mechanical harvesting and intercropping with cereals, making it a practical choice for commercial-scale operations.\n\nPusa Ageti produces bold, uniform golden-yellow grains that command a premium in domestic and export markets. The dal quality is excellent, with a smooth texture and rich flavor profile ideal for premium dal preparations.',
        characteristics: {
          color: 'Golden-yellow',
          shape: 'Oval to round',
          averageSize: '6–7 mm diameter',
          taste: 'Mild, nutty with smooth mouthfeel',
          aroma: 'Subtle earthy aroma when cooked',
          storage: '12–18 months whole, 8–12 months split',
        },
        applications: [
          'Premium dhal for household consumption',
          'Ready-to-eat dal meal products',
          'Intercropping partner with cotton and soybean',
        ],
        shelfLife: '18 months (whole grain)',
        exportSuitability:
          'High — uniform grain size and bold appearance meet stringent export grading standards for Middle Eastern and African markets.',
      },
      {
        name: 'AKT 8811',
        slug: 'akt-8811',
        imagePlaceholder: '/assets/placeholders/tur-akt-8811.png',
        overview:
          'AKT 8811 is a high-yielding pigeon pea variety developed for peninsular Indian agro-climatic conditions, particularly suited to Karnataka and Maharashtra. It is recognized for its consistent performance under rainfed farming systems and its ability to deliver stable yields even during years with irregular monsoon patterns.\n\nThe variety features a medium-duration maturity cycle of 150–160 days, striking a balance between early and late types. It demonstrates good tolerance to phytophthora blight and pod borer insect pests, reducing the need for intensive chemical interventions. AKT 8811 has been widely adopted in the central Indian pigeon pea belt.\n\nIts grains are medium-bold with a characteristic amber color and excellent cooking quality. The variety is preferred by dhal millers for its high recovery rate during milling, making it economically attractive for the processing industry.',
        characteristics: {
          color: 'Amber-yellow',
          shape: 'Rounded oval',
          averageSize: '5–6 mm diameter',
          taste: 'Rich, earthy dal flavor',
          aroma: 'Pleasant cooked aroma',
          storage: '14–16 months whole, 8–10 months split',
        },
        applications: [
          'Commercial dal milling and processing',
          'Bulk commodity trade for government PDS supplies',
          'Rainfed farming systems in Deccan plateau',
        ],
        shelfLife: '16 months (whole grain)',
        exportSuitability:
          'Moderate to high — good milling recovery and consistent quality make it suitable for bulk export shipments.',
      },
      {
        name: 'TS 3R',
        slug: 'ts-3r',
        imagePlaceholder: '/assets/placeholders/tur-ts-3r.png',
        overview:
          'TS 3R is a wilt-resistant pigeon pea variety specifically bred for Telangana and Andhra Pradesh growing conditions. As the name suggests, it carries triple resistance to major wilt pathogens that commonly affect pigeon pea in the southern Indian states. This disease resistance package has made it a cornerstone variety for sustainable pulse cultivation in the region.\n\nThe plant has a semi-spreading growth habit with vigorous vegetative growth, producing a dense canopy that effectively suppresses weeds. TS 3R matures in approximately 145–155 days and produces pods with 3–4 bold seeds each. It has shown consistent performance across multiple soil types including red sandy loams and black cotton soils.\n\nGrains from TS 3R are bold and attractive with a deep golden hue. The variety is favored in South Indian cuisine, particularly for sambar and rasam preparations where the dal\'s thick texture and ability to hold shape during prolonged cooking are highly valued.',
        characteristics: {
          color: 'Deep golden-yellow',
          shape: 'Bold oval',
          averageSize: '7–8 mm diameter',
          taste: 'Full-bodied, rich flavor ideal for sambar',
          aroma: 'Robust aromatic profile when tempered',
          storage: '12–15 months whole, 8–10 months split',
        },
        applications: [
          'South Indian sambar and rasam preparations',
          'Tempered dal dishes in restaurant and catering use',
          'Wilt-prone zone cultivation in southern India',
        ],
        shelfLife: '15 months (whole grain)',
        exportSuitability:
          'Moderate — well-suited for ethnic South Asian grocery channels and specialty food exporters.',
      },
      {
        name: 'BDN 708',
        slug: 'bdn-708',
        imagePlaceholder: '/assets/placeholders/tur-bdn-708.png',
        overview:
          'BDN 708 is a medium-duration pigeon pea variety developed through collaborative breeding programs in Maharashtra. It has become one of the most extensively cultivated varieties in the Vidarbha and Marathwada regions, where it is prized for its adaptability to semi-arid conditions and its reliable yield performance under limited irrigation.\n\nThe variety matures in 150–165 days and exhibits moderate resistance to pod fly and Helicoverpa armigera. Its deep root system allows it to access moisture from lower soil profiles during dry spells, providing yield stability in drought-prone districts. BDN 708 performs well both as a sole crop and as an intercrop with sorghum or cotton.\n\nGrains are medium-sized with a uniform golden-yellow color and smooth seed coat. The dhal produced from BDN 708 has a characteristic creamy texture and is widely accepted in the central Indian wholesale markets of Mumbai and Nagpur.',
        characteristics: {
          color: 'Golden-yellow',
          shape: 'Oval',
          averageSize: '5–6 mm diameter',
          taste: 'Creamy, mild flavor',
          aroma: 'Mild cooked aroma',
          storage: '14–18 months whole, 9–12 months split',
        },
        applications: [
          'Bulk dal supply for wholesale markets',
          'Intercropping with cotton and sorghum systems',
          'Government procurement programs for food security',
        ],
        shelfLife: '18 months (whole grain)',
        exportSuitability:
          'Moderate — reliable quality suitable for bulk commodity export, particularly to East African markets.',
      },
      {
        name: 'Maruti',
        slug: 'maruti',
        imagePlaceholder: '/assets/placeholders/tur-maruti.png',
        overview:
          'Maruti is a widely adopted pigeon pea variety recognized for its exceptional yield potential and broad adaptability across Indian growing regions. Released for cultivation in multiple states, it has established itself as a farmer-friendly variety due to its robust disease resistance package and manageable agronomic requirements.\n\nThe variety has a medium maturity period of 140–150 days and produces an abundance of pods with 4–5 seeds each. Maruti demonstrates good field resistance to sterility mosaic and moderate resistance to wilt. Its sturdy stem and semi-determinate growth habit make it suitable for both traditional and improved farming practices.\n\nMaruti grains are bold, attractive, and uniform in size with a bright golden-yellow appearance. The variety consistently achieves high dhal recovery rates of 72–75%, making it a preferred choice for commercial dhal millers and export-oriented processing units.',
        characteristics: {
          color: 'Bright golden-yellow',
          shape: 'Bold round',
          averageSize: '6–7 mm diameter',
          taste: 'Smooth, mild with good thickness',
          aroma: 'Light aromatic profile',
          storage: '14–16 months whole, 9–11 months split',
        },
        applications: [
          'Commercial dhal milling with high recovery rates',
          'Export-grade sorted and graded pigeon pea',
          'Multi-region cultivation under diverse conditions',
        ],
        shelfLife: '16 months (whole grain)',
        exportSuitability:
          'High — excellent grain uniformity and milling recovery make it a strong candidate for premium export markets.',
      },
      {
        name: 'Co 6',
        slug: 'co-6',
        imagePlaceholder: '/assets/placeholders/tur-co-6.png',
        overview:
          'Co 6 is a pigeon pea variety developed by Tamil Nadu Agricultural University for the southern Indian farming ecosystem. It is specifically adapted to the tropical conditions of Tamil Nadu, Kerala, and parts of Andhra Pradesh, where it performs exceptionally well in both rainfed and irrigated cultivation systems.\n\nThis medium-duration variety matures in 150–160 days and is noted for its prolific pod-bearing habit and consistent seed filling even under moisture stress. Co 6 shows good tolerance to pod borer and fusarium wilt, which are prevalent in the humid tropical growing environments. Its compatibility with coconut and banana-based intercropping systems makes it popular among smallholder farmers.\n\nThe grains have a distinctive golden-amber coloration and medium-bold size. Co 6 dhal is particularly valued in Kerala and Tamil Nadu cuisine, where it is used in traditional preparations like parippu curry and thoran.',
        characteristics: {
          color: 'Golden-amber',
          shape: 'Medium oval',
          averageSize: '5–6 mm diameter',
          taste: 'Rich, slightly sweet flavor',
          aroma: 'Pleasant tropical aroma when cooked',
          storage: '12–14 months whole, 7–10 months split',
        },
        applications: [
          'Traditional South Indian dal and curry preparations',
          'Intercropping with plantation crops (coconut, banana)',
          'Smallholder farmer cooperatives and local markets',
        ],
        shelfLife: '14 months (whole grain)',
        exportSuitability:
          'Moderate — niche appeal in South Indian diaspora markets and specialty food channels.',
      },
    ],
  },
  {
    id: 'chana',
    name: 'Chana / Chickpea',
    slug: 'chana',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/chana/chana_1.jpg',
    overview:
      'Chana, or chickpea, is India\'s most important pulse crop and the country\'s leading source of plant-based protein. India accounts for approximately 65% of global chickpea production, cultivating both the small, dark-seeded Desi type and the large, light-colored Kabuli type. Chickpea is deeply embedded in Indian food culture, consumed as whole boiled chana, roasted chana snacks, besan (gram flour), and a multitude of regional specialties.\n\nThe crop is predominantly grown as a rabi crop, sown after the monsoon retreat and harvested in early spring. Chickpea\'s nitrogen-fixing ability makes it an ideal rotation crop with wheat, barley, and mustard, contributing to sustainable intensification of cereal-based farming systems. Its relatively low water requirement compared to cereals makes it a climate-smart choice for semi-arid regions.\n\nIndian chickpea is increasingly recognized in international markets as a premium plant-protein ingredient. Kabuli chickpea from India competes directly with Mexican and Australian supplies in global trade, while Desi chickpea is sought after for its distinct nutritional profile and suitability for value-added processing into flour, snack bases, and protein isolates.',
    keyBenefits: [
      'Premier plant-based protein source (18–24% protein content)',
      'Exceptional nitrogen fixation improves soil health for subsequent crops',
      'Low water footprint compared to most protein crops',
      'Rich in complex carbohydrates and resistant starch',
      'Versatile processing into flour, splits, snacks, and protein isolates',
      'High micronutrient density including iron, zinc, and folate',
    ],
    growingRegions: [
      'Madhya Pradesh',
      'Rajasthan',
      'Uttar Pradesh',
      'Maharashtra',
      'Gujarat',
    ],
    harvestSeason: 'February to April (Rabi / spring harvest)',
    exportAvailability:
      'Exported globally as whole Kabuli, Desi splits (chana dal), besan flour, and roasted snacks. Peak export season is April–July following harvest. Major destinations include Middle East, Mediterranean, Southeast Asia, and North America.',
    storageInfo:
      'Chickpea should be stored at 10–12°C with relative humidity below 55% in well-ventilated facilities. Moisture content must be maintained below 12% to prevent fungal growth. Under optimal conditions, whole chickpea remains viable for 18–24 months.',
    nutritionalHighlights: [
      'Protein: 18–24 g per 100 g (variety dependent)',
      'Dietary fiber: 15–20 g per 100 g',
      'Iron: 4–7 mg per 100 g',
      'Excellent source of folate (B9) at 150–200 μg per 100 g',
      'Rich in phosphorus, magnesium, and calcium',
      'Contains isoflavones with antioxidant properties',
    ],
    marketApplications: [
      'Primary ingredient for chana dal and besan flour production',
      'Hummus and Mediterranean dip manufacturing (Kabuli type)',
      'Protein-rich snack manufacturing including roasted chana',
      'Plant-protein isolate and textured protein production',
      'Gluten-free flour for bakery and confectionery',
      'Animal feed ingredient (low-grade and broken grain)',
    ],
    varieties: [
      {
        name: 'Desi (Pusa 362)',
        slug: 'desi-pusa-362',
        imagePlaceholder: '/assets/placeholders/chana-desi-pusa-362.png',
        overview:
          'Pusa 362 is a leading Desi chickpea variety developed by IARI, New Delhi, and is one of the most widely cultivated Desi types across northern and central India. It is specifically bred for high yield, disease resistance, and adaptation to irrigated and rainfed rabi conditions in the Indo-Gangetic plains.\n\nThe variety matures in approximately 110–120 days and produces dark brown to black seeds of small to medium size. Pusa 362 carries strong resistance to fusarium wilt and moderate resistance to ascochyta blight, two diseases that can cause devastating yield losses in chickpea. Its semi-spreading plant type with good pod-bearing ability contributes to its consistently high performance.\n\nPusa 362 is the preferred Desi variety for the dhal milling industry due to its excellent dal recovery rate and uniform split quality. The resulting chana dal has a characteristic rich, nutty flavor and firm texture, making it a staple in North Indian cuisine.',
        characteristics: {
          color: 'Dark brown to black (seed coat)',
          shape: 'Angular to round',
          averageSize: '4–5 mm diameter',
          taste: 'Nutty, earthy flavor with firm texture',
          aroma: 'Distinct roasted aroma when dry-toasted',
          storage: '18–24 months whole, 12–15 months as dal',
        },
        applications: [
          'Premium chana dal for household and restaurant use',
          'Besan flour production for culinary and commercial use',
          'Traditional North Indian curries and dry preparations',
        ],
        shelfLife: '24 months (whole grain)',
        exportSuitability:
          'High — Desi chickpea splits command strong demand in South Asian diaspora markets and as a value-added milling commodity.',
      },
      {
        name: 'Kabuli (Pusa 1083)',
        slug: 'kabuli-pusa-1083',
        imagePlaceholder: '/assets/placeholders/chana-kabuli-pusa-1083.png',
        overview:
          'Pusa 1083 is a premium Kabuli chickpea variety known for its large, cream-colored seeds and excellent culinary quality. Developed by IARI, it represents India\'s capability to produce chickpea that competes with the finest Kabuli types from the Mediterranean and Mexico in global markets.\n\nThis extra-bold seeded variety matures in 130–140 days and produces attractively large seeds with a smooth seed coat and distinctive ram\'s head shape. Pusa 1083 shows good resistance to fusarium wilt and has demonstrated adaptability across irrigated chickpea-growing zones in northern India. The variety requires careful crop management to achieve its full yield potential.\n\nPusa 1083 is the gold standard for export-grade Indian Kabuli chickpea, meeting size specifications of 8 mm and above. Its seeds are ideal for whole kernel applications including hummus, canned chickpeas, and salad garnishes, where visual appearance and bite texture are paramount.',
        characteristics: {
          color: 'Cream-white (seed coat)',
          shape: 'Ram\'s head (large, round with slight peak)',
          averageSize: '8–10 mm diameter',
          taste: 'Mild, buttery with tender texture',
          aroma: 'Very mild, clean aroma',
          storage: '16–20 months whole, 10–14 months processed',
        },
        applications: [
          'Premium hummus and Mediterranean dip manufacturing',
          'Canned and frozen whole chickpea products',
          'Salad bars and gourmet food service applications',
        ],
        shelfLife: '20 months (whole grain)',
        exportSuitability:
          'Very high — meets international Kabuli grading standards, highly competitive in Mediterranean and North American specialty markets.',
      },
      {
        name: 'Pusa 1103',
        slug: 'pusa-1103',
        imagePlaceholder: '/assets/placeholders/chana-pusa-1103.png',
        overview:
          'Pusa 1103 is an early-maturing, high-yielding Kabuli chickpea variety developed for the expanding export market. It is bred to combine the bold seed appearance preferred by international buyers with the agronomic resilience needed for consistent Indian farm production.\n\nThe variety matures in approximately 115–125 days, making it suitable for regions with a shorter rabi season or where early harvest enables timely wheat sowing in relay cropping systems. Pusa 1103 has demonstrated good performance in the Gangetic plains and parts of central India, with strong field resistance to major chickpea diseases.\n\nSeeds are bold and cream-colored with good uniformity and a smooth seed coat finish. The variety is particularly valued for its high proportion of extra-bold seeds (above 8 mm), which fetch premium prices in export markets. Pusa 1103 represents India\'s growing capability in export-oriented pulse breeding.',
        characteristics: {
          color: 'Cream-white',
          shape: 'Round to slightly angular',
          averageSize: '7–9 mm diameter',
          taste: 'Mild, buttery with good firmness',
          aroma: 'Clean, subtle aroma',
          storage: '16–18 months whole, 10–12 months processed',
        },
        applications: [
          'Export-grade whole Kabuli chickpea shipments',
          'Premium canned and pouched chickpea products',
          'Early-harvest relay cropping with wheat',
        ],
        shelfLife: '18 months (whole grain)',
        exportSuitability:
          'Very high — specifically bred for export, meets bold-size specifications and quality standards for international trade.',
      },
      {
        name: 'JG 11',
        slug: 'jg-11',
        imagePlaceholder: '/assets/placeholders/chana-jg-11.png',
        overview:
          'JG 11 is a high-yielding Desi chickpea variety developed by the International Crops Research Institute for the Semi-Arid Tropics (ICRISAT) in collaboration with Indian agricultural universities. It is one of the most successful chickpea varieties released in recent decades, with widespread adoption across central and southern India.\n\nThe variety matures in 95–105 days, making it one of the earliest-maturing Desi types available. This early maturity is a critical advantage in rainfed farming systems where terminal drought stress can severely impact late-maturing varieties. JG 11 carries resistance to fusarium wilt and has demonstrated remarkable yield stability across variable growing conditions.\n\nJG 11 produces medium-sized dark brown seeds with excellent dal quality. Its short duration and reliable performance have made it the variety of choice for millions of smallholder farmers in Madhya Pradesh, Karnataka, and Rajasthan, where it has significantly increased chickpea productivity.',
        characteristics: {
          color: 'Dark brown',
          shape: 'Angular to oval',
          averageSize: '4–5 mm diameter',
          taste: 'Rich, earthy flavor typical of Desi chickpea',
          aroma: 'Pronounced roasted, nutty aroma',
          storage: '18–22 months whole, 12–14 months as dal',
        },
        applications: [
          'High-volume chana dal for domestic markets',
          'Besan production for large-scale food manufacturing',
          'Dryland and rainfed farming systems',
        ],
        shelfLife: '22 months (whole grain)',
        exportSuitability:
          'Moderate — excellent for South Asian ethnic markets and value-added besan flour exports.',
      },
      {
        name: 'Vijay',
        slug: 'vijay',
        imagePlaceholder: '/assets/placeholders/chana-vijay.png',
        overview:
          'Vijay is a well-established Kabuli chickpea variety that has maintained its popularity among Indian farmers and traders for its reliable performance and market acceptance. It represents a balanced profile of agronomic adaptability, seed quality, and economic returns.\n\nThe medium-maturity variety (125–135 days) produces bold, cream-colored seeds with good size uniformity. Vijay demonstrates moderate resistance to wilt and botrytis gray mold, and performs well under both irrigated and limited-rainfall conditions. Its adaptable plant architecture allows for mechanical harvesting in progressive farming operations.\n\nVijay is a versatile market variety, acceptable for both domestic whole-seed consumption and export shipments. Its seeds are widely used in upmarket grocery chains, restaurant supply chains, and food processing units that require consistent quality and appearance.',
        characteristics: {
          color: 'Cream to light beige',
          shape: 'Round to oval',
          averageSize: '7–8 mm diameter',
          taste: 'Mild and creamy with pleasant mouthfeel',
          aroma: 'Light, clean aroma',
          storage: '16–18 months whole, 10–12 months processed',
        },
        applications: [
          'Domestic premium retail and grocery channels',
          'Restaurant and food service whole chickpea supply',
          'Balanced domestic-export market positioning',
        ],
        shelfLife: '18 months (whole grain)',
        exportSuitability:
          'Moderate to high — acceptable for standard export Kabuli specifications with good market versatility.',
      },
    ],
  },
  {
    id: 'moong',
    name: 'Moong / Green Gram',
    slug: 'moong',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/moong/moong_1.jpg',
    overview:
      'Moong, or green gram, is one of India\'s most cherished pulse crops, prized for its easily digestible protein, refreshing flavor, and versatile culinary applications. It occupies a unique position in Indian agriculture as both a kharif and rabi crop, with summer and spring moong cultivation providing an additional income opportunity for farmers beyond the main monsoon season.\n\nThe crop is inherently nitrogen-fixing and has a relatively short duration of 60–75 days, making it an ideal catch crop in multiple cropping systems. Moong is extensively cultivated in rotation with rice, wheat, and sugarcane, contributing to soil health while generating quick returns. Its green pods are also consumed as a fresh vegetable, while the dried grain is used for dal, sprouts, flour, and a wide range of traditional sweets and savory preparations.\n\nIndian moong is increasingly exported as a premium pulse commodity, with whole green moong and yellow moong dal finding markets across Asia, the Middle East, Europe, and North America. The growing global demand for plant-based protein and sprouted foods has positioned moong as a high-value export crop with significant growth potential.',
    keyBenefits: [
      'Easily digestible plant protein ideal for all age groups',
      'Short crop duration (60–75 days) enables multiple harvests per year',
      'Excellent nitrogen fixation enriches soil for subsequent crops',
      'Versatile in culinary use — dal, sprouts, flour, snacks, and sweets',
      'Low anti-nutritional factors compared to other pulses',
      'High demand in domestic and international plant-protein markets',
    ],
    growingRegions: [
      'Rajasthan',
      'Maharashtra',
      'Andhra Pradesh',
      'Uttar Pradesh',
      'Madhya Pradesh',
    ],
    harvestSeason: 'March to May (summer/rabi), September to November (kharif)',
    exportAvailability:
      'Exported year-round as whole green moong, yellow moong dal, flour, and sprouting-grade seed. Peak export season is April–June following the rabi harvest. Key destinations include Southeast Asia, Middle East, USA, UK, and Australia.',
    storageInfo:
      'Store whole moong at 10–12°C with relative humidity below 55%. Moisture content must be below 12% to prevent hardening and insect damage. Split moong dal requires airtight packaging and moisture-proof storage. Optimal shelf life of 12–18 months for whole grain.',
    nutritionalHighlights: [
      'Protein: 24–26 g per 100 g (among the highest in pulses)',
      'Dietary fiber: 16–18 g per 100 g',
      'Excellent source of folate, iron, and vitamin C (in sprouted form)',
      'Low glycemic index suitable for diabetic-friendly diets',
      'Rich in B-complex vitamins including thiamine and riboflavin',
      'Contains bioactive peptides with anti-inflammatory properties',
    ],
    marketApplications: [
      'Whole grain and split dal for household and commercial cooking',
      'Sprouting-grade seeds for health food and microgreen markets',
      'Moong dal flour for traditional sweets and snack manufacturing',
      'Plant-protein isolate for health beverages and supplements',
      'Ready-to-eat and instant moong dal product lines',
      'Fresh green pod vegetable market',
    ],
    varieties: [
      {
        name: 'Pusa Vishal',
        slug: 'pusa-vishal',
        imagePlaceholder: '/assets/placeholders/moong-pusa-vishal.png',
        overview:
          'Pusa Vishal is a high-yielding, bold-seeded moong variety developed by IARI, New Delhi, for summer and spring cultivation in northern India. It represents a significant improvement over older moong varieties in terms of yield potential, disease resistance, and grain quality, and has been rapidly adopted by farmers seeking improved returns from summer moong cultivation.\n\nThe variety matures in 65–70 days and produces bold, shiny green seeds with excellent appearance and uniform size. Pusa Vishal carries resistance to yellow mosaic virus and powdery mildew, two major diseases affecting moong in the Indo-Gangetic plains. Its erect plant type facilitates easy harvesting and reduces harvest losses.\n\nPusa Vishal grains are particularly valued for their bold appearance and high dal recovery rate. The dal produced has a bright yellow color and smooth texture, commanding a premium in both domestic and export markets. It is widely used in premium dal mixes and restaurant-quality preparations.',
        characteristics: {
          color: 'Bright green (whole), yellow (split)',
          shape: 'Bold oval to round',
          averageSize: '3–4 mm diameter',
          taste: 'Mild, slightly sweet with creamy texture',
          aroma: 'Light, fresh aroma when cooked',
          storage: '14–18 months whole, 8–12 months split',
        },
        applications: [
          'Premium yellow moong dal for domestic and export markets',
          'Summer moong cultivation in rice-wheat systems',
          'High-value bold-seed commodity for retail packaging',
        ],
        shelfLife: '18 months (whole grain)',
        exportSuitability:
          'High — bold grain size, uniform color, and high milling recovery meet premium export specifications.',
      },
      {
        name: 'SML 668',
        slug: 'sml-668',
        imagePlaceholder: '/assets/placeholders/moong-sml-668.png',
        overview:
          'SML 668 is a moong variety developed by Sardarkrushinagar Dantiwada Agricultural University in Gujarat, specifically optimized for the state\'s semi-arid growing conditions. It has become the dominant moong variety in Gujarat and is increasingly adopted in neighboring Rajasthan, where its drought tolerance and reliable yield performance are highly valued.\n\nThe variety matures in 60–65 days, making it one of the shortest-duration moong types available. This early maturity is a significant advantage in regions where farmers need to complete their moong harvest before the onset of intense summer heat or to fit multiple crops into an annual rotation. SML 668 shows good resistance to cercospora leaf spot and thrips.\n\nSML 668 produces medium-bold green seeds with good uniformity and attractive luster. The variety is well-suited for both kharif and summer cultivation, providing Gujarat\'s farmers with flexibility in their cropping calendars. Its grains are widely accepted in the wholesale dal markets of Ahmedabad and Mumbai.',
        characteristics: {
          color: 'Green with glossy luster',
          shape: 'Oval',
          averageSize: '3 mm diameter',
          taste: 'Clean, mild flavor with good thickness',
          aroma: 'Subtle green aroma',
          storage: '12–16 months whole, 8–10 months split',
        },
        applications: [
          'Multi-season cultivation in semi-arid Gujarat and Rajasthan',
          'Wholesale dal market supply in western India',
          'Short-duration catch crop in intensive farming systems',
        ],
        shelfLife: '16 months (whole grain)',
        exportSuitability:
          'Moderate to high — reliable quality and attractive grain appearance suitable for standard export grades.',
      },
      {
        name: 'IPM 02-3',
        slug: 'ipm-02-3',
        imagePlaceholder: '/assets/placeholders/moong-ipm-02-3.png',
        overview:
          'IPM 02-3 is a moong variety developed by the Indian Institute of Pulses Research (IIPR), Kanpur, with a focus on integrated pest management compatibility. As the name suggests, the variety is bred to work within IPM frameworks, reducing dependence on chemical pesticides while maintaining high yields and grain quality.\n\nThe variety matures in 65–70 days and exhibits field tolerance to major moong insect pests including pod borer, whitefly, and thrips. Its morphological traits, including dense pubescence on leaves and pods, provide natural deterrence against pest infestation. IPM 02-3 is well-adapted to the irrigated moong-growing zones of Uttar Pradesh, Madhya Pradesh, and Bihar.\n\nGrains are medium-sized with a uniform green color and smooth seed coat. IPM 02-3 has gained recognition among organic farming groups and sustainable agriculture practitioners who value its reduced pesticide requirements. The dal quality is excellent, with a bright yellow color and consistent cooking characteristics.',
        characteristics: {
          color: 'Uniform green',
          shape: 'Round to slightly oval',
          averageSize: '3–3.5 mm diameter',
          taste: 'Mild, clean flavor with smooth texture',
          aroma: 'Gentle cooked aroma',
          storage: '14–16 months whole, 8–10 months split',
        },
        applications: [
          'Organic and sustainable farming systems',
          'IPM-based pulse production programs',
          'North Indian domestic dal market supply',
        ],
        shelfLife: '16 months (whole grain)',
        exportSuitability:
          'Moderate — attractive for organic and sustainably-produced pulse export channels in Europe and North America.',
      },
      {
        name: 'Pusa Ratna',
        slug: 'pusa-ratna',
        imagePlaceholder: '/assets/placeholders/moong-pusa-ratna.png',
        overview:
          'Pusa Ratna is an early-maturing moong variety from IARI specifically developed for rice-fallow cultivation in eastern and southern India. It is designed to utilize the residual soil moisture and fertility left after the kharif rice harvest, providing an additional crop opportunity without competing with the main rice crop for land or resources.\n\nThe variety matures in just 55–60 days, making it one of the quickest-maturing grain legumes available. Pusa Ratna produces a compact plant with good pod-setting ability even under minimal input conditions. It has shown tolerance to waterlogging and moderate resistance to yellow mosaic virus, important traits for post-rice environments.\n\nPusa Ratna produces small to medium green seeds of consistent quality. While the grain size is smaller than some premium varieties, its yield stability and low production cost make it economically attractive. The variety has played a significant role in expanding pulse cultivation in rice-based cropping systems across Bihar, Odisha, and West Bengal.',
        characteristics: {
          color: 'Green (medium shade)',
          shape: 'Round',
          averageSize: '2.5–3 mm diameter',
          taste: 'Standard moong flavor, pleasant and mild',
          aroma: 'Light aromatic profile',
          storage: '12–14 months whole, 7–9 months split',
        },
        applications: [
          'Rice-fallow pulse cultivation systems',
          'Low-input farming for smallholder marginal lands',
          'Kharif and summer season flexibility in eastern India',
        ],
        shelfLife: '14 months (whole grain)',
        exportSuitability:
          'Low to moderate — primarily suited for domestic markets and regional trade rather than premium export channels.',
      },
      {
        name: 'Samrat',
        slug: 'samrat',
        imagePlaceholder: '/assets/placeholders/moong-samrat.png',
        overview:
          'Samrat is a popular moong variety developed through coordinated breeding efforts at the national level, recognized for its balanced combination of yield, quality, and market acceptance. It has become a widely cultivated variety across the moong-growing belt of India, particularly in Rajasthan and Maharashtra where it performs consistently under semi-arid conditions.\n\nThe variety matures in 65–70 days and produces medium-bold, attractive green seeds with good luster and uniform size. Samrat demonstrates moderate resistance to yellow mosaic virus and cercospora leaf spot. Its well-developed root system provides tolerance to short periods of moisture stress, contributing to yield stability in rainfed environments.\n\nSamrat is a market-friendly variety that consistently meets the quality expectations of dal millers and traders. The dal produced from Samrat has a bright yellow color, smooth consistency, and excellent cooking quality. It is widely used in packaged dal products, restaurant supply chains, and government procurement programs.',
        characteristics: {
          color: 'Green with attractive luster',
          shape: 'Oval to round',
          averageSize: '3–3.5 mm diameter',
          taste: 'Mildly sweet, smooth and creamy',
          aroma: 'Pleasant light aroma',
          storage: '14–18 months whole, 8–12 months split',
        },
        applications: [
          'Packaged dal products for retail markets',
          'Government PDS and procurement programs',
          'Reliable multi-region commercial cultivation',
        ],
        shelfLife: '18 months (whole grain)',
        exportSuitability:
          'Moderate to high — consistent quality and broad market acceptance make it suitable for regular export shipments.',
      },
    ],
  },
  {
    id: 'urad',
    name: 'Urad / Black Gram',
    slug: 'urad',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/urad/urad_1.jpg',
    overview:
      'Urad, or black gram, is a highly valued pulse crop in India, revered for its unique nutritional profile and its irreplaceable role in South Indian cuisine. The whole urad grain is black with a white interior, while the split dal is creamy white. Urad is the primary ingredient in iconic preparations such as idli, dosa, medu vada, and dal makhani, making it a cornerstone of India\'s culinary heritage.\n\nIndia is the world\'s largest producer of black gram, with the crop cultivated predominantly as a kharif pulse. Urad is also grown in the rabi and summer seasons in certain regions, providing year-round cultivation opportunities. Its nitrogen-fixing capability makes it an excellent rotation crop with rice, sugarcane, and cotton, while its short crop duration of 75–90 days allows farmers to integrate it into intensive cropping systems.\n\nIndian urad dal holds significant export potential, particularly in markets with substantial South Indian diaspora communities. The growing global interest in fermented foods, where urad batter serves as a key fermentation medium, has further expanded the crop\'s international market prospects.',
    keyBenefits: [
      'Unique protein composition ideal for fermentation-based food products',
      'Rich source of iron, calcium, and phosphorus',
      'Essential ingredient for South Indian fermented food traditions',
      'Short-duration crop enabling multiple cycles per year',
      'Excellent nitrogen fixer enhancing soil fertility',
      'High mucilage content beneficial for digestive health',
    ],
    growingRegions: [
      'Madhya Pradesh',
      'Maharashtra',
      'Uttar Pradesh',
      'Andhra Pradesh',
      'Tamil Nadu',
    ],
    harvestSeason: 'September to November (kharif), February to April (rabi)',
    exportAvailability:
      'Exported year-round as whole urad, split white dal, and flour. Peak export follows kharif harvest (October–January). Major destinations include USA, UK, Canada, Malaysia, Singapore, and the Middle East.',
    storageInfo:
      'Whole urad should be stored at 10–14°C with relative humidity below 60%. Split urad dal is more prone to discoloration and moisture absorption, requiring moisture-proof packaging. Under proper storage, whole urad maintains quality for 12–16 months.',
    nutritionalHighlights: [
      'Protein: 24–26 g per 100 g',
      'Dietary fiber: 14–16 g per 100 g',
      'Iron: 3.5–5 mg per 100 g',
      'Calcium: 130–150 mg per 100 g (among the highest in pulses)',
      'Rich in B-complex vitamins and folic acid',
      'Contains essential fatty acids including linoleic acid',
    ],
    marketApplications: [
      'Primary ingredient for idli, dosa, and vada batter preparation',
      'Dal makhani and creamy North Indian dal preparations',
      'Urad flour for papad, khichu, and traditional snack making',
      'Fermented food starter cultures and probiotic applications',
      'Canned and frozen batter products for convenience markets',
      'Medicinal and Ayurvedic food formulations',
    ],
    varieties: [
      {
        name: 'T 9',
        slug: 't-9',
        imagePlaceholder: '/assets/placeholders/urad-t-9.png',
        overview:
          'T 9 is one of the oldest and most widely adapted black gram varieties in India, serving as a benchmark variety against which newer releases are often compared. Developed several decades ago, it continues to be cultivated across Madhya Pradesh, Uttar Pradesh, and Maharashtra due to its reliability and consistent market acceptance.\n\nThe variety matures in 75–80 days and produces medium-sized black seeds with a good luster and white interior. T 9 has a semi-spreading growth habit and demonstrates moderate tolerance to yellow mosaic virus and powdery mildew. Its adaptability to a range of soil types, from sandy loams to black cotton soils, has contributed to its enduring popularity.\n\nT 9 is a standard-bearer for urad quality in Indian markets. The dal produced is creamy white with excellent thickness and texture, making it ideal for both South Indian batter preparations and North Indian dal dishes. It remains one of the most recognized variety names in the urad trade.',
        characteristics: {
          color: 'Black seed coat, white interior',
          shape: 'Lens-shaped oval',
          averageSize: '3–4 mm diameter',
          taste: 'Mild, earthy with smooth creamy texture',
          aroma: 'Subtle fermented aroma potential',
          storage: '12–16 months whole, 8–10 months split',
        },
        applications: [
          'Traditional idli-dosa batter manufacturing',
          'North Indian urad dal preparations',
          'Standard market variety for wholesale trade',
        ],
        shelfLife: '16 months (whole grain)',
        exportSuitability:
          'Moderate — well-known and trusted variety with established presence in ethnic food export channels.',
      },
      {
        name: 'Pusa 1',
        slug: 'pusa-1',
        imagePlaceholder: '/assets/placeholders/urad-pusa-1.png',
        overview:
          'Pusa 1 is a pioneering black gram variety developed by IARI, New Delhi, and represents one of the first scientifically bred urad varieties released in India. Despite its age, Pusa 1 remains in cultivation in parts of northern India where its specific agronomic traits continue to offer advantages for farmers.\n\nThe variety matures in approximately 80–85 days and produces medium-bold black seeds with good seed coat integrity. Pusa 1 shows moderate resistance to cercospora leaf spot and has performed consistently in the irrigated and rainfed conditions of the Indo-Gangetic plains. Its plant architecture supports good pod formation even under moderate pest pressure.\n\nPusa 1 urad dal has a characteristic creamy texture and is well-regarded in traditional dal preparations. The variety is particularly noted for its fermentation quality, producing a consistent, well-risen batter for South Indian dishes. Its legacy status makes it a recognized name among traditional urad consumers.',
        characteristics: {
          color: 'Black with smooth seed coat',
          shape: 'Rounded oval',
          averageSize: '3.5–4 mm diameter',
          taste: 'Classic urad flavor, earthy and mild',
          aroma: 'Good fermentation aroma development',
          storage: '12–15 months whole, 8–10 months split',
        },
        applications: [
          'Traditional fermentation batter for idli and dosa',
          'Creamy North Indian urad dal dishes',
          'Heritage and legacy urad variety for premium branding',
        ],
        shelfLife: '15 months (whole grain)',
        exportSuitability:
          'Moderate — recognized legacy variety with appeal in traditional and authentic food product lines.',
      },
      {
        name: 'LBG 623',
        slug: 'lbg-623',
        imagePlaceholder: '/assets/placeholders/urad-lbg-623.png',
        overview:
          'LBG 623 is a black gram variety developed by Tamil Nadu Agricultural University, specifically bred for the southern Indian growing environment. It is designed to thrive in the warm, humid conditions of Tamil Nadu and neighboring states, where it serves as a critical component of rice-based cropping systems.\n\nThe variety matures in 70–75 days and produces bold, lustrous black seeds with a uniform appearance. LBG 623 demonstrates good tolerance to yellow mosaic virus and has shown resistance to major urad insect pests prevalent in the southern region. Its short duration allows for effective integration into rice-rice and rice-pulse cropping sequences.\n\nLBG 623 produces excellent quality dal that is highly valued in South Indian food processing. The variety\'s bold seed size and high dal recovery rate make it economically attractive for commercial dal mills. Its consistent performance has made it one of the leading urad varieties in Tamil Nadu and Andhra Pradesh.',
        characteristics: {
          color: 'Deep black with glossy finish',
          shape: 'Bold oval',
          averageSize: '4–4.5 mm diameter',
          taste: 'Rich, full-bodied urad flavor',
          aroma: 'Excellent fermentation characteristics',
          storage: '12–14 months whole, 7–9 months split',
        },
        applications: [
          'South Indian commercial batter and food processing',
          'Bold-seed premium urad for retail markets',
          'Rice-fallow and rice-based cropping systems',
        ],
        shelfLife: '14 months (whole grain)',
        exportSuitability:
          'Moderate to high — bold grain size and excellent processing quality suit it for export to South Asian diaspora markets.',
      },
      {
        name: 'Shekhar 1',
        slug: 'shekhar-1',
        imagePlaceholder: '/assets/placeholders/urad-shekhar-1.png',
        overview:
          'Shekhar 1 is a high-yielding black gram variety developed for the central Indian urad-growing belt, particularly Madhya Pradesh and Chhattisgarh. It is recognized for its superior yield performance compared to older varieties and its adaptability to the varying rainfall patterns characteristic of the region.\n\nThe variety matures in 75–80 days and produces medium to bold black seeds with good uniformity. Shekhar 1 carries a strong disease resistance package including resistance to yellow mosaic virus and moderate resistance to powdery mildew. Its erect plant type and good standability reduce lodging losses and facilitate harvesting operations.\n\nShekhar 1 urad is well-accepted in the central Indian dal markets of Indore, Bhopal, and Raipur. The dal quality is characterized by a creamy white color, smooth texture, and good consistency. The variety is increasingly being adopted by contract farming operations targeting export-quality urad production.',
        characteristics: {
          color: 'Black with uniform seed coat',
          shape: 'Oval to round',
          averageSize: '3.5–4 mm diameter',
          taste: 'Balanced flavor, smooth and creamy',
          aroma: 'Pleasant mild aroma',
          storage: '14–16 months whole, 8–10 months split',
        },
        applications: [
          'Central Indian domestic dal market supply',
          'Contract farming for export-quality urad production',
          'Multiple cropping system integration in central India',
        ],
        shelfLife: '16 months (whole grain)',
        exportSuitability:
          'Moderate to high — consistent quality and growing adoption in export-oriented production systems.',
      },
      {
        name: 'VBN 1',
        slug: 'vbn-1',
        imagePlaceholder: '/assets/placeholders/urad-vbn-1.png',
        overview:
          'VBN 1 is a black gram variety developed by VBN Agricultural University in Tamil Nadu, designed specifically for the state\'s intensive irrigated rice-based cropping systems. It is optimized for the short window between rice harvests, enabling farmers to harvest a profitable urad crop without delaying the next rice planting.\n\nThe variety matures in 65–70 days, making it one of the earliest-maturing urad types available. VBN 1 produces medium-bold black seeds with attractive luster and good seed coat strength that resists damage during threshing and milling. It demonstrates tolerance to waterlogging conditions often encountered in post-rice fields and shows good resistance to yellow mosaic virus.\n\nVBN 1 is widely adopted in the Cauvery delta region and other irrigated zones of Tamil Nadu. The dal produced is of excellent quality, with a bright white appearance and fine texture that meets the exacting standards of South Indian food processors. The variety is increasingly used by branded batter manufacturers for readymade idli-dosa batter products.',
        characteristics: {
          color: 'Black with glossy luster',
          shape: 'Bold oval',
          averageSize: '4 mm diameter',
          taste: 'Clean, smooth with excellent batter quality',
          aroma: 'Optimal fermentation aroma profile',
          storage: '12–14 months whole, 7–9 months split',
        },
        applications: [
          'Branded readymade batter for idli and dosa',
          'Post-rice cultivation in delta and irrigated regions',
          'Quick-maturing catch crop in intensive farming',
        ],
        shelfLife: '14 months (whole grain)',
        exportSuitability:
          'Moderate — valued in premium South Indian food product exports and branded batter supply chains.',
      },
    ],
  },
  {
    id: 'masoor',
    name: 'Masoor / Red Lentil',
    slug: 'masoor',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/masoor/masoor_1.jpg',
    overview:
      'Masoor, or red lentil, is a vital pulse crop in India that plays a central role in everyday nutrition across all regions of the country. As one of the quickest-cooking lentils, masoor dal is a household staple, valued for its convenience, protein content, and comforting flavor profile. India is among the world\'s largest producers of red lentil, with significant domestic consumption supplemented by imports to meet the growing demand.\n\nMasoor is predominantly cultivated as a rabi crop in northern and central India, sown after the monsoon and harvested in early spring. The crop\'s relatively short duration of 100–120 days allows it to fit efficiently into wheat-based rotation systems. Its nitrogen-fixing capability contributes to soil fertility, supporting sustainable agricultural practices in pulse-growing regions.\n\nIndian masoor is increasingly finding its way into international trade, with the country\'s red lentil production competing with Canadian and Australian supplies in global markets. The export potential of Indian masoor is enhanced by its distinct flavor profile, which is preferred in many traditional South Asian and Middle Eastern culinary applications.',
    keyBenefits: [
      'Fastest cooking pulse variety — ready in 15–20 minutes',
      'High-quality protein content of 24–26%',
      'Rich in iron and folate supporting blood health',
      'Low anti-nutritional factor content for easy digestion',
      'Excellent nitrogen fixation capacity for soil health',
      'High fiber content promoting cardiovascular health',
    ],
    growingRegions: [
      'Madhya Pradesh',
      'Uttar Pradesh',
      'Bihar',
      'West Bengal',
      'Rajasthan',
    ],
    harvestSeason: 'February to April (Rabi / early spring)',
    exportAvailability:
      'Exported as whole masoor, split red dal, and dehulled orange lentils. Peak export period is March–May post-harvest. Key markets include Middle East, Southeast Asia, North Africa, and European specialty food channels.',
    storageInfo:
      'Store whole masoor at 10–12°C with relative humidity below 55%. Split masoor dal should be stored in moisture-proof packaging to prevent color darkening and hardening. Whole grain shelf life is 14–18 months under optimal conditions.',
    nutritionalHighlights: [
      'Protein: 24–26 g per 100 g',
      'Dietary fiber: 11–14 g per 100 g',
      'Iron: 6–8 mg per 100 g (among highest in pulses)',
      'Folate: 200–250 μg per 100 g',
      'Low fat content with heart-healthy unsaturated fatty acids',
      'Rich in manganese, copper, and vitamin B6',
    ],
    marketApplications: [
      'Quick-cooking everyday dal for households and food service',
      'Dehulled orange/red lentils for global trade markets',
      'Thickening agent in soups, stews, and curries',
      'Ingredient in plant-based protein formulations',
      'Flour for flatbreads, baby foods, and nutritional supplements',
      'Sprouted lentil products for health food markets',
    ],
    varieties: [
      {
        name: 'Pusa 4076',
        slug: 'pusa-4076',
        imagePlaceholder: '/assets/placeholders/masoor-pusa-4076.png',
        overview:
          'Pusa 4076 is an improved red lentil variety developed by IARI, New Delhi, representing a significant advancement in India\'s masoor breeding program. It is specifically designed for high yield potential, enhanced disease resistance, and superior grain quality suited to the evolving demands of both domestic consumers and export markets.\n\nThe variety matures in 105–115 days and produces medium-sized reddish-brown seeds with good uniformity and luster. Pusa 4076 carries resistance to lentil rust and stemphylium blight, two major diseases that cause substantial yield losses in lentil-growing regions. Its erect plant type and good pod retention contribute to efficient harvesting and reduced field losses.\n\nPusa 4076 produces dal of excellent quality with a bright orange color after dehulling, a smooth texture, and a rich, earthy flavor. The variety\'s consistent quality and attractive appearance have made it a preferred choice for export-grade red lentil production in the Indo-Gangetic plains.',
        characteristics: {
          color: 'Reddish-brown (whole), bright orange (dehulled)',
          shape: 'Lens-shaped disc',
          averageSize: '3–4 mm diameter',
          taste: 'Earthy, rich flavor with smooth mouthfeel',
          aroma: 'Warm, nutty aroma when cooked',
          storage: '14–18 months whole, 9–12 months split',
        },
        applications: [
          'Export-grade red lentil for international trade',
          'Premium split masoor dal for retail packaging',
          'High-yield rabi cultivation in northern India',
        ],
        shelfLife: '18 months (whole grain)',
        exportSuitability:
          'High — excellent grain quality, uniform color after dehulling, and strong disease resistance package make it highly competitive in global red lentil trade.',
      },
      {
        name: 'Pusa Masoor',
        slug: 'pusa-masoor',
        imagePlaceholder: '/assets/placeholders/masoor-pusa-masoor.png',
        overview:
          'Pusa Masoor is a classic and widely recognized lentil variety from IARI that has served as the foundation of India\'s red lentil cultivation for decades. Its consistent performance, reliable yield, and established market presence have ensured its continued relevance in Indian pulse farming despite the introduction of newer varieties.\n\nThe variety matures in 110–120 days and produces medium-sized brown-red seeds with a slightly mottled appearance. Pusa Masoor demonstrates moderate resistance to wilt and rust, and performs reliably across the lentil-growing regions of northern India. Its adaptability to both irrigated and rainfed conditions has been a key factor in its enduring popularity.\n\nPusa Masoor dal is known for its balanced flavor and consistent cooking quality. The split dal has a warm orange color and thickens well in preparations, making it a favorite for everyday household cooking. The variety name carries significant brand recognition in Indian grain markets.',
        characteristics: {
          color: 'Brown-red (whole), warm orange (split)',
          shape: 'Disc-shaped, slightly flattened',
          averageSize: '3–3.5 mm diameter',
          taste: 'Classic masoor flavor, earthy and comforting',
          aroma: 'Warm, inviting cooked aroma',
          storage: '14–16 months whole, 8–11 months split',
        },
        applications: [
          'Everyday household masoor dal across India',
          'Established market variety for wholesale trade',
          'Reliable rabi pulse in wheat rotation systems',
        ],
        shelfLife: '16 months (whole grain)',
        exportSuitability:
          'Moderate — established reputation and consistent quality suitable for ethnic food export markets.',
      },
      {
        name: 'DPL 62',
        slug: 'dpl-62',
        imagePlaceholder: '/assets/placeholders/masoor-dpl-62.png',
        overview:
          'DPL 62 is a red lentil variety developed for the eastern Indian growing conditions, particularly in Bihar and West Bengal, where lentil is an important rabi crop in rice-based farming systems. The variety is specifically adapted to the humid subtropical conditions of the Indo-Gangetic delta region.\n\nThe variety matures in 100–110 days and produces small to medium red-brown seeds with good seed coat integrity. DPL 62 has shown tolerance to excess soil moisture conditions common in lowland rice-fallow environments and moderate resistance to rust. Its compatibility with residual fertility from preceding rice crops makes it an efficient catch crop for eastern Indian farmers.\n\nDPL 62 produces dal with a characteristic deep orange color and a slightly thicker consistency compared to northern Indian types. This thicker dal is particularly valued in eastern Indian cuisine for dishes like masoor dal with coconut and traditional Bengali lentil preparations.',
        characteristics: {
          color: 'Red-brown (whole), deep orange (dehulled)',
          shape: 'Small disc',
          averageSize: '2.5–3 mm diameter',
          taste: 'Rich, slightly thick and hearty',
          aroma: 'Pronounced earthy aroma',
          storage: '12–15 months whole, 8–10 months split',
        },
        applications: [
          'Eastern Indian traditional lentil dishes',
          'Rice-fallow cultivation in Bengal and Bihar',
          'Small-seed masoor for regional specialty markets',
        ],
        shelfLife: '15 months (whole grain)',
        exportSuitability:
          'Low to moderate — niche appeal in eastern Indian culinary markets and regional South Asian trade.',
      },
      {
        name: 'IPL 220',
        slug: 'ipl-220',
        imagePlaceholder: '/assets/placeholders/masoor-ipl-220.png',
        overview:
          'IPL 220 is a modern red lentil variety developed by the Indian Institute of Pulses Research (IIPR), Kanpur, representing the next generation of masoor breeding in India. It is bred for high yield potential, broad adaptability, and improved stress tolerance to meet the demands of an evolving pulse production landscape.\n\nThe variety matures in 105–115 days and produces medium-bold reddish-brown seeds with uniform size and attractive luster. IPL 220 carries a comprehensive disease resistance package including resistance to rust, wilt, and stemphylium blight. It has demonstrated superior performance under both irrigated and rainfed conditions across the lentil-growing states of northern and central India.\n\nIPL 220 produces premium quality dal with excellent color, texture, and cooking characteristics. The variety\'s bold seed size and high proportion of marketable grades make it economically attractive for farmers and dal millers alike. It is increasingly targeted by export-oriented production programs.',
        characteristics: {
          color: 'Reddish-brown with lustrous seed coat',
          shape: 'Bold disc-shaped',
          averageSize: '3.5–4 mm diameter',
          taste: 'Rich, full flavor with excellent texture',
          aroma: 'Warm nutty aroma',
          storage: '14–18 months whole, 9–12 months split',
        },
        applications: [
          'High-yield commercial masoor cultivation',
          'Export-oriented lentil production programs',
          'Broad-adaptation variety for multi-region farming',
        ],
        shelfLife: '18 months (whole grain)',
        exportSuitability:
          'High — modern breeding profile with bold seeds, comprehensive disease resistance, and excellent processing quality for international markets.',
      },
      {
        name: 'Pant L 406',
        slug: 'pant-l-406',
        imagePlaceholder: '/assets/placeholders/masoor-pant-l-406.png',
        overview:
          'Pant L 406 is a red lentil variety developed by G.B. Pant University of Agriculture and Technology for the hill and terai regions of Uttarakhand and surrounding areas. It is specifically adapted to the cooler growing conditions and shorter growing seasons found in the sub-Himalayan agricultural zones.\n\nThe variety matures in 100–110 days and produces medium-sized seeds with a reddish-brown coloration typical of Indian masoor types. Pant L 406 shows good tolerance to cold stress during early growth stages and moderate resistance to rust and powdery mildew. Its adaptation to the cooler climates of the Himalayan foothills fills an important niche in India\'s lentil production geography.\n\nPant L 406 dal has a distinctive flavor profile attributed to the unique growing conditions of the sub-Himalayan region. The lentils are valued in local hill-state cuisines and are increasingly marketed as a specialty product in urban health food circles, leveraging their terroir-driven quality story.',
        characteristics: {
          color: 'Reddish-brown with slight gradient',
          shape: 'Medium disc',
          averageSize: '3–3.5 mm diameter',
          taste: 'Distinctive earthy flavor with subtle sweetness',
          aroma: 'Unique cool-climate lentil aroma',
          storage: '14–16 months whole, 8–10 months split',
        },
        applications: [
          'Specialty hill-grown lentil for premium markets',
          'Cool-climate lentil cultivation in Himalayan foothills',
          'Terroir-based branding for gourmet food channels',
        ],
        shelfLife: '16 months (whole grain)',
        exportSuitability:
          'Moderate — attractive for specialty and gourmet food export channels that value regional origin stories.',
      },
    ],
  },
]
