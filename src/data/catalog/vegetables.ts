import type { Product } from '../types'

export const vegetablesProducts: Product[] = [
  {
    id: 'onion',
    name: 'Onion',
    slug: 'onion',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/onion/onion_1.jpg',
    overview:
      'Onion is India\'s most commercially significant fresh vegetable crop, serving as an indispensable ingredient in virtually every Indian household and food service establishment. India ranks among the world\'s largest onion producers, with output spanning multiple agro-climatic zones that enable year-round supply. The crop\'s economic importance is such that price fluctuations in the onion market directly influence consumer sentiment and government trade policy.\n\nIndian onion cultivation benefits from well-established research and breeding programs at IARI, ICAR-DWR, and state agricultural universities, which have developed high-yielding, disease-resistant varieties adapted to diverse growing conditions. The country produces both red and light-red onion types, with the Nasik Red and Bangalore Rose categories recognized internationally for their pungent flavor and extended shelf life. These attributes make Indian onions particularly competitive in global trade.\n\nThe organised retail sector and export market for Indian onions have expanded significantly, driven by demand from South Asia, the Middle East, and Southeast Asia. Premium graded onions meeting APEDA specifications are exported by sea in reefer containers, with well-developed cold chain and packhouse infrastructure at major production hubs including Nashik, Bengaluru, and Pune.',
    keyBenefits: [
      'Essential daily-use vegetable with consistent year-round market demand',
      'Multiple commercial varieties suited to diverse agro-climatic zones',
      'Strong export demand across South Asia, Middle East, and Southeast Asia',
      'Well-established packhouse and cold chain infrastructure for exports',
      'Relatively short crop duration of 90–120 days enables rapid turnover',
      'Rich in quercetin and other beneficial flavonoids with antioxidant properties',
    ],
    growingRegions: [
      'Maharashtra',
      'Karnataka',
      'Madhya Pradesh',
      'Gujarat',
      'Rajasthan',
    ],
    harvestSeason: 'September to February (rabi) and April to June (kharif)',
    exportAvailability:
      'Exported year-round with peak shipments from October to March following the rabi harvest. Major export destinations include Bangladesh, Malaysia, UAE, Sri Lanka, and Indonesia. Both loose and pre-packed graded onions are shipped in reefer containers.',
    storageInfo:
      'Rabi onions have excellent storage life of 4–6 months at ambient temperatures in well-ventilated structures with 65–70% relative humidity. Kharif onions are perishable and require cold storage at 0–2°C with 90–95% RH for shelf life extension. Proper curing before storage is essential to minimize rot losses.',
    nutritionalHighlights: [
      'Quercetin: 20–40 mg per 100 g (potent antioxidant)',
      'Dietary fiber: 1.5–2 g per 100 g',
      'Vitamin C: 7–8 mg per 100 g',
      'Rich in organosulfur compounds with anti-inflammatory properties',
      'Good source of chromium supporting blood sugar regulation',
      'Contains fructooligosaccharides beneficial for gut health',
    ],
    marketApplications: [
      'Fresh household consumption and food service ingredient',
      'Export-grade sorted and packed onion for international trade',
      'Dehydrated onion flakes, powder, and kibbled onion manufacturing',
      'Processed onion paste and puree for ready-to-cook product lines',
      'Pickle and condiment industry raw material supply',
      'Organized retail pre-pack and supermarket supply chains',
    ],
    varieties: [
      {
        name: 'Nasik Red',
        slug: 'nasik-red',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Nashik Red Onion Cross-Section]',
        overview:
          'Nasik Red is the most iconic Indian onion variety, originating from the Nashik district of Maharashtra — India\'s premier onion-producing region. This variety has earned a geographical identity that is recognized in domestic and international markets, often commanding a premium price due to its distinctive deep red color, firm flesh, and pronounced pungency.\n\nThe bulbs are medium to large with tight, papery skin and concentric layers of crisp, juicy flesh. Nasik Red is a rabi onion with exceptional storage capability, retaining its quality for 4–6 months under ambient conditions when properly cured. This long shelf life is one of its most commercially valuable traits, enabling year-round supply and making it the backbone of India\'s export onion trade.\n\nNasik Red onions are preferred in export markets for their ability to withstand long sea voyages without significant quality deterioration. The variety is widely cultivated across Maharashtra, with Nashik, Pune, and Ahmednagar districts serving as the primary production hubs.',
        characteristics: {
          color: 'Deep purplish-red',
          shape: 'Globular to slightly flattened',
          averageSize: '5–8 cm diameter',
          taste: 'Strongly pungent with sweet undertones when cooked',
          aroma: 'Intense, sharp onion aroma',
          storage: '4–6 months at ambient conditions',
        },
        applications: [
          'Export-grade onion for Middle East and Southeast Asian markets',
          'Premium retail supply in organised supermarket chains',
          'Long-duration storage onion for off-season market supply',
        ],
        shelfLife: '5–6 months (cured, ambient storage)',
        exportSuitability:
          'Very high — the gold standard for Indian onion exports, recognized by name in international markets for its pungency and shelf stability.',
      },
      {
        name: 'Agri Found Dark Red',
        slug: 'agri-found-dark-red',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Agri Found Dark Red Onion Bulb]',
        overview:
          'Agri Found Dark Red is a commercially popular onion variety bred specifically for dark-red skin color and superior shelf life. Developed through targeted breeding programs, it addresses the market demand for visually striking onions that maintain their appearance and firmness throughout storage and transport.\n\nThe variety produces medium to large bulbs with a distinctive dark crimson skin and firm, crisp flesh. Agri Found Dark Red is adapted to rabi cultivation and shares the long storage characteristics valued by traders and exporters. Its tight skin and low moisture loss during storage translate to reduced post-harvest losses and better market returns.\n\nThis variety is widely grown in Maharashtra and Gujarat, where it is favored by export-oriented farmers who require consistent bulb size, deep color, and excellent transport tolerance. It has established a strong presence in pre-packed retail onion segments where visual quality directly influences purchase decisions.',
        characteristics: {
          color: 'Dark crimson-red skin',
          shape: 'Rounded globular',
          averageSize: '5–7 cm diameter',
          taste: 'Pungent with balanced sweetness',
          aroma: 'Strong, characteristic onion pungency',
          storage: '4–5 months under ambient conditions',
        },
        applications: [
          'Premium pre-packed retail onion in supermarket channels',
          'Export-oriented cultivation for visual quality markets',
          'Long-distance transport and extended shelf-life supply chains',
        ],
        shelfLife: '4–5 months (cured, ambient storage)',
        exportSuitability:
          'High — excellent visual appeal and storage stability make it well-suited for premium retail export, particularly to Gulf and Southeast Asian markets.',
      },
      {
        name: 'Pusa Red',
        slug: 'pusa-red',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Red Onion Harvested Bulbs]',
        overview:
          'Pusa Red is an IARI-developed onion variety that has been a mainstay of Indian onion cultivation for decades. It represents a well-balanced combination of yield potential, bulb quality, and disease resistance that has sustained its popularity among farmers across northern and central India.\n\nThe variety produces medium-sized, dark red bulbs with a slightly flattened shape and tight skin. Pusa Red matures in approximately 120–130 days and demonstrates good field tolerance to purple blotch and stemphylium blight. Its consistent performance under varied growing conditions makes it a reliable choice for both commercial and smallholder farmers.\n\nPusa Red is well-regarded in domestic wholesale markets for its uniform bulb size and attractive deep red color. The variety is commonly used in government market intervention programs and is a standard variety in India\'s onion trade infrastructure.',
        characteristics: {
          color: 'Dark red',
          shape: 'Slightly flattened globular',
          averageSize: '4–6 cm diameter',
          taste: 'Moderately pungent with good flavor depth',
          aroma: 'Medium onion pungency',
          storage: '3–4 months at ambient conditions',
        },
        applications: [
          'Domestic wholesale market supply and government procurement',
          'General-purpose onion for household and food service use',
          'Multi-region commercial cultivation across northern India',
        ],
        shelfLife: '3–4 months (cured, ambient storage)',
        exportSuitability:
          'Moderate — suitable for standard export shipments to regional markets, particularly South Asia and the Middle East.',
      },
      {
        name: 'Pusa Ratnar',
        slug: 'pusa-ratnar',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Ratnar Onion Field-Ripe Bulbs]',
        overview:
          'Pusa Ratnar is a high-yielding, multi-tolerant onion variety developed by IARI, New Delhi, designed to address the key production constraints faced by onion farmers across India. It combines improved yield potential with tolerance to major diseases and pests, making it a practical choice for sustainable onion cultivation.\n\nThe variety matures in 115–125 days and produces medium to large, dark red bulbs with good skin retention and firm flesh. Pusa Ratnar carries tolerance to purple blotch, downy mildew, and thrips infestation — three of the most damaging production constraints. Its erect plant architecture facilitates better airflow and reduced disease incidence in dense plantings.\n\nPusa Ratnar has gained adoption in Maharashtra, Madhya Pradesh, and Karnataka for its reliable yield performance and reduced crop protection costs. The bulbs are well-suited for both domestic fresh market sales and export grading, making it a versatile commercial variety.',
        characteristics: {
          color: 'Dark red',
          shape: 'Globular to slightly oval',
          averageSize: '5–7 cm diameter',
          taste: 'Pungent with well-rounded flavor profile',
          aroma: 'Strong characteristic onion aroma',
          storage: '4–5 months at ambient conditions',
        },
        applications: [
          'Disease-resistant commercial onion cultivation',
          'Export-grade production with reduced pesticide residue',
          'Organised retail and export market supply chains',
        ],
        shelfLife: '4–5 months (cured, ambient storage)',
        exportSuitability:
          'High — disease tolerance reduces pesticide requirements, meeting stringent residue limits for premium export destinations.',
      },
      {
        name: 'Arka Niketan',
        slug: 'arka-niketan',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Arka Niketan Onion Uniform Bulb Lot]',
        overview:
          'Arka Niketan is an onion variety developed by ICAR-IIHR, Bengaluru, specifically for the southern Indian onion-growing ecosystem. It is adapted to the warmer, relatively humid conditions of peninsular India and has become a preferred variety for kharif and late-kharif onion cultivation in Karnataka, Tamil Nadu, and Andhra Pradesh.\n\nThe variety produces medium-sized, attractive red bulbs with a characteristic glossy skin and firm, crisp flesh. Arka Niketan matures in 100–110 days and demonstrates good tolerance to anthracnose and thrips. Its relatively short maturity period allows farmers in southern India to fit onion cultivation into multiple cropping sequences.\n\nArka Niketan onions are particularly valued in the Bangalore Rose onion category, which is recognized in international trade for its mild pungency and attractive appearance. The variety is well-suited for export to markets that prefer moderate pungency and vibrant red color.',
        characteristics: {
          color: 'Glossy red',
          shape: 'Rounded globular',
          averageSize: '4–6 cm diameter',
          taste: 'Moderately pungent with mild sweetness',
          aroma: 'Pleasant, moderate onion aroma',
          storage: '2–3 months at ambient conditions',
        },
        applications: [
          'Bangalore Rose onion category for international trade',
          'Southern Indian kharif onion cultivation systems',
          'Export to markets preferring moderate pungency',
        ],
        shelfLife: '2–3 months (ambient conditions)',
        exportSuitability:
          'Moderate to high — well-regarded in the Bangalore Rose export category, particularly for markets in Southeast Asia and the Gulf.',
      },
      {
        name: 'N-53',
        slug: 'n-53',
        imagePlaceholder: '[IMAGE PLACEHOLDER: N-53 Onion Bulb Close-Up]',
        overview:
          'N-53 is a well-established onion variety developed specifically for the kharif (monsoon) season cultivation, which is critical for maintaining onion supply during the lean period between October and December when rabi stocks begin to deplete. Kharif onion varieties like N-53 play a vital role in India\'s food security and price stability.\n\nThe variety matures in 90–100 days and produces small to medium bulbs with a light red color and relatively high moisture content. While kharif onions inherently have shorter shelf life than rabi types, N-53 offers the best available storage performance in its category, maintaining marketable quality for 1–2 months under ambient conditions.\n\nN-53 is widely cultivated in Karnataka, Maharashtra, and Gujarat during the monsoon season. Its production is essential for bridging the supply gap before the rabi harvest arrives in the market, and it remains a strategically important variety for India\'s year-round onion supply chain.',
        characteristics: {
          color: 'Light red',
          shape: 'Small to medium globular',
          averageSize: '3–5 cm diameter',
          taste: 'Mildly pungent with high moisture content',
          aroma: 'Fresh, mild onion aroma',
          storage: '1–2 months at ambient conditions',
        },
        applications: [
          'Kharif season cultivation for lean-period supply bridging',
          'Fresh market onion during October–December supply window',
          'Quick-turnaround kharif crop for multiple harvest strategy',
        ],
        shelfLife: '1–2 months (ambient conditions)',
        exportSuitability:
          'Low to moderate — primarily suited for domestic fresh market supply due to shorter shelf life, though limited cold-chain exports are feasible.',
      },
    ],
  },
  {
    id: 'tomato',
    name: 'Tomato',
    slug: 'tomato',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/tomato/tomato_1.jpg',
    overview:
      'Tomato is one of India\'s most economically important vegetable crops, cultivated across diverse agro-climatic zones for fresh market sales, processing, and export. India ranks among the top global tomato producers, with the crop contributing significantly to both farm incomes and nutritional security. The versatility of tomato — consumed raw, cooked, pureed, and processed — ensures robust demand across all market segments.\n\nThe Indian tomato sector has benefited from decades of systematic breeding work at IARI, ICAR-IIHR, and state agricultural universities, producing varieties optimized for specific end-uses including fresh table tomatoes, processing-grade tomatoes for sauce and paste, and cherry tomatoes for premium retail. This varietal diversity enables India to serve both high-volume domestic markets and niche export opportunities.\n\nOrganised retail chains and food processing companies are increasingly sourcing tomatoes through contract farming arrangements, ensuring consistent quality, traceability, and supply reliability. Indian tomatoes are exported to neighboring South Asian markets, the Middle East, and increasingly to premium segments in Europe and North America where Indian greenhouse-grown cherry and vine tomatoes command attractive prices.',
    keyBenefits: [
      'High-value vegetable with strong demand across fresh and processed segments',
      'Diverse varietal options for table, processing, and export end-uses',
      'Multiple growing seasons enable year-round production across zones',
      'Rich in lycopene, a powerful antioxidant with proven health benefits',
      'Established processing infrastructure for paste, sauce, and puree',
      'Growing export potential for premium greenhouse and cherry tomatoes',
    ],
    growingRegions: [
      'Karnataka',
      'Maharashtra',
      'Andhra Pradesh',
      'Madhya Pradesh',
      'Gujarat',
    ],
    harvestSeason: 'October to March (rabi) and April to August (kharif), with off-season greenhouse production year-round',
    exportAvailability:
      'Exported primarily to neighboring South Asian countries, the Middle East, and Southeast Asia. Peak export season is November to February. Greenhouse cherry and vine tomatoes are exported by air to premium markets in Europe and the Gulf.',
    storageInfo:
      'Fresh table tomatoes should be stored at 12–14°C with 90–95% relative humidity. Storage below 10°C causes chilling injury and flavor loss. Mature green tomatoes can be ripened at 18–22°C. Under optimal conditions, firm ripe tomatoes maintain quality for 10–14 days.',
    nutritionalHighlights: [
      'Lycopene: 2.5–4 mg per 100 g (enhanced by cooking)',
      'Vitamin C: 14–19 mg per 100 g',
      'Potassium: 230–250 mg per 100 g',
      'Beta-carotene and lutein for eye health',
      'Low calorie density at approximately 18 kcal per 100 g',
      'Rich in folate and vitamin K',
    ],
    marketApplications: [
      'Fresh table tomato for household consumption and food service',
      'Processing-grade tomato for sauce, paste, ketchup, and puree manufacturing',
      'Cherry and vine tomato for premium organised retail and export',
      'Sun-dried and semi-dried tomato for gourmet food applications',
      'Tomato juice and health beverage production',
      'Canned and diced tomato for industrial food manufacturing',
    ],
    varieties: [
      {
        name: 'Pusa Ruby',
        slug: 'pusa-ruby',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Ruby Tomato Cluster on Vine]',
        overview:
          'Pusa Ruby is a classic IARI-developed tomato variety that has been a cornerstone of Indian tomato cultivation for decades. It remains one of the most widely grown table tomato varieties in northern India, valued for its attractive fruit appearance, reliable yield, and broad market acceptance in both wholesale and retail channels.\n\nThe variety produces medium-sized, round fruits with a vibrant red color and firm flesh. Pusa Ruby matures in approximately 110–120 days from transplanting and demonstrates moderate resistance to Fusarium wilt and nematodes. Its determinate growth habit makes it manageable for farmers with limited staking resources.\n\nPusa Ruby tomatoes are widely available in APMC markets across northern India and are a standard variety for household consumption. The fruits have good transport tolerance and maintain their firmness and color during distribution, making them a practical choice for the fresh market supply chain.',
        characteristics: {
          color: 'Bright red',
          shape: 'Round to slightly oblate',
          averageSize: '6–8 cm diameter',
          taste: 'Balanced sweet-tart flavor typical of table tomatoes',
          aroma: 'Fresh, characteristic tomato aroma',
          storage: '10–14 days at 12–14°C',
        },
        applications: [
          'Standard table tomato for household and restaurant use',
          'Wholesale APMC market supply in northern India',
          'General-purpose fresh market tomato',
        ],
        shelfLife: '10–14 days (refrigerated)',
        exportSuitability:
          'Moderate — suitable for regional exports to South Asian and Gulf markets where table tomatoes are in consistent demand.',
      },
      {
        name: 'Arka Vikas',
        slug: 'arka-vikas',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Arka Vikas Tomato Ripe Fruit Display]',
        overview:
          'Arka Vikas is a high-yielding tomato variety developed by ICAR-IIHR, Bengaluru, that has achieved widespread adoption across southern and central India. It is specifically bred for the warm, humid conditions of peninsular India and delivers consistently high yields of attractive, firm fruits suitable for both fresh market and processing applications.\n\nThe variety produces large, oblate fruits with a deep red color and thick flesh. Arka Vikas matures in 120–130 days and demonstrates good tolerance to bacterial wilt and root-knot nematode — two major constraints in southern Indian tomato cultivation. Its semi-determinate plant type produces fruits over an extended harvest window.\n\nArka Vikas is a preferred variety for organised retail procurement in southern India, where its large fruit size, uniform red color, and firm texture meet the visual quality standards of modern supermarket chains. The variety is also accepted by processing units for bulk tomato paste and puree production.',
        characteristics: {
          color: 'Deep red',
          shape: 'Oblate (slightly flattened)',
          averageSize: '7–10 cm diameter',
          taste: 'Well-balanced flavor with good sweetness',
          aroma: 'Rich, ripe tomato aroma',
          storage: '12–15 days at 12–14°C',
        },
        applications: [
          'Premium table tomato for organised retail supermarket supply',
          'Processing-grade tomato for paste and puree manufacturing',
          'Southern Indian commercial tomato cultivation',
        ],
        shelfLife: '12–15 days (refrigerated)',
        exportSuitability:
          'Moderate to high — large fruit size and firm texture suitable for export grading and premium retail presentation.',
      },
      {
        name: 'Arka Ashish',
        slug: 'arka-ashish',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Arka Ashish Tomato Uniform Harvest Lot]',
        overview:
          'Arka Ashish is a processing-specific tomato variety developed by ICAR-IIHR for the industrial tomato processing sector. It is engineered to deliver high total soluble solids (TSS), uniform red color, and consistent fruit quality — attributes that are critical for efficient processing into paste, sauce, ketchup, and other value-added products.\n\nThe variety produces medium to large, firm fruits with excellent color uniformity and a high TSS content of 5.0–5.5%, significantly above standard table tomato varieties. Arka Ashish matures in 110–120 days and is designed for machine harvesting compatibility with its concentrated fruit set and uniform ripening pattern.\n\nArka Ashish has become a preferred variety for contract farming arrangements between processing companies and farmers in Karnataka, Maharashtra, and Andhra Pradesh. Its high processing yield and consistent quality parameters translate to better economic returns for both growers and processors.',
        characteristics: {
          color: 'Uniform deep red',
          shape: 'Oval to blocky',
          averageSize: '6–8 cm diameter',
          taste: 'Intense, concentrated tomato flavor with high TSS',
          aroma: 'Strong ripe tomato aroma',
          storage: '14–18 days at 12–14°C',
        },
        applications: [
          'Processing-grade tomato for ketchup and sauce manufacturing',
          'Tomato paste, puree, and concentrate production',
          'Contract farming for food processing industry supply',
        ],
        shelfLife: '14–18 days (refrigerated)',
        exportSuitability:
          'High for processing — specifically bred for industrial processing applications and valued by food processing units for high yield and quality parameters.',
      },
      {
        name: 'Pusa Gaurav',
        slug: 'pusa-gaurav',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Gaurav Tomato Plant with Ripe Fruits]',
        overview:
          'Pusa Gaurav is a disease-resistant tomato variety developed by IARI, New Delhi, designed to address the critical challenge of late blight — the most devastating disease affecting tomato cultivation in India. Its multi-disease resistance package has made it a preferred choice for farmers in regions with high disease pressure and humid growing conditions.\n\nThe variety produces medium-sized, round fruits with a uniform red color and firm flesh. Pusa Gaurav matures in approximately 110–115 days and carries strong resistance to late blight, moderate resistance to Fusarium wilt, and tolerance to leaf curl virus. Its determinate plant habit and sturdy stem make it suitable for both staked and unstaked cultivation systems.\n\nPusa Gaurav is particularly valued in the Indo-Gangetic plains and eastern India where late blight pressure is consistently high. The variety enables farmers to achieve reliable yields in environments where susceptible varieties would suffer catastrophic losses, contributing to production stability and farm income security.',
        characteristics: {
          color: 'Uniform red',
          shape: 'Round',
          averageSize: '5–7 cm diameter',
          taste: 'Classic tomato flavor with good balance',
          aroma: 'Pleasant ripe tomato fragrance',
          storage: '10–12 days at 12–14°C',
        },
        applications: [
          'Disease-resistant cultivation in high-pressure regions',
          'Reliable fresh market supply in late blight-prone areas',
          'Low-pesticide tomato production for quality-conscious markets',
        ],
        shelfLife: '10–12 days (refrigerated)',
        exportSuitability:
          'Moderate — disease resistance translates to lower pesticide residues, meeting residue standards for export markets.',
      },
      {
        name: 'NS 735',
        slug: 'ns-735',
        imagePlaceholder: '[IMAGE PLACEHOLDER: NS 735 Tomato Field Production View]',
        overview:
          'NS 735 is a high-yielding tomato variety developed for the central and western Indian tomato-growing zones, particularly Maharashtra and Madhya Pradesh. It has gained recognition among commercial tomato growers for its vigorous plant growth, heavy fruit set, and adaptability to both irrigated and rainfed cultivation systems.\n\nThe variety produces medium to large, firm fruits with an attractive red color. NS 735 matures in 115–125 days and demonstrates good tolerance to heat and moderate resistance to major tomato diseases. Its indeterminate growth pattern supports extended harvesting periods, allowing farmers to maximize returns per plant.\n\nNS 735 is a dominant variety in the Nashik and Ahmednagar tomato belts of Maharashtra, where it supplies both the Mumbai-Pune urban market and the processing sector. The variety\'s consistent performance and market acceptance make it a reliable choice for commercial-scale tomato operations.',
        characteristics: {
          color: 'Red with glossy skin',
          shape: 'Round to slightly oblate',
          averageSize: '6–8 cm diameter',
          taste: 'Well-rounded sweet-tart tomato flavor',
          aroma: 'Fresh, clean tomato aroma',
          storage: '10–14 days at 12–14°C',
        },
        applications: [
          'High-volume commercial tomato cultivation in Maharashtra',
          'Urban market supply for Mumbai-Pune corridor',
          'Processing and fresh market dual-purpose variety',
        ],
        shelfLife: '10–14 days (refrigerated)',
        exportSuitability:
          'Moderate — suitable for bulk regional exports with good firmness and transport tolerance.',
      },
      {
        name: 'CO 3',
        slug: 'co-3',
        imagePlaceholder: '[IMAGE PLACEHOLDER: CO 3 Tomato Harvested Crate Display]',
        overview:
          'CO 3 is a tomato variety developed by Tamil Nadu Agricultural University, Coimbatore, specifically for the southern Indian farming ecosystem. It is adapted to the tropical conditions of Tamil Nadu and has become one of the most widely cultivated varieties in the state\'s extensive tomato-growing districts.\n\nThe variety produces medium-sized, round fruits with a bright red color and good firmness. CO 3 matures in 100–110 days and shows good tolerance to bacterial wilt and nematodes, which are major constraints in the warm, humid soils of peninsular India. Its determinate growth habit suits the resource-constrained farming systems prevalent among smallholders.\n\nCO 3 tomatoes are a familiar sight in the Koyambedu wholesale market of Chennai and supply the entire Tamil Nadu fresh tomato market. The variety is also used in the processing sector for local sauce and chutney manufacturing, providing versatility in market outlets for farmers.',
        characteristics: {
          color: 'Bright red',
          shape: 'Round',
          averageSize: '5–7 cm diameter',
          taste: 'Mild, pleasant tomato flavor',
          aroma: 'Light, characteristic tomato scent',
          storage: '8–12 days at 12–14°C',
        },
        applications: [
          'Southern Indian fresh tomato market supply',
          'Smallholder tomato cultivation in Tamil Nadu and Karnataka',
          'Local sauce and chutney processing applications',
        ],
        shelfLife: '8–12 days (refrigerated)',
        exportSuitability:
          'Moderate — primarily suited for domestic southern Indian markets with potential for short-distance regional exports.',
      },
    ],
  },
  {
    id: 'potato',
    name: 'Potato',
    slug: 'potato',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/potato/potato_1.jpg',
    overview:
      'Potato is India\'s third most important food crop after rice and wheat, and the country ranks among the world\'s top potato producers. Grown predominantly as a rabi crop during the cool winter months, Indian potato cultivation is concentrated in the Indo-Gangetic plains and the high-altitude plateaus, where the cool climate and fertile alluvial soils provide ideal growing conditions.\n\nIndia has developed a robust potato research infrastructure centered on CPRI (Central Potato Research Institute), which has released numerous varieties optimized for different end-uses including table consumption, chip and fry processing, and starch extraction. The processing-grade potato market has expanded rapidly, driven by the growth of quick-service restaurant chains and the organized snack food industry in India.\n\nIndian seed potato production is well-organized through a network of government and private seed agencies, ensuring availability of disease-free seed tubers for commercial cultivation. The potato cold storage infrastructure across northern India is among the most developed for any Indian crop, enabling year-round supply and price stabilization.',
    keyBenefits: [
      'High-yielding crop with exceptional calorie-to-land ratio',
      'Dedicated processing-grade varieties for chips, fries, and starch',
      'Extensive cold storage infrastructure enables year-round supply',
      'Well-established seed potato multiplication and distribution system',
      'Multiple end-uses spanning fresh consumption, processing, and industrial',
      'Increasing export demand for processing-grade and table potatoes',
    ],
    growingRegions: [
      'Uttar Pradesh',
      'West Bengal',
      'Punjab',
      'Madhya Pradesh',
      'Bihar',
    ],
    harvestSeason: 'December to March (rabi harvest)',
    exportAvailability:
      'Exported year-round to neighboring South Asian markets, the Middle East, and Southeast Asia. Processing-grade potatoes are increasingly exported to snack food manufacturers in South and Southeast Asia.',
    storageInfo:
      'Cold storage at 2–4°C with 90–95% relative humidity is essential for long-term storage of 6–8 months. Storage below 2°C causes cold-induced sweetening, which is undesirable for processing varieties. Sprout inhibitors may be applied for extended storage. Seed potatoes require diffused light storage at 2–4°C.',
    nutritionalHighlights: [
      'Carbohydrates: 16–18 g per 100 g (primarily starch)',
      'Potassium: 420–450 mg per 100 g',
      'Vitamin C: 15–20 mg per 100 g',
      'Dietary fiber: 2–2.5 g per 100 g (with skin)',
      'Good source of vitamin B6 and folate',
      'Contains kukoamines with potential blood pressure-lowering properties',
    ],
    marketApplications: [
      'Fresh table potato for household and restaurant consumption',
      'Processing-grade potato for chip and French fry manufacturing',
      'Starch and modified starch extraction for industrial applications',
      'Dehydrated potato flakes and granules for instant food products',
      'Frozen potato products for quick-service restaurant supply chains',
      'Seed potato production and distribution network',
    ],
    varieties: [
      {
        name: 'Kufri Bahar',
        slug: 'kufri-bahar',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Kufri Bahar Potato Tuber Display]',
        overview:
          'Kufri Bahar is a widely cultivated potato variety developed by CPRI, Shimla, recognized for its versatility as both a table and processing potato. It is one of the most popular varieties among Indian farmers due to its reliable yield performance, good tuber quality, and broad adaptability across the Indo-Gangetic plains.\n\nThe variety produces medium to large, oval tubers with light yellow skin and pale yellow flesh. Kufri Bahar matures in 80–90 days and demonstrates moderate resistance to late blight and good tolerance to potato cyst nematode. Its tubers have a moderate dry matter content of 18–20%, making it acceptable for both boiling and light processing applications.\n\nKufri Bahar dominates the potato markets of Uttar Pradesh, Punjab, and Madhya Pradesh. Its consistent quality and versatile end-use profile make it a preferred variety for wholesale traders, organised retail buyers, and small-scale processing units.',
        characteristics: {
          color: 'Light yellow skin, pale yellow flesh',
          shape: 'Oval',
          averageSize: '6–10 cm length',
          taste: 'Mild, floury texture when cooked',
          aroma: 'Subtle earthy aroma',
          storage: '6–8 months at 2–4°C cold storage',
        },
        applications: [
          'General-purpose table potato for household consumption',
          'Wholesale market supply in northern India',
          'Light processing applications including par-boiling and flakes',
        ],
        shelfLife: '6–8 months (cold storage)',
        exportSuitability:
          'Moderate to high — versatile table variety well-suited for fresh potato exports to South Asian and Middle Eastern markets.',
      },
      {
        name: 'Kufri Jyoti',
        slug: 'kufri-jyoti',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Kufri Jyoti Potato Field Harvest]',
        overview:
          'Kufri Jyoti is a premium table potato variety from CPRI that has established itself as a high-quality variety for the fresh market. It is particularly valued for its attractive tuber appearance, good culinary quality, and suitability for premium retail packaging in organised supermarket chains.\n\nThe variety produces large, oval tubers with smooth light yellow skin and creamy white flesh. Kufri Jyoti matures in 85–95 days and demonstrates good field resistance to late blight and moderate resistance to viral diseases. Its tubers have a desirable mealy texture when boiled or baked, making it a preferred choice for culinary applications where texture is important.\n\nKufri Jyoti is widely grown in Punjab, Haryana, and western Uttar Pradesh, where it supplies the premium table potato segment. The variety commands a price premium in wholesale markets due to its large tuber size, uniform shape, and excellent visual quality.',
        characteristics: {
          color: 'Light yellow skin, creamy white flesh',
          shape: 'Large oval',
          averageSize: '8–12 cm length',
          taste: 'Mild, mealy texture ideal for boiling and baking',
          aroma: 'Very mild, clean aroma',
          storage: '6–8 months at 2–4°C cold storage',
        },
        applications: [
          'Premium table potato for organised retail and supermarkets',
          'Culinary-grade potato for restaurants and hospitality',
          'Pre-packed retail potato in consumer packaging',
        ],
        shelfLife: '6–8 months (cold storage)',
        exportSuitability:
          'High — large tuber size, smooth appearance, and premium quality make it suitable for export to quality-conscious markets.',
      },
      {
        name: 'Kufri Chipsona',
        slug: 'kufri-chipsona',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Kufri Chipsona Potato Sliced for Chips]',
        overview:
          'Kufri Chipsona is a processing-specific potato variety developed by CPRI exclusively for the potato chip manufacturing industry. It represents India\'s capability to produce locally adapted processing-grade potatoes that meet international quality standards, reducing the industry\'s dependence on imported processing varieties.\n\nThe variety produces medium-sized, round to oval tubers with light buff skin and pale yellow flesh. Kufri Chipsona is engineered for high dry matter content (20–22%) and low reducing sugar levels — the two most critical parameters for chip production. These attributes ensure uniform golden chip color, crisp texture, and minimal oil absorption during frying.\n\nKufri Chipsona is cultivated under contract farming arrangements with major snack food manufacturers across Punjab, Gujarat, and Madhya Pradesh. The variety has been instrumental in developing India\'s indigenous potato chip processing sector and reducing raw material costs for the industry.',
        characteristics: {
          color: 'Light buff skin, pale yellow flesh',
          shape: 'Round to oval',
          averageSize: '5–8 cm diameter',
          taste: 'Neutral flavor ideal for salted chip applications',
          aroma: 'Very low aroma, neutral processing profile',
          storage: '5–7 months at 3–4°C (with cold sweetening management)',
        },
        applications: [
          'Potato chip manufacturing and snack food production',
          'Contract farming for organized snack food companies',
          'High dry matter processing-grade potato supply',
        ],
        shelfLife: '5–7 months (cold storage)',
        exportSuitability:
          'High — specifically bred for chip processing, suitable for export to snack food manufacturers in South and Southeast Asia.',
      },
      {
        name: 'Kufri Pukhraj',
        slug: 'kufri-pukhraj',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Kufri Pukhraj Potato Golden Tuber Lot]',
        overview:
          'Kufri Pukhraj is an early-maturing, high-yielding potato variety developed by CPRI for regions with shorter winter growing windows. It is particularly valued in the Gangetic plains of Bihar and eastern Uttar Pradesh, where its quick maturity allows farmers to harvest before the onset of hot weather that would compromise tuber quality.\n\nThe variety produces medium to large, oval tubers with golden yellow skin and light yellow flesh. Kufri Pukhraj matures in just 70–80 days — among the earliest of all Indian potato varieties — and produces uniform, attractive tubers with good shelf life. It demonstrates moderate resistance to late blight and good tolerance to heat stress during the final growth stages.\n\nKufri Pukhraj has become a dominant variety in Bihar, where it enables early market arrival and commands a price premium during the initial harvest period. The variety is also used in the early-season potato markets of Delhi and Kolkata, where fresh potatoes from the first harvest attract premium prices.',
        characteristics: {
          color: 'Golden yellow skin, light yellow flesh',
          shape: 'Oval',
          averageSize: '6–9 cm length',
          taste: 'Mild, slightly waxy texture',
          aroma: 'Mild earthy aroma',
          storage: '5–7 months at 2–4°C cold storage',
        },
        applications: [
          'Early-harvest premium market supply in eastern India',
          'Short-season potato cultivation in warm-winter zones',
          'Early-season price advantage in wholesale markets',
        ],
        shelfLife: '5–7 months (cold storage)',
        exportSuitability:
          'Moderate — suitable for early-season fresh potato exports where quick market entry is advantageous.',
      },
      {
        name: 'Pusa Chipsona 3',
        slug: 'pusa-chipsona-3',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Chipsona 3 Potato French Fry Cuts]',
        overview:
          'Pusa Chipsona 3 is an advanced processing-grade potato variety developed by IARI, New Delhi, specifically optimized for French fry production. While India\'s potato processing sector was historically dominated by chip varieties, the rapid expansion of international quick-service restaurant chains created demand for locally grown fry-grade potatoes.\n\nThe variety produces large, elongated oval tubers with light skin and creamy white flesh. Pusa Chipsona 3 is engineered for high dry matter content (20–21%), low reducing sugars, and a long tuber shape suitable for producing long French fry strips. These processing attributes match the specifications required by major international fast-food chains.\n\nPusa Chipsona 3 is cultivated under contract farming programs with frozen fry manufacturers in Punjab, Gujarat, and Madhya Pradesh. The variety represents India\'s progressing self-reliance in fry-grade potato production, reducing the need for imported raw material and supporting the country\'s growing food service sector.',
        characteristics: {
          color: 'Light buff skin, creamy white flesh',
          shape: 'Long oval to elongated',
          averageSize: '8–14 cm length',
          taste: 'Neutral flavor ideal for seasoned fry applications',
          aroma: 'Low aroma, clean processing profile',
          storage: '6–8 months at 3–4°C (with sugar management)',
        },
        applications: [
          'French fry and frozen potato product manufacturing',
          'Contract farming for QSR supply chain',
          'Long-fry-cut processing-grade potato production',
        ],
        shelfLife: '6–8 months (cold storage)',
        exportSuitability:
          'High — meets fry-grade specifications for international QSR standards, suitable for export to frozen fry manufacturers.',
      },
    ],
  },
  {
    id: 'cauliflower',
    name: 'Cauliflower',
    slug: 'cauliflower',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/cauliflower/cauliflower_1.jpg',
    overview:
      'Cauliflower is a premium cool-season vegetable crop that holds a significant position in India\'s fresh vegetable sector. India is among the world\'s largest cauliflower producers, with cultivation concentrated in the northern plains, hills, and parts of peninsular India during the winter months. The crop\'s white, compact curds are a staple in North Indian cuisine and an increasingly popular ingredient in global health-conscious and low-carbohydrate diets.\n\nIndian cauliflower breeding programs at IARI and ICAR-IIHR have developed varieties specifically adapted to Indian agro-climatic conditions, including early, mid-season, and late maturity types that ensure extended market availability from September through March. This varietal range enables continuous supply to major urban markets and export channels.\n\nThe cauliflower export market from India has grown steadily, with shipments to the Middle East, Southeast Asia, and Europe. Indian cauliflower is particularly valued in Gulf countries during the winter season when it provides a premium fresh vegetable option. Organised retail chains in India have also expanded cauliflower procurement, offering pre-trimmed and packaged curds to urban consumers.',
    keyBenefits: [
      'Premium cool-season vegetable commanding attractive market prices',
      'Extended harvest window from September to March through maturity groups',
      'High per-hectare economic returns compared to most vegetable crops',
      'Rich in glucosinolates, vitamin C, and dietary fiber',
      'Versatile culinary applications across Indian and international cuisines',
      'Growing export and organised retail demand for quality curds',
    ],
    growingRegions: [
      'Uttar Pradesh',
      'Bihar',
      'West Bengal',
      'Punjab',
      'Haryana',
    ],
    harvestSeason: 'September to March (winter season)',
    exportAvailability:
      'Exported by air and sea to the Middle East, Southeast Asia, and Europe during the October to February harvest window. Pre-packed and trimmed curds are shipped to premium retail outlets in Gulf countries.',
    storageInfo:
      'Cauliflower curds are highly perishable and require cold storage at 0–2°C with 95–98% relative humidity. Under optimal conditions, trimmed curds maintain quality for 2–3 weeks. Pre-cooling immediately after harvest is critical to extend shelf life. MAP packaging can extend shelf life to 3–4 weeks.',
    nutritionalHighlights: [
      'Vitamin C: 48–50 mg per 100 g (exceptionally high)',
      'Dietary fiber: 2–3 g per 100 g',
      'Glucosinolates (glucoraphanin) with cancer-preventive properties',
      'Vitamin K: 15–20 μg per 100 g',
      'Folate: 55–60 μg per 100 g',
      'Low calorie density at approximately 25 kcal per 100 g',
    ],
    marketApplications: [
      'Fresh curd for household cooking and restaurant supply',
      'Pre-trimmed and packaged curds for organised retail',
      'Export-grade wrapped curds for international air freight',
      'Cauliflower rice and florets for health food processing',
      'Pickled and fermented cauliflower products',
      'Frozen florets for food service and industrial use',
    ],
    varieties: [
      {
        name: 'Pusa Snowball',
        slug: 'pusa-snowball',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Snowball Cauliflower Curd Close-Up]',
        overview:
          'Pusa Snowball is a mid-season cauliflower variety developed by IARI, New Delhi, and is one of the most widely recognized cauliflower varieties in Indian markets. It produces dense, compact, snow-white curds that meet the quality expectations of both traditional markets and modern retail buyers.\n\nThe variety matures in 75–85 days from transplanting and produces medium to large, spherical curds with tight, well-protected leaf wrapper that prevents yellowing and maintains curd whiteness. Pusa Snowball demonstrates good field tolerance to black rot and moderate resistance to downy mildew. Its consistent curd quality across diverse growing conditions has made it a farmer favorite.\n\nPusa Snowball dominates the Delhi, Lucknow, and Patna wholesale cauliflower markets during the peak winter season. Its attractive white curds, firm texture, and excellent shelf life make it a preferred variety for both domestic retail and export grading.',
        characteristics: {
          color: 'Snow-white',
          shape: 'Spherical to slightly dome-shaped',
          averageSize: '12–18 cm diameter',
          taste: 'Mild, slightly sweet with nutty notes when cooked',
          aroma: 'Subtle, fresh cruciferous aroma',
          storage: '2–3 weeks at 0–2°C',
        },
        applications: [
          'Premium white curd for organised retail and export',
          'Peak-season wholesale market supply in northern India',
          'High-quality curd for pre-packed supermarket presentation',
        ],
        shelfLife: '2–3 weeks (cold storage)',
        exportSuitability:
          'High — snow-white compact curds with good wrapper leaves meet export quality standards for Gulf and Southeast Asian markets.',
      },
      {
        name: 'Arka Kshitij',
        slug: 'arka-kshitij',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Arka Kshitij Cauliflower Market Display]',
        overview:
          'Arka Kshitij is a cauliflower variety developed by ICAR-IIHR, Bengaluru, specifically adapted to the warmer winter conditions of peninsular India. Unlike northern varieties that require a pronounced cold period for proper curd formation, Arka Kshitij performs reliably in the moderate temperatures of Karnataka, Maharashtra, and Tamil Nadu.\n\nThe variety produces medium-sized, compact white curds with good self-blanching characteristics that maintain curd whiteness even under relatively warm conditions. Arka Kshitij matures in 65–75 days and demonstrates good tolerance to heat stress during curd development and moderate resistance to black rot.\n\nArka Kshitij has become the leading cauliflower variety in southern Indian markets, supplying Bengaluru, Chennai, and Hyderabad during the winter season. Its adaptability to non-traditional cauliflower-growing zones has expanded the crop\'s cultivation area and market availability in peninsular India.',
        characteristics: {
          color: 'White with good self-blanching',
          shape: 'Compact spherical',
          averageSize: '10–14 cm diameter',
          taste: 'Mild, tender with pleasant flavor',
          aroma: 'Light, fresh aroma',
          storage: '2–3 weeks at 0–2°C',
        },
        applications: [
          'Peninsular Indian cauliflower cultivation and market supply',
          'Warm-winter adaptation for southern and western India',
          'Extended cauliflower availability in non-traditional zones',
        ],
        shelfLife: '2–3 weeks (cold storage)',
        exportSuitability:
          'Moderate — reliable quality for regional exports within South Asia and to Gulf markets.',
      },
      {
        name: 'NS 60',
        slug: 'ns-60',
        imagePlaceholder: '[IMAGE PLACEHOLDER: NS 60 Cauliflower Harvested Crates]',
        overview:
          'NS 60 is a late-season cauliflower variety developed for the extended harvest window that runs from January through March in northern India. This late maturity is strategically important as it provides fresh cauliflower supply during the period when mid-season varieties have completed their harvest and market prices tend to rise.\n\nThe variety produces large, dense, white curds with excellent firmness and wrapper leaf protection. NS 60 matures in 90–100 days and is specifically bred to perform under the shorter day lengths and cooler conditions of late winter. It demonstrates good tolerance to low-temperature injury and produces uniform curds even under variable weather conditions.\n\nNS 60 is a commercially important variety for farmers targeting the premium late-winter market in northern India. The variety\'s large curd size and excellent quality command strong prices in Delhi, Chandigarh, and Jaipur markets during February and March.',
        characteristics: {
          color: 'Pure white',
          shape: 'Large spherical to dome-shaped',
          averageSize: '15–20 cm diameter',
          taste: 'Sweet, nutty flavor with excellent cooked texture',
          aroma: 'Mild cruciferous aroma',
          storage: '2–3 weeks at 0–2°C',
        },
        applications: [
          'Late-season premium cauliflower for high-price winter market',
          'Large curd production for wholesale and export grading',
          'Strategic late-winter supply in northern India',
        ],
        shelfLife: '2–3 weeks (cold storage)',
        exportSuitability:
          'Moderate to high — large, firm curds well-suited for export markets during the late winter supply window.',
      },
      {
        name: 'Pusa Katki',
        slug: 'pusa-katki',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Katki Early Cauliflower Field View]',
        overview:
          'Pusa Katki is an early-maturing cauliflower variety developed by IARI specifically for early market arrival in the cauliflower season. As one of the first cauliflower varieties to reach harvest, it provides farmers with a significant price advantage by supplying fresh curds when market supply is limited and prices are at their seasonal peak.\n\nThe variety matures in 55–65 days from transplanting and produces medium-sized, compact white curds with good marketable appearance. Pusa Katki is adapted to the early-autumn growing conditions of northern India and demonstrates tolerance to warmer-than-optimal temperatures during early season cultivation. Its relatively quick maturity allows for flexible planting schedules.\n\nPusa Katki is widely grown in Uttar Pradesh, Bihar, and Punjab for early-season cauliflower markets. The variety is particularly valued by progressive farmers who strategically time their harvest to capture premium early-season prices before the main cauliflower harvest floods the market.',
        characteristics: {
          color: 'White to creamy white',
          shape: 'Compact spherical',
          averageSize: '10–15 cm diameter',
          taste: 'Tender, mild flavor ideal for quick cooking',
          aroma: 'Fresh, delicate aroma',
          storage: '1–2 weeks at 0–2°C',
        },
        applications: [
          'Early-season premium cauliflower for price advantage',
          'Quick-maturity catch crop in intensive vegetable systems',
          'Early autumn market supply in northern India',
        ],
        shelfLife: '1–2 weeks (cold storage)',
        exportSuitability:
          'Moderate — primarily suited for domestic early-season premium markets rather than long-distance export.',
      },
      {
        name: 'Swati',
        slug: 'swati',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Swati Cauliflower Tight Curd Detail]',
        overview:
          'Swati is a popular mid-season cauliflower variety recognized for its uniform curd quality, reliable yield, and excellent market acceptance across India\'s diverse cauliflower-growing regions. It is a versatile variety that performs well across a range of planting dates and growing conditions.\n\nThe variety produces medium to large, compact white curds with tight curd structure and good self-blanching wrapper leaves. Swati matures in 70–80 days and demonstrates good tolerance to major cauliflower diseases including black rot and downy mildew. Its consistent curd quality across different growing conditions makes it a low-risk choice for commercial cauliflower farmers.\n\nSwati is cultivated extensively in West Bengal, Bihar, and Uttar Pradesh, where it supplies both the domestic fresh market and export grading operations. The variety\'s uniformity and reliability have made it a preferred choice for contract farming programs with organised retail buyers.',
        characteristics: {
          color: 'White',
          shape: 'Compact spherical',
          averageSize: '12–16 cm diameter',
          taste: 'Mild, pleasant with tender texture',
          aroma: 'Light fresh aroma',
          storage: '2–3 weeks at 0–2°C',
        },
        applications: [
          'Contract farming for organised retail cauliflower supply',
          'Multi-region commercial cultivation with reliable quality',
          'Export-grade curd production for Gulf markets',
        ],
        shelfLife: '2–3 weeks (cold storage)',
        exportSuitability:
          'Moderate to high — consistent quality and uniformity meet export grading standards for regional export markets.',
      },
    ],
  },
  {
    id: 'brinjal',
    name: 'Brinjal / Eggplant',
    slug: 'brinjal',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/brinjal/brinjal_1.jpg',
    overview:
      'Brinjal, also known as eggplant or aubergine, is one of India\'s most extensively cultivated vegetable crops, cherished for its culinary versatility and deep roots in regional Indian cuisines. From the smoky baingan bharta of Punjab to the classic begun bhaja of Bengal and the spiced kathirikai kuzhambu of Tamil Nadu, brinjal is woven into the fabric of Indian food culture.\n\nIndia is the world\'s largest brinjal producer, with cultivation spanning all major states and agro-climatic zones. The crop exhibits remarkable diversity in fruit size, shape, and color, ranging from long slender purple types to small round green varieties and large oval white types. Indian agricultural research institutions have developed numerous high-yielding, disease-resistant varieties that maintain the authentic flavor profiles demanded by regional cuisines.\n\nThe brinjal market in India operates year-round, with peak supplies during the cooler months. Organised retail chains and modern food service companies are increasingly sourcing graded, pre-packed brinjal with quality specifications. The export market for Indian brinjal, while smaller than domestic demand, is growing in South Asian and Middle Eastern ethnic food channels.',
    keyBenefits: [
      'Year-round cultivation and market availability across zones',
      'Extremely diverse varietal options for regional culinary preferences',
      'Rich source of dietary fiber, potassium, and nasunin antioxidant',
      'Multiple fruit types — long, round, oval — serving diverse market segments',
      'Relatively short crop duration of 100–130 days',
      'Growing demand in organised retail and food service supply chains',
    ],
    growingRegions: [
      'West Bengal',
      'Odisha',
      'Maharashtra',
      'Karnataka',
      'Bihar',
    ],
    harvestSeason: 'Year-round, with peak harvest from October to March',
    exportAvailability:
      'Exported year-round to South Asian, Middle Eastern, and Southeast Asian markets, primarily serving ethnic Indian cuisine demand. Peak export season aligns with winter harvest. Air freight used for premium shipments.',
    storageInfo:
      'Brinjal is moderately sensitive to chilling injury and should be stored at 10–12°C with 90–95% relative humidity. Storage below 7°C causes surface pitting and discoloration. Under optimal conditions, brinjal maintains marketable quality for 7–10 days. Pre-cooling and MAP packaging can extend shelf life.',
    nutritionalHighlights: [
      'Dietary fiber: 3–3.5 g per 100 g',
      'Potassium: 220–230 mg per 100 g',
      'Nasunin: potent antioxidant in purple-skinned varieties',
      'Low calorie density at approximately 25 kcal per 100 g',
      'Good source of folate and vitamin K',
      'Contains chlorogenic acid with anti-inflammatory properties',
    ],
    marketApplications: [
      'Fresh household cooking across diverse Indian regional cuisines',
      'Restaurant and food service supply for traditional preparations',
      'Pre-packed graded brinjal for organised retail supermarkets',
      'Pickled and fermented brinjal products',
      'Dehydrated brinjal chips and snack food manufacturing',
      'Export to ethnic South Asian food markets worldwide',
    ],
    varieties: [
      {
        name: 'Pusa Purple Long',
        slug: 'pusa-purple-long',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Purple Long Brinjal on Plant]',
        overview:
          'Pusa Purple Long is the most widely recognized brinjal variety in India, producing the characteristic long, slender, deep purple fruits that are ubiquitous in North Indian markets and kitchens. Developed by IARI, this variety has set the standard for the long-brinjal category and remains the dominant variety across northern and central India.\n\nThe variety produces long, cylindrical fruits averaging 20–30 cm in length with a glossy deep purple skin and tender, cream-white flesh. Pusa Purple Long matures in approximately 100–110 days from transplanting and demonstrates moderate resistance to fruit and shoot borer — the most damaging pest of brinjal. Its prolific bearing habit ensures high yields throughout the harvest season.\n\nPusa Purple Long is the standard long brinjal in major wholesale markets including Azadpur (Delhi), Crawford (Mumbai), and Koyambedu (Chennai). Its elongated shape and glossy purple appearance make it visually appealing for retail display, while its tender texture and mild flavor suit the full range of North Indian brinjal preparations.',
        characteristics: {
          color: 'Deep glossy purple',
          shape: 'Long cylindrical',
          averageSize: '20–30 cm length, 3–5 cm diameter',
          taste: 'Mild, creamy texture with delicate flavor',
          aroma: 'Mild, pleasant when cooked',
          storage: '7–10 days at 10–12°C',
        },
        applications: [
          'Standard long brinjal for North Indian household cooking',
          'Wholesale market supply across India\'s major APMC markets',
          'Baingan bharta, curry, and fried brinjal preparations',
        ],
        shelfLife: '7–10 days (refrigerated)',
        exportSuitability:
          'High — iconic Indian long brinjal variety widely recognized in ethnic food export markets.',
      },
      {
        name: 'Arka Sheetal',
        slug: 'arka-sheetal',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Arka Sheetal Brinjal Harvested Bunch]',
        overview:
          'Arka Sheetal is a brinjal variety developed by ICAR-IIHR, Bengaluru, specifically for the southern Indian market. It produces glossy, deep purple, long to medium-long fruits that are preferred in South Indian cuisine, particularly for dishes like kathirikai kuzhambu, ennai kathirikai, and brinjal gotsu.\n\nThe variety matures in 105–115 days and produces fruits with excellent shine, tender flesh, and minimal seed content. Arka Sheetal demonstrates good tolerance to little leaf disease and moderate resistance to fruit borer. Its plant architecture is well-suited to the warm, humid growing conditions of peninsular India.\n\nArka Sheetal is a dominant variety in the Bangalore, Chennai, and Hyderabad brinjal markets. Its consistent quality and regional culinary suitability have made it a preferred choice for both open-market traders and organised retail procurement in southern India.',
        characteristics: {
          color: 'Glossy deep purple',
          shape: 'Long to medium-long',
          averageSize: '15–25 cm length, 3–4 cm diameter',
          taste: 'Tender, mild with slight sweetness',
          aroma: 'Light, pleasant aroma when cooked',
          storage: '7–10 days at 10–12°C',
        },
        applications: [
          'South Indian regional cuisine brinjal supply',
          'Organised retail procurement in southern India',
          'Stuffed and gravy brinjal preparations',
        ],
        shelfLife: '7–10 days (refrigerated)',
        exportSuitability:
          'Moderate to high — well-suited for ethnic South Indian food export channels and South Asian grocery markets.',
      },
      {
        name: 'Pusa Anamika',
        slug: 'pusa-anamika',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Anamika Brinjal Cluster Display]',
        overview:
          'Pusa Anamika is a high-yielding, disease-resistant brinjal variety developed by IARI with an improved pest resistance profile designed to reduce chemical pesticide dependence. It addresses the critical need for sustainable brinjal production in India, where excessive pesticide use on brinjal has been a longstanding concern for food safety.\n\nThe variety produces long, purple fruits with good gloss and firm texture. Pusa Anamika matures in 100–110 days and carries enhanced field tolerance to fruit and shoot borer, the primary pest driving pesticide application in brinjal. Its reduced pesticide requirement makes it attractive for quality-conscious market segments including organised retail and export.\n\nPusa Anamika has gained adoption in northern and central India among farmers supplying quality-focused buyers. The variety\'s combination of pest tolerance and good fruit quality positions it as a forward-looking variety for sustainable brinjal production.',
        characteristics: {
          color: 'Purple with good gloss',
          shape: 'Long cylindrical',
          averageSize: '18–25 cm length, 3–5 cm diameter',
          taste: 'Mild, creamy texture',
          aroma: 'Subtle fresh aroma',
          storage: '7–10 days at 10–12°C',
        },
        applications: [
          'Low-pesticide brinjal for quality-conscious retail markets',
          'Sustainable pest management systems in brinjal cultivation',
          'Export-grade brinjal meeting residue safety standards',
        ],
        shelfLife: '7–10 days (refrigerated)',
        exportSuitability:
          'High — reduced pesticide profile meets stringent residue limits for premium export markets in the Middle East and Europe.',
      },
      {
        name: 'Mattu Gulla',
        slug: 'mattu-gulla',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Mattu Gulla Brinjal Traditional Variety]',
        overview:
          'Mattu Gulla is a traditional, heirloom brinjal variety from the Udupi region of coastal Karnataka, prized for its unique flavor, tender texture, and cultural significance. It holds a Geographical Indication (GI) tag recognizing its distinct identity and the traditional farming practices associated with its cultivation.\n\nThe variety produces small to medium, round to oval fruits with a distinctive light green to pale purple color and exceptionally tender, nearly seedless flesh. Mattu Gulla has a naturally mild, sweet flavor with no bitterness — a characteristic attributed to the specific soil and microclimate of the Mattu village area near Udupi.\n\nMattu Gulla is a premium niche variety used in the iconic Udupi-Mangalorean preparation of gulla masala and various temple prasadam dishes. Its GI-tagged status and limited production volume command a significant price premium in Karnataka\'s specialty markets and among discerning consumers who value authenticity and provenance.',
        characteristics: {
          color: 'Light green to pale purple',
          shape: 'Round to slightly oval',
          averageSize: '5–8 cm diameter',
          taste: 'Exceptionally mild, sweet, with no bitterness',
          aroma: 'Delicate, subtle aroma',
          storage: '5–7 days at 10–12°C',
        },
        applications: [
          'Premium GI-tagged brinjal for specialty and gourmet markets',
          'Udupi-Mangalorean regional cuisine and temple cooking',
          'Heritage and provenance-based food product branding',
        ],
        shelfLife: '5–7 days (refrigerated)',
        exportSuitability:
          'Low to moderate — primarily a niche domestic variety, though GI-tagged status offers potential for specialty ethnic food exports.',
      },
      {
        name: 'Banarasi Giant',
        slug: 'banarasi-giant',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Banarasi Giant Brinjal Large Fruit]',
        overview:
          'Banarasi Giant is a traditional brinjal variety from the Varanasi region of eastern Uttar Pradesh, known for its exceptionally large, round fruits. This heritage variety represents the distinctive large-brinjal type that is preferred in eastern Indian markets and certain specialized culinary applications where large fruit size is valued.\n\nThe variety produces very large, round to oval fruits that can weigh 500 g or more, with a glossy purple skin and dense, firm flesh. Banarasi Giant matures in 110–120 days and produces fewer but significantly larger fruits per plant compared to long-brinjal varieties. Its thick flesh makes it particularly suitable for grilling, roasting, and stuffed brinjal preparations.\n\nBanarasi Giant is a recognized name in the brinjal markets of Varanasi, Lucknow, and Patna. Its impressive fruit size and visual appeal make it a favorite for display in traditional markets and for specialty preparations like bharwan baingan, where the large fruit provides an ideal vessel for spiced stuffing.',
        characteristics: {
          color: 'Glossy deep purple',
          shape: 'Large round to oval',
          averageSize: '12–18 cm diameter, 500 g+ weight',
          taste: 'Rich, meaty texture with robust flavor',
          aroma: 'Pronounced earthy aroma when cooked',
          storage: '7–10 days at 10–12°C',
        },
        applications: [
          'Stuffed brinjal (bharwan baingan) specialty preparation',
          'Grilled and roasted brinjal applications',
          'Large-fruit display variety for traditional market appeal',
        ],
        shelfLife: '7–10 days (refrigerated)',
        exportSuitability:
          'Moderate — distinctive large-fruit type appealing for specialty ethnic food exports and restaurant supply in the Gulf.',
      },
    ],
  },
  {
    id: 'okra',
    name: 'Okra / Bhindi',
    slug: 'okra',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/okra/okra_1.jpg',
    overview:
      'Okra, universally known as bhindi in India, is one of the country\'s most commercially significant vegetable crops, with near-universal household consumption across all regions. India is the world\'s largest okra producer, cultivating the crop across diverse agro-climatic zones that enable year-round production and supply.\n\nThe crop\'s relatively short duration of 50–65 days and high yield potential make it attractive for farmers seeking quick returns. Indian okra breeding programs at IARI, ICAR-IIHR, and state universities have developed high-yielding, virus-resistant varieties that produce tender, dark green pods meeting the quality expectations of both traditional and modern market channels. The crop is also increasingly cultivated under protected cultivation for premium export-grade okra.\n\nIndian okra has established a strong export presence, particularly in markets serving South Asian diaspora communities where bhindi is a dietary staple. Premium tender okra meeting strict length and tenderness specifications is exported by air to the Middle East, UK, USA, and Southeast Asia, with well-developed grading and cold chain infrastructure at major production hubs.',
    keyBenefits: [
      'Year-round production with consistent market demand across all regions',
      'Short crop duration of 50–65 days enables rapid farm income generation',
      'High-yielding virus-resistant varieties ensure production reliability',
      'Strong export demand for premium-grade tender okra',
      'Rich in dietary fiber, folate, and mucilage beneficial for digestion',
      'Growing protected cultivation for export-quality production',
    ],
    growingRegions: [
      'Andhra Pradesh',
      'Gujarat',
      'Madhya Pradesh',
      'Maharashtra',
      'West Bengal',
    ],
    harvestSeason: 'Year-round, with peak harvest from July to October (kharif) and February to April (summer)',
    exportAvailability:
      'Exported year-round by air to the Middle East, UK, USA, Canada, and Southeast Asia. Premium grade okra meeting length (7–12 cm) and tenderness specifications commands attractive prices. Peak export shipments align with summer and kharif harvest seasons.',
    storageInfo:
      'Okra is highly perishable and sensitive to chilling injury. Store at 7–10°C with 90–95% relative humidity. Storage below 5°C causes surface pitting and discoloration within days. Under optimal conditions, okra maintains quality for 5–7 days. Pre-cooling and high-humidity packaging are critical for shelf life extension.',
    nutritionalHighlights: [
      'Dietary fiber: 3–3.5 g per 100 g',
      'Folate: 60–80 μg per 100 g',
      'Vitamin C: 21–23 mg per 100 g',
      'Vitamin K: 30–50 μg per 100 g',
      'Rich in mucilage polysaccharides supporting digestive health',
      'Good source of magnesium and calcium',
    ],
    marketApplications: [
      'Fresh household cooking for daily vegetable preparation across India',
      'Restaurant and food service supply for curries and stir-fries',
      'Export-grade premium tender okra for international air freight',
      'Dehydrated okra chips and snack food manufacturing',
      'Frozen cut okra for convenience food products',
      'Pickled okra for condiment and specialty food markets',
    ],
    varieties: [
      {
        name: 'Pusa A-4',
        slug: 'pusa-a-4',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa A-4 Okra Tender Green Pods]',
        overview:
          'Pusa A-4 is a landmark okra variety developed by IARI, New Delhi, and remains one of the most extensively cultivated okra varieties in India. It has set the standard for the tender, dark green okra type preferred in both domestic and international markets, with a legacy spanning decades of reliable performance.\n\nThe variety produces dark green, tender, five-ridged pods averaging 12–15 cm in length. Pusa A-4 matures in approximately 50–55 days from sowing and demonstrates good tolerance to yellow vein mosaic virus — the most devastating disease of okra in India. Its prolific pod-bearing habit ensures extended harvest periods with consistent pod quality.\n\nPusa A-4 is the benchmark variety for okra quality in Indian markets. Its pods are crisp, tender, and free from excessive fiber even at larger sizes, making it suitable for both household cooking and export grading. The variety is widely adopted in northern, central, and western India.',
        characteristics: {
          color: 'Dark green',
          shape: 'Long, cylindrical with five ridges',
          averageSize: '12–15 cm length',
          taste: 'Tender, mild flavor with minimal fiber',
          aroma: 'Fresh, mild green aroma',
          storage: '5–7 days at 7–10°C',
        },
        applications: [
          'Standard okra variety for domestic fresh market supply',
          'Export-grade okra meeting international tenderness standards',
          'Multi-region commercial cultivation across India',
        ],
        shelfLife: '5–7 days (refrigerated)',
        exportSuitability:
          'High — benchmark export okra variety with proven market acceptance in Gulf, UK, and Southeast Asian markets.',
      },
      {
        name: 'Arka Anamika',
        slug: 'arka-anamika',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Arka Anamika Okra Field Harvest View]',
        overview:
          'Arka Anamika is a high-yielding okra variety developed by ICAR-IIHR, Bengaluru, specifically for the southern and western Indian okra-growing zones. It combines high yield potential with improved virus resistance and excellent pod quality that meets the standards of both domestic organised retail and export markets.\n\nThe variety produces dark green, tender, five-ridged pods with excellent shelf appearance. Arka Anamika matures in 50–55 days and carries strong field tolerance to yellow vein mosaic virus and okra enation leaf curl virus — two of the most destructive okra diseases. Its plant architecture supports efficient harvesting and good pod visibility.\n\nArka Anamika is a dominant variety in Karnataka, Andhra Pradesh, and Maharashtra, where it supplies both the fresh domestic market and export-oriented grading operations. Its virus resistance package significantly reduces crop protection costs, making it an economically attractive choice for farmers.',
        characteristics: {
          color: 'Dark green',
          shape: 'Long, cylindrical with pronounced ridges',
          averageSize: '12–15 cm length',
          taste: 'Tender, crisp with mild flavor',
          aroma: 'Fresh, pleasant green aroma',
          storage: '5–7 days at 7–10°C',
        },
        applications: [
          'Export-oriented okra cultivation in southern and western India',
          'Organised retail procurement for supermarket chains',
          'Virus-resistant okra production for reduced pesticide residue',
        ],
        shelfLife: '5–7 days (refrigerated)',
        exportSuitability:
          'Very high — excellent virus resistance ensures lower pesticide residues, meeting stringent export market requirements.',
      },
      {
        name: 'Parbhani Kranti',
        slug: 'parbhani-kranti',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Parbhani Kranti Okra Pod Detail]',
        overview:
          'Parbhani Kranti is a pioneering virus-resistant okra variety developed by Marathwada Agricultural University, Parbhani, that revolutionized okra cultivation in India by providing the first effective genetic resistance to yellow vein mosaic virus. This breakthrough variety enabled farmers in virus-endemic zones to cultivate okra profitably.\n\nThe variety produces medium green, tender pods with good marketable appearance. Parbhani Kranti matures in 50–55 days and carries strong resistance to YVMV that remains effective even under high disease pressure. Its reliable performance in virus-prone areas has made it the variety of choice for the Marathwada and Vidarbha regions of Maharashtra.\n\nParbhani Kranti\'s historical significance as India\'s first YVMV-resistant okra variety has earned it enduring farmer recognition. While newer varieties have been released, Parbhani Kranti continues to be cultivated extensively in Maharashtra, Karnataka, and Madhya Pradesh for its proven virus resistance and dependable market quality.',
        characteristics: {
          color: 'Medium to dark green',
          shape: 'Medium-long, cylindrical',
          averageSize: '10–14 cm length',
          taste: 'Tender, mild flavor with good texture',
          aroma: 'Light, fresh green aroma',
          storage: '5–7 days at 7–10°C',
        },
        applications: [
          'Virus-prone zone okra cultivation in Maharashtra and Karnataka',
          'Reliable okra production in YVMV-endemic areas',
          'Export-quality okra from disease-secure production zones',
        ],
        shelfLife: '5–7 days (refrigerated)',
        exportSuitability:
          'Moderate to high — virus resistance translates to quality assurance and reduced chemical inputs for export-grade production.',
      },
      {
        name: 'Pusa Makhmali',
        slug: 'pusa-makhmali',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Makhmali Okra Soft-Tender Pods]',
        overview:
          'Pusa Makhmali is an IARI-developed okra variety bred specifically for exceptional tenderness and fiber-free pod quality. The name "Makhmali" (velvet-like) refers to the variety\'s extraordinarily soft, smooth pod surface and the silky texture of its cooked pods, which are considered among the most tender of all Indian okra varieties.\n\nThe variety produces dark green, smooth pods with minimal ridge prominence, giving them a sleek appearance. Pusa Makhmali matures in 50–55 days and produces pods that remain tender even at 15–18 cm length, a distinctive trait that sets it apart from most other okra varieties which become fibrous at larger sizes. This extended tenderness window provides flexibility in harvest timing.\n\nPusa Makhmali is a premium okra variety favored by quality-conscious buyers and exporters who require consistently tender pods. Its extended tenderness window reduces harvest losses and improves grading efficiency, making it particularly valuable for export-oriented operations.',
        characteristics: {
          color: 'Dark green',
          shape: 'Long, smooth with minimal ridging',
          averageSize: '12–18 cm length',
          taste: 'Exceptionally tender, silky texture with mild flavor',
          aroma: 'Very mild, delicate aroma',
          storage: '5–7 days at 7–10°C',
        },
        applications: [
          'Premium export-grade okra for international markets',
          'High-end restaurant and hospitality supply',
          'Quality-focused organised retail procurement',
        ],
        shelfLife: '5–7 days (refrigerated)',
        exportSuitability:
          'Very high — exceptional tenderness and extended harvest window make it ideal for premium export specifications.',
      },
      {
        name: 'Varsha Uphar',
        slug: 'varsha-uphar',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Varsha Uphar Okra Monsoon Season Pods]',
        overview:
          'Varsha Uphar is an okra variety specifically developed for cultivation during the monsoon (kharif) season, when high humidity and disease pressure make okra production particularly challenging. The variety\'s name translates to "monsoon gift," reflecting its ability to deliver reliable yields during the difficult rainy season.\n\nThe variety produces medium green, tender pods with good marketable quality even under humid, overcast conditions. Varsha Uphar matures in 55–60 days and demonstrates strong tolerance to both yellow vein mosaic virus and Cercospora leaf spot, which are prevalent during the monsoon. Its robust plant architecture withstands wind and water stress common in kharif cultivation.\n\nVarsha Uphar is a strategic variety for kharif okra cultivation in Gujarat, Maharashtra, and Madhya Pradesh, where it ensures continuous okra supply during the monsoon months when domestic prices are typically at their seasonal peak. Its reliability under adverse weather conditions makes it a risk-mitigating choice for commercial okra farmers.',
        characteristics: {
          color: 'Medium green',
          shape: 'Medium-long, cylindrical',
          averageSize: '10–14 cm length',
          taste: 'Tender, pleasant flavor',
          aroma: 'Fresh, characteristic okra aroma',
          storage: '5–7 days at 7–10°C',
        },
        applications: [
          'Kharif season okra cultivation during monsoon period',
          'High-humidity tolerant variety for reliable rainy season production',
          'Premium-price monsoon okra for peak-season market advantage',
        ],
        shelfLife: '5–7 days (refrigerated)',
        exportSuitability:
          'Moderate — reliable kharif production for domestic premium markets with limited export suitability due to seasonal quality variability.',
      },
    ],
  },
  {
    id: 'capsicum',
    name: 'Capsicum / Bell Pepper',
    slug: 'capsicum',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/capsicum/capsicum_1.jpg',
    overview:
      'Capsicum, known as bell pepper in international markets and shimla mirch in northern India, is a premium vegetable crop with rapidly growing demand in India\'s organised retail and food service sectors. The crop produces large, blocky, thick-fleshed fruits in a range of colors — green, red, yellow, and orange — that are valued equally for their culinary versatility and visual appeal.\n\nIndia\'s capsicum production has expanded significantly with the adoption of greenhouse and polyhouse cultivation, which enables year-round production of premium-quality fruits meeting international grading standards. Traditional open-field cultivation continues to serve the domestic mass market, while protected cultivation targets the export and organised retail segments. Major production hubs include Karnataka, Maharashtra, and Himachal Pradesh.\n\nIndian capsicum exports have grown substantially, with greenhouse-grown colored bell peppers commanding premium prices in the Middle East, Southeast Asia, and Europe. The crop\'s high per-unit economic value and relatively short crop duration of 90–120 days make it attractive for protected cultivation entrepreneurs and export-oriented farmers.',
    keyBenefits: [
      'High-value premium vegetable with attractive per-unit pricing',
      'Greenhouse and polyhouse cultivation enables year-round premium production',
      'Multiple color variants (green, red, yellow, orange) for market differentiation',
      'Rich in vitamin C, beta-carotene, and capsaicinoid antioxidants',
      'Strong export demand for colored bell peppers in premium markets',
      'Versatile in culinary applications from salads to stir-fries to stuffed preparations',
    ],
    growingRegions: [
      'Karnataka',
      'Maharashtra',
      'Himachal Pradesh',
      'Uttarakhand',
      'Tamil Nadu',
    ],
    harvestSeason: 'Year-round (greenhouse), with peak open-field harvest from October to March',
    exportAvailability:
      'Exported year-round by air to the Middle East, Southeast Asia, and Europe. Premium colored bell peppers from greenhouse production are the primary export grade. Air freight ensures quality preservation for this perishable commodity.',
    storageInfo:
      'Capsicum is chilling-sensitive and should be stored at 7–10°C with 90–95% relative humidity. Storage below 5°C causes chilling injury and surface pitting. Green capsicum has a slightly longer shelf life than colored types. Under optimal conditions, quality is maintained for 10–14 days. MAP packaging can extend shelf life to 2–3 weeks.',
    nutritionalHighlights: [
      'Vitamin C: 80–130 mg per 100 g (red pepper highest)',
      'Beta-carotene: 1,600–3,500 μg per 100 g (red and orange types)',
      'Dietary fiber: 2–2.5 g per 100 g',
      'Vitamin B6: 0.2–0.3 mg per 100 g',
      'Capsaicinoids with metabolism-boosting and anti-inflammatory properties',
      'Low calorie density at approximately 26 kcal per 100 g',
    ],
    marketApplications: [
      'Fresh salad and crudité ingredient for premium food service',
      'Stir-fry, pizza topping, and multi-cuisine restaurant ingredient',
      'Export-grade colored bell pepper for international markets',
      'Pre-cut and packaged pepper strips for convenience retail',
      'Roasted and grilled pepper for gourmet food manufacturing',
      'Frozen diced pepper for industrial food production',
    ],
    varieties: [
      {
        name: 'California Wonder',
        slug: 'california-wonder',
        imagePlaceholder: '[IMAGE PLACEHOLDER: California Wonder Capsicum Green Bell]',
        overview:
          'California Wonder is the most globally recognized bell pepper variety and has been extensively adopted in Indian greenhouse and open-field capsicum cultivation. Its large, blocky, four-lobed fruits with thick flesh set the standard for premium bell pepper quality that is expected in both domestic and international markets.\n\nThe variety produces large, blocky fruits that mature from green to red, with a thick, crisp flesh and mild, sweet flavor. California Wonder matures in approximately 90–100 days from transplanting and is well-adapted to protected cultivation systems including polyhouses and net houses. Its fruit quality consistently meets the grading specifications of major organised retail chains.\n\nCalifornia Wonder is widely cultivated in Karnataka\'s greenhouse belt and Maharashtra\'s polyhouse clusters, where it serves both the domestic premium market and export operations. The variety\'s global recognition provides brand confidence to international buyers sourcing Indian capsicum.',
        characteristics: {
          color: 'Green maturing to red',
          shape: 'Large blocky, four-lobed',
          averageSize: '8–12 cm length, 7–10 cm width',
          taste: 'Sweet, mild, and crisp with thick juicy flesh',
          aroma: 'Fresh, sweet bell pepper aroma',
          storage: '10–14 days at 7–10°C',
        },
        applications: [
          'Premium greenhouse bell pepper for export markets',
          'Organised retail supply in supermarket chains',
          'Multi-cuisine restaurant and food service ingredient',
        ],
        shelfLife: '10–14 days (refrigerated)',
        exportSuitability:
          'Very high — globally recognized variety with proven export market acceptance across Middle East, Europe, and Asia.',
      },
      {
        name: 'Yolo Wonder',
        slug: 'yolo-wonder',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Yolo Wonder Capsicum Ripe Red Bell]',
        overview:
          'Yolo Wonder is a high-yielding bell pepper variety derived from the California Wonder lineage, selected for improved yield performance, disease resistance, and consistent fruit quality under commercial growing conditions. It has become a preferred variety for large-scale capsicum operations in India.\n\nThe variety produces large, blocky, four-lobed fruits similar to California Wonder but with enhanced plant vigor and higher total yield per unit area. Yolo Wonder matures in 90–100 days and demonstrates good tolerance to Tobacco Mosaic Virus and bacterial leaf spot. Its fruit set is consistent even under moderate temperature stress.\n\nYolo Wonder is extensively cultivated in the protected cultivation zones of Karnataka, Maharashtra, and Uttarakhand. The variety\'s combination of high yield and consistent quality makes it economically attractive for commercial greenhouse operations targeting both domestic premium retail and export channels.',
        characteristics: {
          color: 'Dark green maturing to bright red',
          shape: 'Blocky, four-lobed',
          averageSize: '8–11 cm length, 7–10 cm width',
          taste: 'Sweet and mild with crisp texture',
          aroma: 'Fresh bell pepper aroma',
          storage: '10–14 days at 7–10°C',
        },
        applications: [
          'High-yield commercial greenhouse capsicum production',
          'Bulk export-grade bell pepper supply',
          'Organised retail and food service dual-market supply',
        ],
        shelfLife: '10–14 days (refrigerated)',
        exportSuitability:
          'Very high — high yield with consistent export-grade quality makes it a preferred variety for commercial export operations.',
      },
      {
        name: 'Arka Mohini',
        slug: 'arka-mohini',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Arka Mohini Capsicum Greenhouse Grown]',
        overview:
          'Arka Mohini is an ICAR-IIHR-developed capsicum variety specifically bred for Indian protected cultivation conditions. It is designed to deliver the large, blocky fruit type demanded by modern retail markets while being adapted to the specific environmental conditions and management practices prevalent in Indian polyhouse and greenhouse operations.\n\nThe variety produces medium to large, blocky fruits with thick, crisp flesh and an attractive glossy appearance. Arka Mohini matures in 85–95 days and demonstrates good tolerance to major capsicum diseases common in protected cultivation, including Phytophthora blight and powdery mildew. Its plant architecture is optimized for vertical training systems used in Indian greenhouse operations.\n\nArka Mohini has gained popularity among protected cultivation farmers in Karnataka, Tamil Nadu, and Maharashtra who supply organised retail chains. The variety\'s adaptation to Indian greenhouse conditions translates to more consistent fruit quality and lower crop management costs compared to imported varieties.',
        characteristics: {
          color: 'Green with glossy finish',
          shape: 'Blocky, slightly elongated',
          averageSize: '8–12 cm length, 6–9 cm width',
          taste: 'Sweet, crisp with thick-walled flesh',
          aroma: 'Pleasant fresh capsicum aroma',
          storage: '10–14 days at 7–10°C',
        },
        applications: [
          'Indian greenhouse and polyhouse capsicum cultivation',
          'Domestic organised retail supply chains',
          'Quality-focused commercial capsicum production',
        ],
        shelfLife: '10–14 days (refrigerated)',
        exportSuitability:
          'High — consistent quality from Indian protected cultivation systems meets export market requirements.',
      },
      {
        name: 'Pusa Jwala',
        slug: 'pusa-jwala',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Jwala Capsicum Open Field Blocky]',
        overview:
          'Pusa Jwala is an IARI-developed capsicum variety designed primarily for open-field cultivation, providing a cost-effective production option for farmers who do not have access to protected cultivation infrastructure. The variety delivers good fruit quality at a fraction of the production cost of greenhouse-grown capsicum.\n\nThe variety produces medium to large, blocky green fruits with firm flesh and good culinary quality. Pusa Jwala matures in 85–95 days and demonstrates good heat tolerance and moderate resistance to major capsicum diseases. It is well-adapted to the winter cultivation window in northern and central India, where cool, dry conditions favor capsicum fruit development.\n\nPusa Jwala is widely cultivated in Uttar Pradesh, Madhya Pradesh, and Maharashtra for the domestic fresh market. While its fruit size and uniformity may not match greenhouse-produced capsicum, its lower production cost makes it the variety of choice for the mass-market domestic segment where affordability is paramount.',
        characteristics: {
          color: 'Green',
          shape: 'Medium blocky',
          averageSize: '7–10 cm length, 5–8 cm width',
          taste: 'Mildly sweet with firm texture',
          aroma: 'Standard capsicum aroma',
          storage: '8–12 days at 7–10°C',
        },
        applications: [
          'Open-field commercial capsicum for domestic mass market',
          'Cost-effective bell pepper production without greenhouse investment',
          'Household vegetable market supply in northern India',
        ],
        shelfLife: '8–12 days (refrigerated)',
        exportSuitability:
          'Moderate — suitable for domestic and regional export markets where competitive pricing is prioritized over premium presentation.',
      },
      {
        name: 'Indam 5',
        slug: 'indam-5',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Indam 5 Capsicum Mixed Color Harvest]',
        overview:
          'Indam 5 is a commercial capsicum variety developed through private sector breeding, optimized for high yield and uniform fruit quality in Indian commercial cultivation systems. It represents the growing role of private seed companies in India\'s vegetable improvement sector and has achieved wide adoption among progressive capsicum farmers.\n\nThe variety produces large, blocky fruits with thick flesh and an attractive glossy finish. Indam 5 is marketed as a multi-color variety, with fruits maturing through green, yellow, and red stages, providing farmers with color differentiation options for market segmentation. It matures in 85–95 days and demonstrates good plant vigor and fruit set under commercial growing conditions.\n\nIndam 5 is widely adopted in the commercial greenhouse clusters of Karnataka, Andhra Pradesh, and Maharashtra, where it supplies both the domestic organized retail market and export-oriented operations. The variety\'s multi-color capability allows farmers to target the premium colored capsicum segment without maintaining separate variety plantings.',
        characteristics: {
          color: 'Green maturing to yellow and red',
          shape: 'Large blocky, four-lobed',
          averageSize: '8–12 cm length, 7–10 cm width',
          taste: 'Sweet, crisp with juicy flesh',
          aroma: 'Fresh, pleasant bell pepper aroma',
          storage: '10–14 days at 7–10°C',
        },
        applications: [
          'Multi-color capsicum production for premium retail differentiation',
          'Commercial greenhouse cultivation for export and domestic markets',
          'Color-segmented marketing for value-added capsicum sales',
        ],
        shelfLife: '10–14 days (refrigerated)',
        exportSuitability:
          'High — multi-color capability and consistent fruit quality make it suitable for premium export market requirements.',
      },
    ],
  },
  {
    id: 'green-chillies',
    name: 'Green Chillies',
    slug: 'green-chillies',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/green-chillies/green-chillies_1.jpg',
    overview:
      'Green chillies are arguably the most essential fresh vegetable in Indian cuisine, present in virtually every savory preparation across the country\'s extraordinarily diverse regional food traditions. India is the world\'s largest producer and consumer of green chillies, with the crop cultivated in every state and available in markets throughout the year.\n\nThe Indian green chilli sector encompasses an impressive diversity of varieties, from the intensely pungent small chillies favored in eastern India to the large, mild, fleshy types preferred in Kashmir and certain western Indian preparations. Agricultural research institutions and private seed companies have developed numerous high-yielding, virus-resistant varieties that maintain the pungency levels and flavor profiles demanded by regional culinary traditions.\n\nGreen chillies are among the most traded fresh vegetables in India, with significant inter-state movement to balance regional supply and demand. The export market for Indian green chillies is growing, driven by South Asian diaspora communities worldwide and the increasing global popularity of Indian cuisine. Premium graded green chillies meeting export specifications are shipped by air to the Middle East, Southeast Asia, Europe, and North America.',
    keyBenefits: [
      'Essential daily-use commodity with uninterrupted year-round demand',
      'High per-unit market value compared to most fresh vegetables',
      'Diverse varietal options spanning pungency levels and fruit types',
      'Rich source of capsaicin with proven metabolism-boosting properties',
      'High vitamin C content — among the highest in fresh vegetables',
      'Strong export demand from South Asian diaspora markets worldwide',
    ],
    growingRegions: [
      'Andhra Pradesh',
      'Karnataka',
      'Madhya Pradesh',
      'Maharashtra',
      'Tamil Nadu',
    ],
    harvestSeason: 'Year-round, with peak harvest from July to October (kharif) and February to April (summer)',
    exportAvailability:
      'Exported year-round by air to the Middle East, UK, USA, Canada, Southeast Asia, and Europe. Peak export season is November to February. Both loose and bunch-packed green chillies are exported, with premium grades meeting strict size, pungency, and color specifications.',
    storageInfo:
      'Green chillies are highly perishable and lose quality rapidly at ambient temperature. Store at 7–10°C with 90–95% relative humidity. Storage below 5°C causes chilling injury and tissue softening. Under optimal conditions, green chillies maintain quality for 7–10 days. Rapid pre-cooling after harvest is essential for shelf life preservation.',
    nutritionalHighlights: [
      'Vitamin C: 120–240 mg per 100 g (exceptionally high)',
      'Capsaicin: variable by variety, responsible for pungency and health benefits',
      'Vitamin A: 500–1,000 IU per 100 g (beta-carotene)',
      'Dietary fiber: 2–2.5 g per 100 g',
      'Rich in B-complex vitamins including B6 and folate',
      'Contains anti-inflammatory capsaicinoids and antioxidants',
    ],
    marketApplications: [
      'Fresh household cooking ingredient across all Indian cuisines',
      'Restaurant and food service — garnish, tempering, and base ingredient',
      'Export-grade green chillies for international air freight markets',
      'Pickled green chillies and condiment manufacturing',
      'Chilli flakes and dried green chilli processing',
      'Chilli paste and sauce manufacturing for food industry',
    ],
    varieties: [
      {
        name: 'Jat',
        slug: 'jat',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Jat Green Chilli Field-Ripe Bunch]',
        overview:
          'Jat is one of the most widely cultivated green chilli varieties in India, recognized for its high pungency, prolific yield, and broad market acceptance across northern and central India. The variety has been a mainstay of Indian green chilli cultivation for decades and continues to be the dominant variety in major wholesale markets.\n\nThe variety produces long, slender, dark green fruits with very high capsaicin content delivering intense pungency. Jat matures in approximately 55–65 days from transplanting and demonstrates good tolerance to leaf curl virus and moderate resistance to fruit rot. Its vigorous plant growth and prolific flowering ensure continuous fruit set over an extended harvest period.\n\nJat chillies are the standard reference for pungency in Indian green chilli markets. They dominate the Azadpur (Delhi), Indore, and Guntur wholesale markets, where they supply both the fresh retail trade and the processing sector. The variety\'s consistent pungency and reliable supply make it indispensable to the Indian green chilli market infrastructure.',
        characteristics: {
          color: 'Dark green',
          shape: 'Long, slender, slightly curved',
          averageSize: '10–15 cm length',
          taste: 'Very hot, intensely pungent',
          aroma: 'Sharp, penetrating chilli aroma',
          storage: '7–10 days at 7–10°C',
        },
        applications: [
          'Standard high-pungency green chilli for wholesale markets',
          'Daily household cooking and restaurant supply',
          'Processing-grade chilli for paste and sauce manufacturing',
        ],
        shelfLife: '7–10 days (refrigerated)',
        exportSuitability:
          'High — dominant Indian green chilli variety with established export market recognition in South Asian and Middle Eastern channels.',
      },
      {
        name: 'G-4',
        slug: 'g-4',
        imagePlaceholder: '[IMAGE PLACEHOLDER: G-4 Green Chilli Medium-Sized Lot]',
        overview:
          'G-4 is a high-yielding green chilli variety that has gained significant commercial adoption across India for its reliable yield performance and consistent fruit quality. It is particularly valued by commercial chilli farmers who prioritize total yield per hectare alongside acceptable pungency levels for the mass market.\n\nThe variety produces medium-long, green fruits with moderate to high pungency and good flesh thickness. G-4 matures in 55–60 days and demonstrates good field tolerance to major chilli diseases including leaf curl virus and powdery mildew. Its compact plant type allows for higher planting density compared to many traditional varieties, contributing to its high per-hectare productivity.\n\nG-4 is extensively cultivated in Andhra Pradesh, Karnataka, and Maharashtra, where it serves both the fresh green chilli market and provides early-harvest green pods before the main dry chilli harvest. The variety\'s adaptability to multiple growing seasons provides farmers with year-round cultivation options.',
        characteristics: {
          color: 'Green',
          shape: 'Medium-long, straight',
          averageSize: '8–12 cm length',
          taste: 'Moderately hot with balanced pungency',
          aroma: 'Pleasant, medium-intensity chilli aroma',
          storage: '7–10 days at 7–10°C',
        },
        applications: [
          'High-yield commercial green chilli cultivation',
          'Dual-purpose fresh green and dry red chilli production',
          'Mass market domestic green chilli supply',
        ],
        shelfLife: '7–10 days (refrigerated)',
        exportSuitability:
          'Moderate to high — reliable quality and high yield suitable for volume export shipments.',
      },
      {
        name: 'Pusa Jwala',
        slug: 'pusa-jwala',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Jwala Green Chilli Upright Plant]',
        overview:
          'Pusa Jwala is an IARI-developed green chilli variety recognized for its excellent fruit quality, good pungency, and upright fruit bearing habit that facilitates efficient harvesting. It is widely cultivated in northern India and has established a strong presence in the region\'s wholesale chilli markets.\n\nThe variety produces long, dark green fruits that turn bright red upon full maturity. Pusa Jwala matures in approximately 60–65 days and demonstrates moderate resistance to leaf curl virus and good tolerance to thrips and mites. Its upright fruit orientation reduces fruit rot by keeping pods elevated above the soil surface, improving harvest quality.\n\nPusa Jwala is a standard variety in the Delhi, Lucknow, and Chandigarh green chilli markets. The variety\'s consistent quality and recognizable fruit type make it a preferred choice for traders and organised retail buyers in northern India.',
        characteristics: {
          color: 'Dark green turning bright red at maturity',
          shape: 'Long, slender, upright orientation',
          averageSize: '10–14 cm length',
          taste: 'Hot with sharp, clean pungency',
          aroma: 'Intense, fresh chilli aroma',
          storage: '7–10 days at 7–10°C',
        },
        applications: [
          'Northern Indian wholesale green chilli market supply',
          'Dual-purpose green and red chilli production',
          'Organised retail and supermarket procurement',
        ],
        shelfLife: '7–10 days (refrigerated)',
        exportSuitability:
          'Moderate to high — good quality and consistent pungency suitable for export to South Asian and Middle Eastern markets.',
      },
      {
        name: 'Pusa Sadabahar',
        slug: 'pusa-sadabahar',
        imagePlaceholder: '[IMAGE PLACEHOLDER: Pusa Sadabahar Green Chilli Year-Round Pods]',
        overview:
          'Pusa Sadabahar is a uniquely adapted green chilli variety developed by IARI for year-round cultivation across India\'s diverse agro-climatic zones. The name "Sadabahar" means "always in season," reflecting the variety\'s ability to produce consistent yields in kharif, rabi, and summer seasons across different geographic regions.\n\nThe variety produces medium-long, green fruits with good pungency and attractive market appearance. Pusa Sadabahar matures in 55–60 days and demonstrates broad adaptability to varying temperature, rainfall, and photoperiod conditions. Its disease resistance package includes tolerance to leaf curl virus, powdery mildew, and anthracnose — the three most common chilli diseases in India.\n\nPusa Sadabahar is particularly valued by farmers who cultivate green chillies as a year-round commercial crop. Its reliable performance across seasons provides production stability and income continuity. The variety is cultivated extensively in Madhya Pradesh, Maharashtra, and Karnataka for both domestic fresh market supply and export grading operations.',
        characteristics: {
          color: 'Green',
          shape: 'Medium-long, slightly curved',
          averageSize: '8–12 cm length',
          taste: 'Moderately hot with balanced pungency',
          aroma: 'Standard green chilli aroma',
          storage: '7–10 days at 7–10°C',
        },
        applications: [
          'Year-round green chilli cultivation for continuous supply',
          'Multi-season commercial farming operations',
          'Reliable export-grade chilli production across seasons',
        ],
        shelfLife: '7–10 days (refrigerated)',
        exportSuitability:
          'Moderate to high — year-round production capability ensures consistent export supply, meeting continuous international demand.',
      },
      {
        name: 'K-1',
        slug: 'k-1',
        imagePlaceholder: '[IMAGE PLACEHOLDER: K-1 Green Chilli Medium Pungent Lot]',
        overview:
          'K-1 is a popular green chilli variety developed for the peninsular Indian chilli-growing zone, particularly Karnataka and Andhra Pradesh. It is known for its balance of pungency, yield, and fruit quality that aligns with the preferences of South Indian markets and the region\'s significant chilli processing sector.\n\nThe variety produces medium-long, dark green fruits with moderate to high pungency and good flesh thickness. K-1 matures in 55–60 days and demonstrates good tolerance to die-back disease and fruit rot, which are prevalent in the warm, humid conditions of peninsular India. Its consistent fruit set and uniform maturity facilitate efficient harvest operations.\n\nK-1 is widely cultivated in the Guntur, Kurnool, and Raichur chilli belts, where it serves both the fresh green chilli market and the dry red chilli processing industry. The variety\'s dual-purpose capability allows farmers to harvest green pods for early market income and allow the remaining crop to mature for dry chilli production.',
        characteristics: {
          color: 'Dark green turning deep red',
          shape: 'Medium-long, slightly tapering',
          averageSize: '8–12 cm length',
          taste: 'Moderately hot with characteristic Andhra pungency',
          aroma: 'Rich, aromatic chilli profile',
          storage: '7–10 days at 7–10°C',
        },
        applications: [
          'Peninsular Indian green chilli market supply',
          'Dual-purpose green and dry chilli production systems',
          'South Indian regional cuisine ingredient supply',
        ],
        shelfLife: '7–10 days (refrigerated)',
        exportSuitability:
          'Moderate — well-suited for regional exports within South Asia and to Gulf markets where Andhra-style pungency is preferred.',
      },
      {
        name: 'K-2',
        slug: 'k-2',
        imagePlaceholder: '[IMAGE PLACEHOLDER: K-2 Green Chilli Export-Grade Bunch]',
        overview:
          'K-2 is a refined green chilli variety bred for export-oriented production, with fruit characteristics specifically optimized to meet international market specifications. The variety addresses the growing demand for consistently sized, uniformly green, and moderately pungent chillies that meet the grading requirements of organised retail chains and export buyers.\n\nThe variety produces long, straight, glossy green fruits with uniform size and moderate pungency that appeals to a broad international consumer base. K-2 matures in 55–60 days and demonstrates good tolerance to major chilli diseases. Its fruit uniformity is among the highest of Indian green chilli varieties, with minimal size variation within each harvest batch.\n\nK-2 is increasingly adopted by export-oriented farmers and contract farming operations in Andhra Pradesh, Karnataka, and Tamil Nadu who supply pre-packed green chillies to Gulf supermarkets and South Asian grocery chains in the UK, USA, and Canada. The variety\'s uniformity and consistent quality make it a strong candidate for premium export packaging and branding.',
        characteristics: {
          color: 'Glossy uniform green',
          shape: 'Long, straight, uniform',
          averageSize: '10–14 cm length',
          taste: 'Moderately hot, clean pungency',
          aroma: 'Fresh, pleasant chilli aroma',
          storage: '7–10 days at 7–10°C',
        },
        applications: [
          'Export-grade green chilli for international supermarket supply',
          'Pre-packed branded chilli for retail export channels',
          'Contract farming for export-oriented chilli production',
        ],
        shelfLife: '7–10 days (refrigerated)',
        exportSuitability:
          'Very high — specifically optimized for export grading with exceptional uniformity and consistent quality meeting international specifications.',
      },
    ],
  },
]
