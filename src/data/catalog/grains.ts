import type { Product } from '../types'

export const grainsProducts: Product[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    slug: 'wheat',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/wheat/wheat_1.jpg',
    overview:
      'India is among the world\'s largest producers of wheat, cultivating this staple cereal across millions of hectares in the fertile Indo-Gangetic plains. Indian wheat is prized for its high protein content and excellent milling qualities, making it a cornerstone of both domestic food security and international commodity trade. The country\'s diverse agro-climatic zones enable the production of distinct wheat varieties, each tailored to regional preferences and end-use requirements.',
    keyBenefits: [
      'Exceptional protein content ranging from 10–14%, ideal for premium flour and bakery products',
      'Broad agro-climatic adaptability across irrigated and rain-fed regions',
      'Strong export demand in Middle Eastern, Southeast Asian, and African markets',
      'High milling recovery rates exceeding 80% for select premium varieties',
      'Well-established post-harvest supply chain with modern grading and sorting infrastructure',
      'Competitive pricing with consistent quality assurance under APEDA standards',
    ],
    growingRegions: [
      'Punjab & Haryana — Northern Grain Belt',
      'Madhya Pradesh — Central Wheat Zone',
      'Uttar Pradesh — Indo-Gangetic Plains',
      'Rajasthan — Northwestern Arid Zone',
    ],
    harvestSeason: 'March – May',
    exportAvailability:
      'Indian wheat is available for export year-round through buffer-stock releases and government trade channels, with peak availability from April through September following the Rabi harvest. Greenwings facilitates large-volume shipments meeting phytosanitary and quality certifications required by importing nations.',
    storageInfo:
      'Wheat should be stored in moisture-controlled silos or warehouses at 12–14% moisture content and ambient temperatures below 25°C. Fumigation with approved phosphine formulations is recommended for long-term storage exceeding six months. Hermetic storage bags and metal bins provide effective protection against insect infestation and fungal contamination. Regular monitoring of moisture and temperature ensures preservation of grain quality throughout the storage period.',
    nutritionalHighlights: [
      'Rich in complex carbohydrates providing sustained energy release',
      'High-quality plant protein essential for muscle repair and growth',
      'Excellent source of dietary fiber supporting digestive health',
      'Contains B-group vitamins including thiamine, niacin, and folate',
      'Significant iron, zinc, and magnesium content for metabolic function',
      'Naturally low in fat with zero cholesterol',
    ],
    marketApplications: [
      'Premium maida and atta production for domestic and export markets',
      'Bakery and confectionery industry raw material supply',
      'Semolina and vermicelli manufacturing',
      'Fortified flour programs for public health nutrition initiatives',
      'Animal feed formulations and brewery adjuncts',
      'Bioethanol production from surplus and feed-grade wheat',
    ],
    varieties: [
      {
        name: 'HD 2967',
        slug: 'hd-2967',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: HD 2967 Amber Wheat Grains Arranged in neat rows on burlap]',
        overview:
          'HD 2967 is a high-yielding, disease-resistant wheat variety developed by the Indian Agricultural Research Institute (IARI). It has rapidly become one of the most widely cultivated wheats in the northwestern plains due to its consistent performance under both irrigated and timely-sown rain-fed conditions. The grain exhibits a bold, lustrous amber appearance that appeals to millers and traders alike.\n\nThis variety produces flour with excellent gluten strength, making it particularly suitable for bread and baked goods. Its natural resistance to yellow rust and moderate tolerance to terminal heat stress ensure reliable yields even in years with challenging climatic conditions.\n\nIn export markets, HD 2967 commands a premium for its uniform grain size and high hectolitre weight. It is increasingly sought after by milling operations in the Middle East and East Africa that prioritize consistent flour quality for large-scale bakery production.',
        characteristics: {
          color: 'Amber golden',
          shape: 'Bold, oval',
          averageSize: '6.5–7.5 mm length',
          taste: 'Mild, nutty with clean finish',
          aroma: 'Fresh, earthy cereal notes',
          storage: 'Up to 12 months in controlled conditions; low susceptibility to storage pests',
        },
        applications: [
          'Premium bread flour',
          'Whole wheat atta production',
          'High-protein bakery blends',
          'Instant noodle and pasta manufacturing',
        ],
        shelfLife: '12–18 months under recommended storage conditions',
        exportSuitability:
          'Highly suitable — bold grain size, excellent milling recovery, and APEDA-certified grading make HD 2967 a preferred variety for bulk wheat exports to quality-conscious markets.',
      },
      {
        name: 'Lokwan',
        slug: 'lokwan',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Lokwan Wheat Grains Golden Close-Up on wooden surface]',
        overview:
          'Lokwan wheat is a traditional premium variety originating from the Lokwan region of Madhya Pradesh, where it has been cultivated for generations. It is renowned among Indian consumers for producing exceptionally soft and fluffy chapatis, a quality attributed to its unique gluten profile and fine milling characteristics. The grain is medium-bold with a distinctive golden hue that sets it apart in wholesale markets.\n\nThe flour milled from Lokwan wheat possesses a naturally creamy texture and superior water absorption capacity, which translates to voluminous, tender flatbreads. This organoleptic superiority has made it a staple in premium atta brands and a darling of the domestic packaged-flour industry.\n\nWhile primarily a domestic favorite, Lokwan is gaining traction in niche export channels targeting the Indian diaspora in the Gulf Cooperation Council countries, the United Kingdom, and North America. Its reputation as a "chapati wheat" positions it uniquely in markets where traditional Indian flatbread consumption drives purchasing decisions.',
        characteristics: {
          color: 'Deep golden',
          shape: 'Medium-bold, elliptical',
          averageSize: '6.0–7.0 mm length',
          taste: 'Smooth, subtly sweet',
          aroma: 'Light roasted cereal fragrance',
          storage: 'Excellent — thick bran layer provides natural pest resistance; stores well for 12–15 months',
        },
        applications: [
          'Premium packaged atta for retail',
          'Traditional Indian flatbread preparation',
          'Specialty flours for South Asian cuisine',
          'Fine semolina for halwa and upma',
        ],
        shelfLife: '12–15 months',
        exportSuitability:
          'Moderate to high — strong demand in diaspora markets; ideal for premium atta exports to countries with significant Indian populations.',
      },
      {
        name: 'PBW 343',
        slug: 'pbw-343',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: PBW 343 Wheat Grains Scattered on stone mill beside flour]',
        overview:
          'PBW 343 is a landmark wheat variety released by Punjab Agricultural University that revolutionized wheat cultivation in the Punjab-Haryana belt during the late 1990s. Its introduction marked a significant improvement over earlier varieties in terms of yield potential, rust resistance, and adaptability to the intensive cropping systems of northwestern India. The grain is characterized by its bold, hard texture and pale amber coloration.\n\nThis variety produces hard wheat with strong gluten properties, making it the backbone of India\'s bread flour industry. Millers favor PBW 343 for its high flour extraction rates and the consistency it brings to large-scale flour production. Its protein content reliably falls in the 11–13% range, meeting the specifications of most industrial baking applications.\n\nOn the export front, PBW 343 has been a workhorse variety in India\'s wheat trade portfolio. It is commonly featured in government-to-government wheat export agreements and is accepted by importing nations for its predictable quality parameters and compliance with international food safety standards.',
        characteristics: {
          color: 'Pale amber',
          shape: 'Bold, plump',
          averageSize: '6.8–7.8 mm length',
          taste: 'Neutral, clean',
          aroma: 'Mild cereal scent',
          storage: 'Good — hard grain resists breakage; maintains quality for 10–14 months',
        },
        applications: [
          'Industrial bread flour',
          'General-purpose milling',
          'Government PDS and food security procurement',
          'Biscuit and cookie base flour',
        ],
        shelfLife: '10–14 months',
        exportSuitability:
          'High — proven track record in international commodity markets; suitable for large-volume government and commercial export contracts.',
      },
      {
        name: 'Sharbati',
        slug: 'sharbati',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Sharbati Wheat Golden Grains Close-Up on marble surface]',
        overview:
          'Sharbati wheat is widely celebrated as India\'s most premium wheat variety, cultivated exclusively in the hard rock terai and black soil regions of Madhya Pradesh, particularly around Sehore and Vidisha districts. The unique mineral composition of these soils imparts a characteristic golden sheen and an unusually sweet taste to the grain, qualities that have earned Sharbati the moniker "golden wheat" among traders and consumers.\n\nThe flour produced from Sharbati is exceptionally soft, absorbs water readily, and yields chapatis with an unmatched aroma and tender texture. Its naturally low ash content and high protein-to-gluten ratio make it a favorite among discerning homemakers and premium atta brands that cater to upper-income consumer segments.\n\nSharbati wheat occupies a niche but rapidly growing position in export markets. Premium packaged atta and specialty flour manufacturers in the UAE, Singapore, and Malaysia increasingly source Sharbati for its distinctive eating qualities. Its limited geographic origin and constrained supply further enhance its appeal as a specialty agricultural product with genuine terroir characteristics.',
        characteristics: {
          color: 'Rich golden with subtle sheen',
          shape: 'Medium, well-filled',
          averageSize: '6.2–7.2 mm length',
          taste: 'Distinctively sweet, buttery',
          aroma: 'Fragrant, malty cereal notes',
          storage: 'Moderate — softer endosperm requires careful moisture management; best stored at 12% moisture for 8–12 months',
        },
        applications: [
          'Ultra-premium packaged atta',
          'Specialty artisan baking',
          'Gourmet flatbread production',
          'High-value export atta blends',
        ],
        shelfLife: '8–12 months under optimal conditions',
        exportSuitability:
          'High for niche premium segments — commands premium pricing in markets valuing terroir-driven quality; ideal for branded atta exports targeting affluent South Asian diaspora.',
      },
      {
        name: 'Durum',
        slug: 'durum',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Durum Wheat Hard Translucent Grains on rustic cloth]',
        overview:
          'Durum wheat, botanically Triticum durum, is the hardest of all wheat varieties and is cultivated in select regions of central and southern India where the climate favors its development. Indian durum is valued globally for its high protein content, vitreous kernel texture, and superior gluten strength, qualities that make it the preferred raw material for pasta and couscous production worldwide.\n\nThe grain possesses a distinctive translucent, glassy appearance when split and produces coarse semolina (sooji) of exceptional quality. Indian durum semolina is particularly noted for its bright yellow color, fine granulation, and consistent cooking characteristics, which rival the output from traditional durum-growing regions in the Mediterranean basin.\n\nIndia\'s durum wheat has established a strong foothold in export markets, with significant shipments going to pasta manufacturers in Italy, Turkey, and North Africa. The competitive pricing of Indian durum, combined with improving quality standards, has enabled the country to emerge as a credible supplier in the global durum trade alongside established producers like Canada and Australia.',
        characteristics: {
          color: 'Translucent amber, vitreous',
          shape: 'Hard, elongated',
          averageSize: '6.5–8.0 mm length',
          taste: 'Robust, slightly earthy',
          aroma: 'Full-bodied cereal with nutty undertones',
          storage: 'Excellent — extremely hard kernel resists pest damage; stores 18–24 months under proper conditions',
        },
        applications: [
          'Premium semolina for pasta and couscous',
          'Suji and rava production for South Asian cuisine',
          'Bulgur wheat manufacturing',
          'High-protein specialty flour blends',
        ],
        shelfLife: '18–24 months',
        exportSuitability:
          'Very high — competitive alternative to Mediterranean durum; strong demand from European and North African pasta manufacturers.',
      },
    ],
  },
  {
    id: 'rice',
    name: 'Rice',
    slug: 'rice',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/rice/rice_1.jpg',
    overview:
      'Rice is India\'s most cultivated crop and a pillar of the nation\'s agricultural economy, with production exceeding 130 million tonnes annually across diverse ecologies ranging from irrigated paddy fields to rain-fed upland systems. The country is the world\'s largest rice exporter, supplying premium aromatic and non-aromatic varieties to over 150 countries. India\'s genetic diversity in rice is unparalleled, encompassing long-grain Basmati, short-grain aromatic, medium-grain non-aromatic, and specialty glutinous types.',
    keyBenefits: [
      'World\'s largest rice exporter with established logistics and quality infrastructure',
      'Unmatched varietal diversity spanning aromatic, non-aromatic, and specialty categories',
      'Basmati rice enjoys Geographical Indication protection, ensuring authenticity premiums',
      'Competitive production costs enabling attractive export pricing',
      'Stringent APEDA and ECQR quality certification systems for international compliance',
      'Robust milling sector with state-of-the-art parboiling, sorting, and polishing technology',
    ],
    growingRegions: [
      'Punjab & Haryana — Basmati Heartland',
      'Andhra Pradesh & Telangana — Rice Bowl of South India',
      'West Bengal — Premium Aromatic Rice Zone',
      'Chhattisgarh — Central Paddy Belt',
      'Maharashtra — Western Upland Rice Region',
    ],
    harvestSeason: 'September – December (Kharif); May – August (Rabi in select regions)',
    exportAvailability:
      'Indian rice is available for export throughout the year due to multi-season cropping and large buffer stocks. Basmati varieties peak from October through March following the Kharif harvest, while non-Basmati and aromatic varieties from southern and eastern India are readily available year-round. Greenwings offers full-container and break-bulk options with complete documentation support.',
    storageInfo:
      'Raw paddy rice maintains optimal quality at 12–14% moisture in ventilated warehouses. Milled rice should be stored at 12–13% moisture in hermetic bags or climate-controlled facilities to prevent oxidative rancidity and aroma degradation. Temperature control below 20°C significantly extends shelf life for aromatic varieties. Nitrogen flushing and vacuum packaging are recommended for export-grade aromatic rice to preserve delicate flavor compounds during transit.',
    nutritionalHighlights: [
      'Primary source of dietary energy for over half the world\'s population',
      'Low glycemic index varieties available for dietary management',
      'Naturally gluten-free, suitable for celiac and gluten-sensitive consumers',
      'Contains essential amino acids including methionine and cysteine',
      'Rich in manganese and selenium supporting antioxidant defense',
      'Brown rice retains bran layers providing additional fiber, B vitamins, and minerals',
    ],
    marketApplications: [
      'Direct consumption as staple grain in domestic and international markets',
      'Premium Basmati and aromatic rice for gourmet and specialty retail',
      'Parboiled rice for institutional food service and government procurement',
      'Puffed and flaked rice for breakfast cereal and snack industries',
      'Rice flour and starch for food processing, paper, and textile industries',
      'Brewing and distillation as a fermentation substrate',
    ],
    varieties: [
      {
        name: 'Basmati 1121',
        slug: 'basmati-1121',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Basmati 1121 Extra Long Slender Grains in bamboo steamer]',
        overview:
          'Basmati 1121, also known as Pusa Basmati 1121, holds the distinction of being the world\'s longest rice grain, with kernels reaching an extraordinary 8.4 mm post-cooking elongation. Developed jointly by IARI and Indian agricultural research institutions, this variety was specifically bred to combine the legendary aroma of traditional Basmati with exceptional grain length and visual appeal. It has rapidly become the dominant Basmati variety in India\'s export portfolio.\n\nThe cooked grain exhibits a remarkable length-to-breadth ratio exceeding 4:1, with a delicate, fluffy texture that remains separate and non-sticky. Its aroma profile is intensely floral, with pronounced notes of pandan and basmati-specific 2-acetyl-1-pyrroline compounds that create a distinctive fragrance filling any kitchen or dining space.\n\nBasmati 1121 is the flagship variety in India\'s Basmati rice exports, commanding premium shelf space in supermarkets across the Middle East, Europe, and North America. Its GI-protected status ensures that only authentic Indian-origin Basmati 1121 can bear the coveted Basmati label in international markets, providing a significant competitive moat.',
        characteristics: {
          color: 'Translucent white, ivory sheen',
          shape: 'Extra-long, slender',
          averageSize: '8.0–8.4 mm pre-cooking; extends up to 18 mm cooked',
          taste: 'Delicate, mildly nutty with clean finish',
          aroma: 'Intense floral pandan fragrance with traditional Basmati notes',
          storage: 'Moderate — aromatic compounds are volatile; best stored in nitrogen-flushed packaging at <20°C for 12–15 months',
        },
        applications: [
          'Premium biryani and pilaf preparations',
          'Fine-dining gourmet rice presentations',
          'Export-grade packaged Basmati retail',
          'Specialty rice-based cuisine in Middle Eastern restaurants',
        ],
        shelfLife: '12–15 months in sealed, nitrogen-flushed packaging',
        exportSuitability:
          'Exceptional — the most exported Indian Basmati variety; GI-protected; strong demand across 100+ countries with established trade channels.',
      },
      {
        name: 'Pusa Basmati 1509',
        slug: 'pusa-basmati-1509',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Pusa Basmati 1509 Elegant Long Grains in copper serving bowl]',
        overview:
          'Pusa Basmati 1509 was developed by IARI as an early-maturing, high-yielding Basmati variety that addresses the key agronomic limitations of traditional Basmati cultivars. It matures approximately 25 days earlier than Basmati 1121, enabling farmers to adopt efficient crop rotation practices and reducing exposure to late-season pest and disease pressure. Despite its shorter crop cycle, Pusa 1509 delivers grain quality metrics that rival the finest traditional Basmati varieties.\n\nThe grain is slender and extra-long with a beautiful pearl-white translucence. Upon cooking, it elongates to nearly three times its raw length while maintaining the prized separate-grain texture that defines premium Basmati. Its aroma is distinctly Basmati in character, with a well-balanced blend of floral and nutty notes that complement richly spiced dishes.\n\nPusa Basmati 1509 has quickly captured a significant share of the export Basmati market, particularly valued for its consistent quality, high milling yield, and earlier availability in the export calendar. It is especially popular in African and Central Asian markets where price-quality optimization drives purchasing decisions.',
        characteristics: {
          color: 'Pearl white, translucent',
          shape: 'Extra-long, slim',
          averageSize: '7.6–8.2 mm pre-cooking',
          taste: 'Light, slightly nutty with floral hints',
          aroma: 'Classic Basmati fragrance with moderate intensity',
          storage: 'Good — robust grain structure; stores well for 12–14 months in sealed packaging',
        },
        applications: [
          'Everyday premium Basmati retail packs',
          'Restaurant and catering biryani rice',
          'Cost-effective export Basmati for volume markets',
          'Processed rice product base material',
        ],
        shelfLife: '12–14 months in sealed packaging',
        exportSuitability:
          'Very high — early maturity enables faster market availability; excellent yield and quality make it a cost-effective export choice for volume buyers.',
      },
      {
        name: 'Indrayani',
        slug: 'indrayani',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Indrayani Short Aromatic Grains in clay pot with turmeric]',
        overview:
          'Indrayani is a beloved aromatic short-grain rice variety native to the western Indian state of Maharashtra, where it has been cultivated for centuries in the fertile riverine valleys of the Godavari and Krishna basins. This indigenous variety is cherished in Maharashtrian cuisine for its distinctive floral aroma, sticky-soft cooked texture, and the comforting sweetness it imparts to everyday meals. Its cultivation is deeply rooted in local agricultural traditions and seasonal rhythms.\n\nThe grain is short, somewhat stout, and takes on a beautiful ivory sheen after milling. When cooked, Indrayani rice becomes pleasantly sticky and tender, making it ideal for dishes where grains need to clump gently, such as steamed rice with curries, rice flour preparations, and traditional Maharashtrian offerings like bhakri and varan-bhaat.\n\nIndrayani is emerging in regional export circuits, primarily targeting the large Maharashtrian diaspora communities in the United States, the United Kingdom, and the Gulf states. Its appeal as an heirloom, region-specific aromatic rice positions it attractively in the growing market for indigenous and heritage food products.',
        characteristics: {
          color: 'Ivory white',
          shape: 'Short, plump',
          averageSize: '5.0–5.5 mm length',
          taste: 'Sweet, mildly sticky with floral overtones',
          aroma: 'Delicate jasmine-like floral fragrance',
          storage: 'Good — short grain retains moisture well; stores 10–12 months under standard conditions',
        },
        applications: [
          'Traditional Maharashtrian daily meals',
          'Sweet rice preparations and kheer',
          'Rice flour for regional breads and snacks',
          'Temple offerings and ceremonial cuisine',
        ],
        shelfLife: '10–12 months',
        exportSuitability:
          'Moderate — niche demand in diaspora markets; ideal for ethnic and heritage food retail channels targeting Maharashtrian consumers abroad.',
      },
      {
        name: 'Kolam',
        slug: 'kolam',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Kolam Rice Small White Grains in brass vessel beside coconut]',
        overview:
          'Kolam rice is a popular medium-grain, non-aromatic variety extensively cultivated across southern and western India. Named after its smooth, rounded grain reminiscent of the traditional kolam patterns drawn outside Indian homes, this variety is prized for its quick cooking time, soft texture, and excellent digestibility. It is a daily staple for millions of Indian households, particularly in Tamil Nadu, Andhra Pradesh, and Karnataka.\n\nThe milled grain is small to medium in size, bright white in color, and possesses a clean, neutral flavor profile that pairs well with the diverse array of South Indian gravies, sambar, rasam, and curd-based preparations. Kolam rice cooks rapidly, becoming soft and slightly sticky — ideal for the spoonable, comforting rice preparations that characterize everyday South Indian dining.\n\nIn export markets, Kolam rice serves as a cost-effective, reliable staple that competes strongly with medium-grain rice from Thailand and Vietnam. It is particularly well-received in East and West African markets, Sri Lanka, and the Middle East, where its consistent quality and affordable pricing make it a preferred choice for institutional and household procurement.',
        characteristics: {
          color: 'Bright white',
          shape: 'Medium, rounded',
          averageSize: '5.2–5.8 mm length',
          taste: 'Mild, clean, slightly soft',
          aroma: 'Neutral cereal aroma',
          storage: 'Excellent — hardy grain resists deterioration; 18–24 months shelf life in proper conditions',
        },
        applications: [
          'Daily staple rice for South Indian cuisine',
          'Institutional catering and food service',
          'Temple and community kitchen provisions',
          'Bulk export for price-sensitive markets',
        ],
        shelfLife: '18–24 months',
        exportSuitability:
          'High — competitive pricing, consistent quality, and strong demand in African and Gulf markets; ideal for volume export contracts.',
      },
      {
        name: 'Sona Masuri',
        slug: 'sona-masuri',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Sona Masuri Golden-Tinted Grains in stainless steel measuring cup]',
        overview:
          'Sona Masuri is arguably India\'s most popular medium-grain rice variety, enjoying pan-Indian recognition and preference that transcends regional boundaries. Cultivated predominantly in Andhra Pradesh, Telangana, and Karnataka, this lightweight, aromatic variety is celebrated for its delightful balance of taste, texture, and nutritional properties. The name "Sona Masuri" literally translates to "golden essence," reflecting the grain\'s warm golden tint and premium positioning.\n\nThe grain is lightweight, easily digestible, and cooks to a fluffy yet slightly cohesive texture that appeals to a wide range of culinary applications. Sona Masuri possesses a subtle, pleasant aroma that enhances the eating experience without overpowering the flavors of accompanying dishes. Its moderate glycemic index has also earned it recognition among health-conscious consumers seeking better blood sugar management.\n\nSona Masuri has established a robust presence in export markets, particularly among Indian communities worldwide. It is one of the most sought-after rice varieties in the United States, United Kingdom, Canada, and Australia, available through both mainstream supermarkets and ethnic grocery channels. Its consistent demand and brand recognition make it a reliable anchor product in export portfolios.',
        characteristics: {
          color: 'Light golden white',
          shape: 'Medium, slightly slender',
          averageSize: '5.5–6.2 mm length',
          taste: 'Light, fragrant, pleasantly sweet',
          aroma: 'Subtle floral-cereal fragrance',
          storage: 'Very good — lightweight grain resists moisture damage; stores 15–18 months effectively',
        },
        applications: [
          'Pan-Indian daily consumption rice',
          'Light meals and dietary cooking',
          'Packaged retail rice in domestic and export markets',
          'Rice-based health food products',
        ],
        shelfLife: '15–18 months',
        exportSuitability:
          'Very high — one of the most recognized Indian rice varieties globally; consistent demand in diaspora markets; strong retail brand presence.',
      },
      {
        name: 'Ambemohar',
        slug: 'ambemohar',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Ambemohar Short Fragrant Grains in mango-leaf lined basket]',
        overview:
          'Ambemohar is an exquisite short-grain aromatic rice variety indigenous to the Western Ghats foothills of Maharashtra, particularly the Pune and Konkan regions. Its name, meaning "mango blossom" in Marathi, derives from the extraordinary mango-like fragrance that emanates from the cooked grain, a quality so distinctive that it has been celebrated in Marathi literature and culinary tradition for centuries. This heirloom variety is a living treasure of Maharashtra\'s agricultural biodiversity.\n\nThe grain is short, plump, and releases an intoxicating mango-blossom aroma when cooked, creating a sensory experience unlike any other rice variety. Its texture is soft, slightly sticky, and wonderfully comforting, making it the preferred rice for traditional Maharashtrian delicacies such as masala bhaat, vangi bhaat, and the simple but divine varan-bhaat combination of dal and rice.\n\nAmbemohar is beginning to attract international attention as global interest in heritage and indigenous food varieties grows. Limited quantities are being exported to specialty food retailers in the UAE, Singapore, and the United States, where discerning consumers seek authentic, terroir-driven ingredients. Its scarcity and unique organoleptic profile command significant premiums, positioning it as a luxury agricultural product in global markets.',
        characteristics: {
          color: 'Creamy white',
          shape: 'Short, rounded',
          averageSize: '4.5–5.2 mm length',
          taste: 'Distinctly mango-like, rich and buttery',
          aroma: 'Intoxicating mango blossom fragrance',
          storage: 'Moderate — delicate aroma diminishes with prolonged storage; best consumed within 6–9 months of milling',
        },
        applications: [
          'Premium Maharashtrian cuisine',
          'Heritage and specialty food retail',
          'Gourmet rice-based desserts',
          'Cultural and ceremonial food offerings',
        ],
        shelfLife: '6–9 months for optimal aroma retention',
        exportSuitability:
          'Niche luxury — limited supply and unique sensory profile enable premium positioning in specialty and heritage food export channels.',
      },
    ],
  },
  {
    id: 'maize',
    name: 'Maize',
    slug: 'maize',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/maize/maize_1.png',
    overview:
      'Maize (Zea mays) is India\'s third most important cereal crop, with production spanning the monsoon-fed Kharif season and the post-monsoon Rabi season across diverse agro-ecological zones. The country produces over 35 million tonnes of maize annually, serving as a critical feed ingredient for the booming poultry and livestock sectors, a raw material for the starch and sweetener industry, and an increasingly important source of human nutrition through direct consumption and processed food products. India\'s maize sector is undergoing a significant transformation with the adoption of hybrid technology and improved agronomic practices.',
    keyBenefits: [
      'Dual-season production capability ensures continuous supply availability',
      'Versatile crop serving food, feed, and industrial applications',
      'Growing demand from India\'s rapidly expanding poultry and animal feed industry',
      'High-yielding hybrid varieties delivering 8–12 tonnes per hectare',
      'Emerging export market for specialty maize products and value-added derivatives',
      'Strong government support through MSP and procurement programs',
    ],
    growingRegions: [
      'Karnataka — Southern Maize Belt',
      'Madhya Pradesh — Central Hybrid Maize Zone',
      'Maharashtra — Western Kharif Maize Region',
      'Rajasthan — Northwestern Rabi Maize Area',
    ],
    harvestSeason: 'September – November (Kharif); February – April (Rabi)',
    exportAvailability:
      'Indian maize is available for export year-round, with Kharif maize entering markets from October and Rabi maize from March onwards. Feed-grade maize dominates export volumes, while food-grade and specialty varieties are available in smaller quantities for niche markets. Greenwings sources maize from contracted farming networks ensuring consistent quality and traceability for export shipments to Southeast Asia, the Middle East, and Africa.',
    storageInfo:
      'Maize requires careful moisture management, with optimum storage moisture at 12–13% to prevent aflatoxin-producing Aspergillus contamination. Drying to below 13% within 48 hours of harvest is critical. Storage facilities should maintain temperatures below 25°C with adequate ventilation. Regular aflatoxin testing is mandatory for food-grade maize. Hermetic storage systems and moisture-barrier liners are recommended for maintaining quality during extended storage and ocean transit.',
    nutritionalHighlights: [
      'Rich in complex carbohydrates for sustained energy',
      'High-quality protein profile with balanced amino acid distribution',
      'Excellent source of lutein and zeaxanthin for eye health',
      'Significant dietary fiber content supporting gut health',
      'Contains essential minerals including phosphorus, magnesium, and zinc',
      'Naturally gluten-free, suitable for gluten-sensitive dietary applications',
    ],
    marketApplications: [
      'Poultry and livestock feed formulation',
      'Starch, glucose, and high-fructose corn syrup production',
      'Direct human consumption as food-grade corn',
      'Breakfast cereal and snack food manufacturing',
      'Ethanol and biofuel production from surplus feed-grade maize',
      'Corn oil extraction from germ for edible and industrial uses',
    ],
    varieties: [
      {
        name: 'Sweet Corn',
        slug: 'sweet-corn',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Sweet Corn Golden Kernels on cob with silk in farm setting]',
        overview:
          'Sweet corn is a specialized maize variety harvested at the immature stage when kernel sugar content is at its peak, typically 18–20% compared to 2–3% in field corn. India has witnessed remarkable growth in sweet corn cultivation, driven by increasing urban demand for fresh and processed sweet corn products. The variety thrives in the cool winter months of peninsular India and the temperate conditions of northern hill states.\n\nThe kernels are plump, translucent, and burst with sweet juice when bitten, delivering a crisp-tender texture that is unmatched by any other cereal. Indian sweet corn exhibits a well-balanced sweetness with pleasant corn flavor notes, making it versatile for both fresh consumption and industrial processing into canned, frozen, and value-added products.\n\nSweet corn export from India is concentrated on frozen kernel shipments and processed ready-to-eat products targeting markets in the Middle East, Southeast Asia, and Europe. The growing global demand for plant-based, gluten-free snack options has further expanded the export potential for Indian sweet corn-based products.',
        characteristics: {
          color: 'Golden yellow to pale yellow',
          shape: 'Plump, rounded kernels',
          averageSize: '10–12 mm kernel diameter',
          taste: 'Sweet, crisp, juicy with pronounced corn flavor',
          aroma: 'Fresh, sweet vegetative corn scent',
          storage: 'Perishable — requires immediate cooling or processing; frozen kernels retain quality for 12–18 months',
        },
        applications: [
          'Fresh market retail and food service',
          'Frozen and canned kernel production',
          'Snack food and ready-to-eat product manufacturing',
          'Salads, soups, and stir-fry ingredients',
        ],
        shelfLife: 'Fresh: 3–5 days refrigerated; Frozen: 12–18 months',
        exportSuitability:
          'Good — strong demand for frozen sweet corn kernels in international markets; requires cold chain infrastructure for fresh exports.',
      },
      {
        name: 'Dent Corn',
        slug: 'dent-corn',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Dent Corn Yellow-orange Kernels showing characteristic indent]',
        overview:
          'Dent corn, also known as field corn, is the most widely cultivated maize type in India, named for the characteristic dent or depression that forms at the crown of each kernel as it dries. This dent results from the differential shrinkage between the hard outer starch layer and the soft inner starch, creating a visually distinctive grain that is the backbone of India\'s commercial maize industry. Dent corn accounts for the vast majority of India\'s maize acreage and production.\n\nThe kernels are large, relatively flat on the crown side, and composed of both hard and soft starch fractions that make them ideal for wet-milling into starch, oil, gluten, and fiber products. Their high carbohydrate content and balanced protein profile have also made dent corn the dominant feed grain in India\'s poultry and livestock industries, which together consume over 60% of total maize production.\n\nDent corn from India is primarily exported in its feed-grade form to neighboring countries in South and Southeast Asia, with growing shipments to the Middle East and East Africa. India\'s competitive production costs and geographic proximity to major importing nations provide a structural advantage in regional maize trade.',
        characteristics: {
          color: 'Yellow to orange-yellow',
          shape: 'Large, flattened crown with characteristic dent',
          averageSize: '8–12 mm kernel length',
          taste: 'Starchy, mildly sweet when fresh; neutral when dry',
          aroma: 'Mild cereal, slightly sweet when fresh',
          storage: 'Very good — hard outer starch layer protects against damage; stores 18–24 months at 12–13% moisture',
        },
        applications: [
          'Animal feed and poultry nutrition',
          'Wet-milling for industrial starch',
          'Corn oil extraction',
          'Ethanol and alcohol production',
        ],
        shelfLife: '18–24 months',
        exportSuitability:
          'High — dominant export maize type; strong regional demand for feed-grade and industrial-grade dent corn; competitive logistics.',
      },
      {
        name: 'Flint Corn',
        slug: 'flint-corn',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Flint Corn Hard Rounded Kernels in earthen pot on rustic table]',
        overview:
          'Flint corn is characterized by its hard, vitreous endosperm that gives each kernel a smooth, glassy appearance with a rounded crown — the absence of the dent that defines field corn. In India, flint corn varieties are traditionally grown in rain-fed areas of Maharashtra, Gujarat, and parts of Rajasthan, where their drought tolerance and hardy nature provide reliable yields under challenging conditions. Indigenous flint corn varieties have been cultivated by tribal and farming communities for generations as a staple food crop.\n\nThe kernel\'s hard starch composition makes flint corn particularly resistant to storage pests and fungal contamination, giving it superior shelf life compared to dent corn varieties. When ground into flour, flint corn produces a coarser, more granular meal with a distinctive toasted corn flavor that is highly prized in traditional Indian preparations such as makki ki roti, a popular flatbread in northern India.\n\nFlint corn occupies a growing niche in export markets as consumers and food manufacturers increasingly seek non-GMO, traditionally cultivated maize varieties. Artisanal cornmeal, polenta-grade coarse flour, and whole-grain flint corn products are finding receptive audiences in specialty food retailers across Europe, Japan, and North America.',
        characteristics: {
          color: 'Range from golden yellow to deep orange, occasionally mixed',
          shape: 'Hard, rounded with smooth crown',
          averageSize: '7–10 mm kernel length',
          taste: 'Robust toasted corn flavor, slightly nutty',
          aroma: 'Rich, earthy toasted cereal notes',
          storage: 'Excellent — hard vitreous endosperm provides exceptional pest and moisture resistance; 24+ months at proper moisture',
        },
        applications: [
          'Traditional flatbread and cornmeal products',
          'Specialty artisanal corn flour and polenta',
          'Snack industry for corn nuts and roasted corn products',
          'Non-GMO certified food ingredient supply',
        ],
        shelfLife: '24+ months under optimal storage conditions',
        exportSuitability:
          'Moderate to high for specialty markets — non-GMO positioning and artisanal appeal support premium pricing in health-conscious and specialty food export channels.',
      },
      {
        name: 'Popcorn Maize',
        slug: 'popcorn-maize',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Popcorn Maize Small Hard Kernels beside bowl of popped kernels]',
        overview:
          'Popcorn maize is a distinct subspecies of Zea mays characterized by a small, hard kernel with a dense vitreous endosperm and a small amount of soft starch at the kernel center. This unique starch composition is what enables the kernel to explode violently when heated, as the trapped moisture converts to steam and ruptures the hard outer casing. India has been steadily increasing popcorn maize cultivation, driven by the explosive growth of the organized snack food and entertainment industries.\n\nThe kernels are small, typically pearl-shaped, and come in both butterfly and mushroom expansion patterns, each suited to different snacking applications. Indian popcorn maize is noted for its consistent expansion ratio, clean popping characteristics, and minimal hull attachment — qualities that are increasingly appreciated by commercial popcorn processors and premium snack brands.\n\nIndia\'s popcorn maize export potential is significant and growing, with shipments targeting markets in the Middle East, Southeast Asia, and Europe. The global demand for ready-to-eat popcorn products, including flavored and microwave varieties, has created sustained demand for high-quality popcorn maize, and India\'s competitive production environment positions it as an increasingly important supplier.',
        characteristics: {
          color: 'Pale yellow to light orange',
          shape: 'Small, hard, rounded pearl-like',
          averageSize: '4–6 mm kernel length',
          taste: 'Neutral when raw; mild corn flavor when popped',
          aroma: 'Clean, toasted corn fragrance when popped',
          storage: 'Excellent — extremely hard kernel structure; stores 24+ months at 12–13% moisture without quality degradation',
        },
        applications: [
          'Microwave and ready-to-eat popcorn products',
          'Cinema and entertainment venue snacking',
          'Flavored and coated popcorn snacks',
          'Confectionery popcorn products (caramel, chocolate-coated)',
        ],
        shelfLife: '24+ months',
        exportSuitability:
          'High and growing — strong global demand for snack-grade popcorn maize; India\'s production costs are competitive; suitable for both raw kernel and processed product exports.',
      },
      {
        name: 'Composite Maize',
        slug: 'composite-maize',
        imagePlaceholder:
          '[IMAGE PLACEHOLDER: Composite Maize Multi-colored Kernels in woven basket]',
        overview:
          'Composite maize refers to multi-purpose hybrid varieties that have been specifically bred to combine favorable traits from different maize types, delivering balanced performance across food, feed, and industrial applications. In India, composite maize varieties are the result of decades of breeding research by institutions such as the Indian Council of Agricultural Research and various state agricultural universities. These hybrids are engineered to deliver high yields, broad stress tolerance, and versatile grain quality suitable for multiple end-uses.\n\nThe kernels typically exhibit a mixed starch profile combining hard and soft endosperm fractions, resulting in grains that are suitable for both wet-milling and direct feed use. Their agronomic resilience, including tolerance to moisture stress, moderate disease resistance, and adaptability to varied planting dates, makes them the preferred choice for risk-averse farmers across India\'s diverse maize-growing regions.\n\nComposite maize forms the backbone of India\'s maize trade and export strategy. These versatile hybrids are exported primarily as feed-grade maize to neighboring South Asian countries and the Middle East, with increasing volumes being diverted to food-grade processing as quality standards improve. The predictability and consistency of composite hybrids make them the safest choice for export contracts requiring guaranteed quality parameters.',
        characteristics: {
          color: 'Yellow to orange, consistent within variety',
          shape: 'Medium to large, semi-dent to semi-flint profile',
          averageSize: '8–11 mm kernel length',
          taste: 'Standard maize flavor, balanced starch profile',
          aroma: 'Neutral cereal aroma',
          storage: 'Very good — robust kernel structure ensures reliable long-term storage; 18–24 months at 12–13% moisture',
        },
        applications: [
          'Balanced feed formulation for poultry and livestock',
          'Wet-milling for starch and derivative products',
          'Direct food processing for cornmeal and flour',
          'Export commodity for regional feed markets',
        ],
        shelfLife: '18–24 months',
        exportSuitability:
          'High — versatile quality profile serves multiple export markets; reliable supply from India\'s extensive hybrid maize cultivation base; competitive pricing for regional trade.',
      },
    ],
  },
]
