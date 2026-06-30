import type { Product } from '../types'

export const oilseedsProducts: Product[] = [
  {
    id: 'groundnut',
    name: 'Groundnut / Peanut',
    slug: 'groundnut',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/groundnut/Groundnut_1.jpg',
    overview:
      'Groundnut, also known as peanut, is one of India\'s most important oilseed crops, contributing substantially to domestic edible oil production and the global kernel trade. Grown across diverse agro-climatic zones, Indian groundnut is prized for its bold kernel size, consistent oil content, and rich roasted flavour. GreenWings partners with established producing regions to deliver graded and sorted kernels for oil crushing, confectionery, butter manufacturing, and export programmes.\n\nAs a dual-purpose crop, groundnut serves both the edible oil industry and high-value food markets. Mechanised grading, moisture-controlled storage, and rigorous quality inspection ensure that every lot meets buyer specifications for oil yield, aflatoxin limits, kernel count, and freedom from foreign matter. India\'s groundnut sector continues to evolve with improved varieties, better post-harvest infrastructure, and growing demand for certified export-grade kernels.\n\nFrom Gujarat\'s expansive irrigated farms to the rainfed fields of Andhra Pradesh and Rajasthan, groundnut remains a cornerstone of India\'s oilseed economy. GreenWings facilitates seamless access to shelled, bold, and split-grade groundnut for buyers seeking reliable supply for crushing, roasting, blanching, and specialty food applications.',
    keyBenefits: [
      'Excellent oil yield ranging from 42 to 50 percent depending on variety and growing conditions',
      'Premium dual-purpose crop supporting both industrial oil extraction and direct human consumption',
      'Strong export demand for bold Java and Bold Runner kernels in confectionery and snack markets',
      'Rich in monounsaturated fats, protein, Vitamin E, and essential dietary minerals',
      'Improves soil fertility through nitrogen fixation, supporting sustainable crop rotations',
      'Well-developed post-harvest infrastructure with grading, shelling, and moisture-control facilities',
    ],
    growingRegions: ['Gujarat', 'Andhra Pradesh', 'Rajasthan', 'Tamil Nadu', 'Karnataka'],
    harvestSeason: 'September to November (Kharif); May to July (Rabi/Summer)',
    exportAvailability:
      'Widely available for export with established quality protocols for aflatoxin management, kernel grading, and phytosanitary compliance. India is among the world\'s leading exporters of both in-shell and shelled groundnut kernels.',
    storageInfo:
      'Kernels should be stored at 8–10 °C and below 60 percent relative humidity to prevent rancidity and aflatoxin development. Vacuum-packed or nitrogen-flushed packaging is recommended for long-term storage. Shelf life of well-handled kernels under controlled conditions is up to twelve months.',
    nutritionalHighlights: [
      'Approximately 49–56 percent oil content with a favourable oleic-linoleic acid balance',
      '25–30 percent high-quality plant protein with a well-balanced amino acid profile',
      'Excellent source of Vitamin E, niacin, folate, and B-group vitamins',
      'Rich in dietary minerals including magnesium, phosphorus, potassium, and zinc',
      'Contains resveratrol and other beneficial phytochemicals associated with cardiovascular health',
      'Provides significant dietary fibre when consumed as whole roasted kernels or peanut butter',
    ],
    marketApplications: [
      'Edible oil extraction for cooking oils, margarines, and shortening formulations',
      'Confectionery and snack manufacturing including roasted, salted, coated, and flavoured peanuts',
      'Peanut butter and spread production for retail and institutional markets',
      'Animal feed ingredient utilising oilcake and meal after crushing',
      'Food-service ingredient for desserts, sauces, satay preparations, and bakery toppings',
      'Export-grade kernel trade for shelling, blanching, and split-kernel markets worldwide',
    ],
    varieties: [
      {
        name: 'TMV 2',
        slug: 'tmv-2',
        imagePlaceholder: 'Golden-brown TMV 2 groundnut kernels in processing tray',
        overview:
          'TMV 2 is a widely adapted Spanish bunch-type groundnut variety known for its early maturity, dependable yield, and consistent kernel quality. Released by Tamil Nadu Agricultural University, it remains a popular choice among farmers across southern and central India for both rainfed and irrigated cultivation.\n\nThe variety produces bold, uniform kernels with a light pink testa and good oil content, making it suitable for both oil crushing and kernel export. Its short-duration maturity allows flexible cropping patterns and double-cropping in favourable regions.\n\nTMV 2 kernels exhibit reliable size consistency and clean appearance after shelling, meeting grading specifications for bold-kernel export grades. Its adaptability to varied soil conditions and moderate input requirements contribute to steady production volumes and competitive market pricing.',
        characteristics: {
          color: 'Light pink testa with pale cream cotyledons',
          shape: 'Rounded to oval, bold bunch-type kernel',
          averageSize: '700–800 kernels per kilogram (bold grade)',
          taste: 'Mild, nutty, with pleasant roasted sweetness',
          aroma: 'Characteristic groundnut aroma, moderate intensity',
          storage: 'Good storage stability under controlled moisture; standard shelling and drying protocols recommended',
        },
        applications: ['Oil crushing', 'Kernel export', 'Roasted snacks', 'Peanut butter'],
        shelfLife: '10–12 months when dried below 8 percent moisture and stored in cool, dry conditions',
        exportSuitability:
          'Well-suited for export as bold shelled kernels with proper aflatoxin management and size grading',
      },
      {
        name: 'JL 24',
        slug: 'jl-24',
        imagePlaceholder: 'JL 24 groundnut pods and shelled kernels ready for sorting',
        overview:
          'JL 24 is a high-yielding, drought-tolerant Spanish bunch groundnut developed through collaborative breeding programmes. It has earned strong farmer acceptance across semi-arid regions for its ability to deliver dependable yields under limited rainfall and marginal soil fertility.\n\nThe variety produces medium-bold kernels with uniform size and acceptable oil content, making it a versatile option for both oil extraction and kernel markets. Its reputation for consistent performance under stress conditions supports reliable procurement planning for industrial buyers.\n\nJL 24 occupies a significant share of India\'s groundnut area, particularly in Karnataka, Andhra Pradesh, and Rajasthan. Its wide adoption and established processing characteristics make it a commercially important variety for feed-grade meal and oil-grade groundnut supply chains.',
        characteristics: {
          color: 'Pinkish-red testa with creamy white cotyledons',
          shape: 'Oval to elliptical, medium-bold kernel',
          averageSize: '800–900 kernels per kilogram',
          taste: 'Mildly nutty with balanced roasted flavour',
          aroma: 'Moderate groundnut aroma, clean profile',
          storage: 'Good shelf stability when properly dried; suitable for bulk storage in lined bags or silos',
        },
        applications: ['Oil extraction', 'Feed meal production', 'Kernel grading', 'Domestic retail'],
        shelfLife: '9–12 months under standard moisture-controlled storage',
        exportSuitability:
          'Suitable for price-competitive export grades with appropriate sorting and aflatoxin screening',
      },
      {
        name: 'TAG 24',
        slug: 'tag-24',
        imagePlaceholder: 'Sorted TAG 24 groundnut kernels displayed in grading tray',
        overview:
          'TAG 24 is a widely cultivated Virginia bunch-type groundnut variety recognised for its superior kernel characteristics, good oil yield, and strong performance across irrigated and rainfed systems. It has become one of India\'s most commercially significant groundnut varieties, particularly in Gujarat and Rajasthan.\n\nThe variety produces extra-bold, elongated kernels with an attractive reddish-brown testa. Its kernel size and shape are well-suited for premium kernel export, confectionery blanching, and high-value snack markets. TAG 24 consistently delivers oil content above 48 percent, making it equally valuable for crushing programmes.\n\nWith strong demand from both domestic and international buyers, TAG 24 commands premium pricing in bold-kernel grades. Its combination of yield potential, kernel quality, and market acceptance makes it a strategic choice for GreenWings supply programmes targeting quality-conscious oil millers and confectionery manufacturers.',
        characteristics: {
          color: 'Reddish-brown testa with pale cream cotyledons',
          shape: 'Elongated, bold Virginia-type kernel',
          averageSize: '600–700 kernels per kilogram (extra-bold grade)',
          taste: 'Rich, nutty flavour with excellent roasted depth',
          aroma: 'Pronounced aromatic groundnut profile',
          storage: 'Excellent storage stability; maintains quality for extended periods under cool, dry conditions',
        },
        applications: [
          'Premium kernel export',
          'Confectionery and blanching',
          'Oil extraction',
          'Gourmet roasted snacks',
        ],
        shelfLife: '12 months under optimal storage with moisture below 7 percent',
        exportSuitability:
          'Highly export-suitable as bold Virginia-type kernels with strong demand in European, Middle Eastern, and Southeast Asian markets',
      },
      {
        name: 'GG 2',
        slug: 'gg-2',
        imagePlaceholder: 'GG 2 groundnut dried pods and cleaned kernels in warehouse setting',
        overview:
          'GG 2 is a Virginia runner-type groundnut variety developed for high yield potential and good adaptation to irrigated cultivation. It produces bold kernels with consistent size and colour, meeting the quality expectations of both oil processors and kernel buyers.\n\nThe variety is particularly valued in Gujarat and Maharashtra for its contribution to the state\'s dominant groundnut production base. GG 2 offers reliable oil recovery and clean kernel appearance after mechanical shelling and grading.\n\nIts runner growth habit and later maturity compared to bunch types allow it to utilise full-season irrigation for maximum yield. GG 2 kernels are positioned for bulk oil-grade supply as well as graded kernel trade, providing flexibility for procurement and distribution programmes.',
        characteristics: {
          color: 'Tan to light brown testa with creamy cotyledons',
          shape: 'Bold runner-type, slightly elongated oval',
          averageSize: '650–750 kernels per kilogram',
          taste: 'Full-bodied nutty flavour suitable for crushing and roasting',
          aroma: 'Moderate to strong groundnut aroma',
          storage: 'Good storage performance; requires proper drying and protection from moisture ingress',
        },
        applications: ['Bulk oil extraction', 'Kernel grading', 'Animal feed meal', 'Domestic trade'],
        shelfLife: '10–11 months under controlled storage conditions',
        exportSuitability:
          'Suitable for export as graded kernels with attention to uniformity and aflatoxin compliance',
      },
      {
        name: 'SB 11',
        slug: 'sb-11',
        imagePlaceholder: 'SB 11 groundnut kernels in quality inspection container',
        overview:
          'SB 11 is a high-performing Spanish bunch-type groundnut variety selected for its combination of early maturity, good yield, and consistent kernel quality. It is well-adapted to the semi-arid conditions of Rajasthan and Gujarat, where it contributes meaningfully to India\'s groundnut production base.\n\nThe variety produces medium to bold kernels with acceptable oil content and clean appearance. SB 11\'s early maturity makes it suitable for double-cropping systems and enables timely market arrival, supporting efficient procurement cycles.\n\nSB 11 kernels are primarily positioned for oil crushing and domestic kernel markets, where their reliable quality and competitive cost make them attractive to volume buyers. The variety\'s steady production profile supports predictable supply planning for industrial clients.',
        characteristics: {
          color: 'Light pink to salmon testa with cream cotyledons',
          shape: 'Rounded to slightly elongated, medium-bold',
          averageSize: '750–850 kernels per kilogram',
          taste: 'Clean, mild nutty flavour',
          aroma: 'Moderate groundnut aroma',
          storage: 'Adequate storage stability; standard drying and bagging practices sufficient for medium-term storage',
        },
        applications: ['Oil crushing', 'Domestic kernel trade', 'Feed-grade meal', 'Roasted snack production'],
        shelfLife: '9–10 months under standard storage conditions',
        exportSuitability:
          'Export-viable for select grade specifications with standard quality assurance measures',
      },
    ],
  },
  {
    id: 'soybean',
    name: 'Soybean',
    slug: 'soybean',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/soybean/Soybean_1.jpg',
    overview:
      'Soybean is India\'s fastest-growing oilseed crop, playing an increasingly central role in edible oil production, protein meal exports, and the emerging plant-based food sector. Indian soybean is predominantly grown in the central and western states under rainfed conditions, with Madhya Pradesh alone accounting for nearly half of national production. GreenWings offers graded soybean for crushing, meal export, and identity-preserved food-grade programmes.\n\nThe crop\'s dual value — as a source of premium vegetable oil and high-protein defatted meal — makes soybean strategically important for both domestic food security and India\'s agricultural export portfolio. Advanced processing infrastructure, solvent extraction plants, and quality-certified refineries ensure that Indian soybean oil and meal meet stringent international buyer requirements.\n\nWith rising global demand for plant protein, sustainable meal for aquaculture and poultry, and identity-preserved non-GM soybeans for food applications, India\'s soybean sector is positioned for continued growth. GreenWings connects quality-conscious buyers with graded lots meeting specifications for oil content, protein level, moisture, and foreign matter.',
    keyBenefits: [
      'Dual-value crop producing both premium edible oil and high-protein defatted meal',
      'India\'s non-GM soybean commands premium positioning in health-conscious and export markets',
      'High protein content of 36–40 percent supporting growing demand for plant-based protein',
      'Oil content of 18–22 percent suitable for refined, blended, and vanaspati applications',
      'Strong export demand for soybean meal from poultry, aquaculture, and livestock feed sectors',
      'Nitrogen-fixing legume that improves soil health and supports sustainable crop rotation',
    ],
    growingRegions: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Chhattisgarh'],
    harvestSeason: 'September to October (Kharif)',
    exportAvailability:
      'Soybean meal is a major Indian agricultural export, with established quality standards and phytosanitary protocols. Whole soybeans are exported for food-grade and specialty applications with identity-preserved certification available.',
    storageInfo:
      'Soybeans should be dried to below 12 percent moisture and stored in clean, ventilated warehouses at temperatures below 25 °C. Fumigation may be required for longer storage periods. Under proper conditions, soybeans maintain quality for 10–12 months.',
    nutritionalHighlights: [
      '36–40 percent high-quality protein with a complete amino acid profile',
      '18–22 percent oil rich in polyunsaturated fatty acids including linoleic and linolenic acids',
      'Excellent source of isoflavones with recognised health-promoting properties',
      'Rich in B-complex vitamins, particularly folate, thiamine, and riboflavin',
      'Good source of essential minerals including iron, calcium, magnesium, and zinc',
      'Contains lecithin and phytosterols valued in nutritional and pharmaceutical applications',
    ],
    marketApplications: [
      'Edible oil extraction for refined cooking oils, margarines, and industrial frying applications',
      'Soybean meal production for poultry, aquaculture, swine, and cattle feed formulations',
      'Soy flour, textured vegetable protein, and soy milk for food manufacturing',
      'Soy sauce, tofu, tempeh, and fermented soy products for domestic and export food markets',
      'Lecithin extraction for food emulsifiers, pharmaceutical, and industrial applications',
      'Identity-preserved non-GM soybean for specialty food, infant formula, and health-food channels',
    ],
    varieties: [
      {
        name: 'JS 335',
        slug: 'js-335',
        imagePlaceholder: 'Golden-yellow JS 335 soybean grains in grading sieve',
        overview:
          'JS 335 is the most widely cultivated soybean variety in India, commanding a dominant share of the country\'s soybean area. Developed by Jawaharlal Nehru Krishi Vishwa Vidyalaya, it has become the benchmark variety for the central Indian soybean belt due to its consistent yield, reliable maturity, and good seed quality.\n\nThe variety produces medium-sized, uniform yellow beans with acceptable oil and protein content, meeting the standard specifications of solvent extraction plants and meal exporters. Its wide adaptation across Madhya Pradesh, Maharashtra, and Rajasthan ensures large, predictable production volumes.\n\nJS 335\'s market acceptance is built on decades of consistent performance. It serves as the reference variety against which newer releases are evaluated, and its familiarity among traders and processors supports transparent pricing and efficient market operations.',
        characteristics: {
          color: 'Clear golden-yellow seed coat with yellow cotyledons',
          shape: 'Near-spherical, uniform medium size',
          averageSize: '160–180 grams per 1000 seeds',
          taste: 'Mild beany flavour typical of soybean; neutral after processing',
          aroma: 'Light characteristic soy aroma',
          storage: 'Good storage behaviour at standard moisture levels; maintains grade after proper drying',
        },
        applications: [
          'Oil extraction',
          'Soybean meal export',
          'Feed formulations',
          'General-purpose food-grade processing',
        ],
        shelfLife: '10–12 months under proper warehouse conditions',
        exportSuitability:
          'Excellent export suitability for meal production; suitable for whole-bean export with quality grading',
      },
      {
        name: 'PS 1347',
        slug: 'ps-1347',
        imagePlaceholder: 'PS 1347 soybean harvest-ready pods and cleaned seeds',
        overview:
          'PS 1347 is a well-established soybean variety recognised for its good yield potential and improved disease resistance. Developed for the central Indian soybean zone, it performs reliably under rainfed conditions and offers farmers a dependable option for stable production.\n\nThe variety produces yellow beans with acceptable oil and protein content, making it well-suited for both crushing and meal production. Its disease-resistance profile reduces production risk and contributes to more consistent grain quality at harvest.\n\nPS 1347 is positioned as a strong commercial alternative to JS 335, offering similar end-use characteristics with added agronomic advantages. Its beans are readily accepted by solvent extractors and feed meal manufacturers, supporting efficient procurement and processing operations.',
        characteristics: {
          color: 'Bright yellow seed coat with light yellow cotyledons',
          shape: 'Round to slightly oval, medium size',
          averageSize: '150–170 grams per 1000 seeds',
          taste: 'Standard soybean flavour profile',
          aroma: 'Mild soy aroma, clean after processing',
          storage: 'Good storage characteristics; standard warehouse protocols apply',
        },
        applications: ['Oil crushing', 'Meal export', 'Domestic feed', 'Food-grade processing'],
        shelfLife: '10–11 months under controlled storage',
        exportSuitability:
          'Suitable for export-oriented crushing programmes and meal production',
      },
      {
        name: 'NRC 7',
        slug: 'nrc-7',
        imagePlaceholder: 'NRC 7 soybean seeds in research-grade sample container',
        overview:
          'NRC 7 is an improved soybean variety developed by the Indian Council of Agricultural Research, designed to deliver enhanced yield and better quality parameters for both oil and protein recovery. It represents the next generation of Indian soybean breeding, incorporating improved genetics for yield stability and processing performance.\n\nThe variety produces uniform yellow beans with competitive oil content and protein levels that meet or exceed industry benchmarks. NRC 7\'s improved oil recovery potential makes it attractive to solvent extraction plants seeking higher efficiency and better oil quality.\n\nAs a newer variety with demonstrated agronomic and quality advantages, NRC 7 is gaining adoption across India\'s soybean-growing regions. Its positioning as a quality-focused variety supports premium pricing opportunities for identity-preserved lots and specialty food applications.',
        characteristics: {
          color: 'Clear golden-yellow seed coat with bright yellow cotyledons',
          shape: 'Uniformly spherical, consistent medium size',
          averageSize: '155–175 grams per 1000 seeds',
          taste: 'Clean, neutral flavour with minimal beany notes',
          aroma: 'Light, pleasant soy aroma',
          storage: 'Excellent storage performance; maintains oil quality under standard conditions',
        },
        applications: [
          'Premium oil extraction',
          'Identity-preserved food-grade supply',
          'High-protein meal production',
          'Specialty soy foods',
        ],
        shelfLife: '11–12 months under optimal storage conditions',
        exportSuitability:
          'High export suitability with potential for premium positioning in quality-conscious markets',
      },
      {
        name: 'MAUS 71',
        slug: 'maus-71',
        imagePlaceholder: 'MAUS 71 soybean plants in field with mature pods',
        overview:
          'MAUS 71 is a soybean variety developed by Maharashtra Agricultural Universities for adaptation to the state\'s rainfed growing conditions. It offers reliable yield performance and good bean quality across Maharashtra\'s diverse soybean production environments.\n\nThe variety produces medium-sized yellow beans with acceptable oil and protein profiles suitable for standard crushing and meal production operations. Its regional adaptation ensures consistent supply from one of India\'s key soybean-producing states.\n\nMAUS 71 serves the commercial soybean supply chain in Maharashtra, contributing to the state\'s significant role in India\'s soybean economy. Its well-established agronomic profile and processing characteristics make it a dependable variety for bulk procurement programmes.',
        characteristics: {
          color: 'Yellow seed coat with standard yellow cotyledons',
          shape: 'Rounded to slightly oval, medium size',
          averageSize: '160–180 grams per 1000 seeds',
          taste: 'Typical soybean flavour, suitable for oil and meal applications',
          aroma: 'Standard soy aroma',
          storage: 'Good storage stability under proper warehouse management',
        },
        applications: ['Oil extraction', 'Soybean meal', 'Animal feed', 'Domestic processing'],
        shelfLife: '10–11 months under standard storage',
        exportSuitability:
          'Suitable for export through standard crushing and meal production channels',
      },
      {
        name: 'JS 95-60',
        slug: 'js-95-60',
        imagePlaceholder: 'JS 95-60 soybean seeds displayed in quality control tray',
        overview:
          'JS 95-60 is an improved soybean variety from the JNKVV breeding programme, developed to deliver higher yield potential and improved disease resistance compared to older cultivars. It is well-regarded in the Malwa Plateau and central Indian soybean zones for its consistent performance and adaptability.\n\nThe variety produces clean, uniform yellow beans with competitive oil and protein content. JS 95-60\'s improved agronomic package translates into more reliable grain quality at harvest, which is valued by processors seeking consistent input material.\n\nJS 95-60 represents the progressive improvement of India\'s soybean genetic base, offering farmers and buyers a modern variety with demonstrated field performance and processing compatibility. It is positioned for both bulk commercial programmes and quality-sensitive procurement requirements.',
        characteristics: {
          color: 'Bright golden-yellow seed coat with yellow cotyledons',
          shape: 'Uniformly round, consistent medium size',
          averageSize: '155–170 grams per 1000 seeds',
          taste: 'Clean soybean flavour with balanced oil and protein characteristics',
          aroma: 'Mild, characteristic soy aroma',
          storage: 'Good to excellent storage stability under controlled conditions',
        },
        applications: [
          'Oil extraction',
          'Export-grade meal production',
          'Food-grade processing',
          'Feed ingredient supply',
        ],
        shelfLife: '10–12 months with proper drying and storage management',
        exportSuitability:
          'Good export suitability for meal production and quality-sensitive whole-bean programmes',
      },
    ],
  },
  {
    id: 'sesame',
    name: 'Sesame / Til',
    slug: 'sesame',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/sesame/Sesame_1.jpg',
    overview:
      'Sesame, known as til in India, is one of the world\'s oldest cultivated oilseeds, revered for its distinctive nutty flavour, high oil content, and exceptional nutritional profile. India is the world\'s largest producer of sesame, with production spanning diverse agro-climatic zones from Rajasthan\'s arid plains to the humid tracts of West Bengal and Odisha. GreenWings offers graded sesame for oil extraction, tahini manufacturing, confectionery, bakery, and premium export markets.\n\nIndian sesame is available in a wide spectrum of colours including white, brown, black, and mixed, each type serving specific market segments and culinary traditions. The hulled white sesame market is particularly significant for tahini, halva, and bakery toppings, while brown and black varieties are prized for traditional foods, health products, and specialty applications.\n\nSesame oil, extracted from carefully cleaned and graded seed, is valued both as a premium cooking medium and as a base for pharmaceutical and cosmetic formulations. Its high oxidative stability and distinctive flavour profile command premium pricing in domestic and international specialty oil markets.',
    keyBenefits: [
      'One of the highest oil-content oilseeds at 45–55 percent, ensuring efficient oil recovery',
      'India\'s dominant global position as the largest sesame producer provides reliable supply volumes',
      'Exceptional nutritional profile rich in lignans, antioxidants, and polyunsaturated fatty acids',
      'Versatile ingredient for tahini, halva, bakery toppings, snack bars, and traditional confectionery',
      'Premium sesame oil valued for cooking, flavouring, pharmaceutical, and cosmetic applications',
      'Drought-tolerant crop requiring minimal inputs, supporting sustainable and low-cost cultivation',
    ],
    growingRegions: ['Rajasthan', 'Madhya Pradesh', 'Gujarat', 'West Bengal', 'Uttar Pradesh'],
    harvestSeason: 'September to November (Kharif); February to April (Rabi/Summer)',
    exportAvailability:
      'India is a leading global exporter of sesame seed and sesame oil, with established quality standards for hulled, natural, and roasted grades. Export certification includes sorting, colour grading, and rigorous purity standards for international markets.',
    storageInfo:
      'Sesame seeds should be dried to below 6 percent moisture and stored in airtight containers at temperatures below 20 °C. Hulled sesame requires nitrogen flushing or vacuum packaging to prevent rancidity. Properly stored sesame maintains quality for 12–18 months.',
    nutritionalHighlights: [
      '45–55 percent oil content rich in oleic and linoleic fatty acids',
      '18–25 percent high-quality protein with a favourable amino acid composition',
      'Exceptionally rich in calcium, iron, magnesium, zinc, and copper among plant-based foods',
      'Contains sesamin, sesamol, and other lignans with recognised antioxidant properties',
      'Good source of dietary fibre, B-complex vitamins, and Vitamin E',
      'Naturally gluten-free, supporting growing demand for allergen-friendly ingredients',
    ],
    marketApplications: [
      'Tahini and sesame paste production for Middle Eastern, Mediterranean, and global cuisines',
      'Confectionery including halva, sesame bars, and traditional Indian til-based sweets',
      'Bakery toppings and inclusion in bread, buns, crackers, and gourmet baked goods',
      'Premium sesame oil extraction for cooking, seasoning, pharmaceutical, and cosmetic use',
      'Roasted and flavoured snack seeds for retail and food-service markets',
      'Health food ingredient for protein bars, smoothie toppings, and nutritional supplements',
    ],
    varieties: [
      {
        name: 'RT 46',
        slug: 'rt-46',
        imagePlaceholder: 'RT 46 white sesame seeds spread in sorting tray under natural light',
        overview:
          'RT 46 is a prominent white sesame variety widely cultivated in Rajasthan, India\'s leading sesame-producing state. It is recognised for its bold seed size, clean white colour, and high oil content, making it one of the most commercially significant sesame varieties in the Indian market.\n\nThe variety produces plump, uniformly white seeds that are well-suited for hulling and grading into premium export grades. RT 46 is the preferred choice for tahini manufacturers and bakery ingredient buyers who require consistent colour, size, and flavour in their sesame supply.\n\nRT 46\'s strong agronomic performance in Rajasthan\'s semi-arid conditions ensures reliable production volumes year after year. Its market reputation as a high-quality white sesame variety supports premium pricing and sustained demand from both domestic and international buyers.',
        characteristics: {
          color: 'Clean white seed coat',
          shape: 'Flattened oval, plump and bold',
          averageSize: '3.0–3.5 mm length, 2.0–2.5 mm width',
          taste: 'Rich, nutty flavour with clean sweetness after hulling',
          aroma: 'Distinctive pleasant sesame aroma, moderate intensity',
          storage: 'Good storage stability; hulled seeds require protection from moisture and light to preserve colour',
        },
        applications: ['Tahini production', 'Bakery toppings', 'Hulled sesame export', 'Confectionery'],
        shelfLife: '12–18 months (natural); 10–14 months (hulled) under proper storage',
        exportSuitability:
          'Highly export-suitable as premium hulled white sesame, particularly for Middle Eastern and European tahini markets',
      },
      {
        name: 'RT 125',
        slug: 'rt-125',
        imagePlaceholder: 'RT 125 sesame seeds in export-grade packaging with quality certificate',
        overview:
          'RT 125 is an improved white sesame variety developed for enhanced yield and superior seed quality characteristics. It builds on the established reputation of Rajasthan\'s white sesame production with better agronomic performance and more consistent kernel parameters.\n\nThe variety produces large, bold white seeds with excellent oil content and uniform size distribution, meeting the stringent grading requirements of international sesame buyers. RT 125\'s seed appearance and processing quality make it particularly suitable for premium hulled sesame and confectionery applications.\n\nAs a newer release with demonstrated quality advantages, RT 125 is gaining adoption among progressive sesame growers in Rajasthan and Gujarat. Its improved yield potential and superior seed characteristics position it as a variety of choice for quality-focused supply programmes.',
        characteristics: {
          color: 'Bright white seed coat with lustrous appearance',
          shape: 'Plump oval, consistently bold',
          averageSize: '3.2–3.8 mm length, 2.2–2.6 mm width',
          taste: 'Full-bodied nutty flavour with excellent roasted characteristics',
          aroma: 'Rich sesame aroma, well-balanced',
          storage: 'Very good storage performance; maintains colour and oil quality under proper conditions',
        },
        applications: [
          'Premium tahini',
          'Confectionery and halva',
          'Export-grade hulled sesame',
          'Specialty bakery ingredients',
        ],
        shelfLife: '14–18 months (natural); 12–14 months (hulled) with nitrogen packaging',
        exportSuitability:
          'Excellent export suitability with potential for premium positioning in quality-conscious international markets',
      },
      {
        name: 'Pranab',
        slug: 'pranab',
        imagePlaceholder: 'Pranab sesame variety seeds with brown natural seed coat',
        overview:
          'Pranab is a well-regarded sesame variety cultivated primarily in eastern and central India, known for its adaptability to diverse growing conditions and reliable production performance. It produces brown to light-brown seeds with good oil content and dependable quality for crushing and food applications.\n\nThe variety serves as an important contributor to India\'s sesame export volume, particularly in natural (unhulled) grades that are demanded by markets in East Asia, Southeast Asia, and the Middle East. Pranab\'s seed characteristics make it versatile for both oil extraction and whole-seed food uses.\n\nPranab\'s wide adaptation and consistent yield make it a practical choice for farmers and procurement programmes seeking reliable sesame supply from multiple production zones. Its established market presence supports predictable trade operations and stable pricing.',
        characteristics: {
          color: 'Light brown to tan seed coat',
          shape: 'Flattened oval, medium size',
          averageSize: '2.8–3.2 mm length, 1.8–2.2 mm width',
          taste: 'Nutty, slightly earthy flavour profile',
          aroma: 'Moderate sesame aroma with natural earthy undertones',
          storage: 'Good natural storage stability; unhulled seeds maintain quality well under dry conditions',
        },
        applications: ['Oil extraction', 'Natural sesame export', 'Traditional foods', 'Whole-seed ingredients'],
        shelfLife: '12–16 months in unhulled form under controlled storage',
        exportSuitability:
          'Good export suitability for natural brown sesame grades, particularly in Asian and Middle Eastern markets',
      },
      {
        name: 'Gauri',
        slug: 'gauri',
        imagePlaceholder: 'Gauri sesame seeds in quality testing equipment',
        overview:
          'Gauri is a sesame variety valued for its strong agronomic performance and reliable seed quality in the central Indian sesame belt. It contributes to the steady supply of brown and mixed-grade sesame from Madhya Pradesh and surrounding states.\n\nThe variety produces medium-sized seeds with acceptable oil content and good processing characteristics. Gauri\'s consistent quality profile makes it suitable for both oil crushing and graded natural sesame markets.\n\nAs a regionally important variety, Gauri supports the commercial sesame supply chain in central India. Its dependable production characteristics and established market acceptance make it a practical choice for procurement programmes targeting volume and consistency.',
        characteristics: {
          color: 'Brown to dark brown seed coat',
          shape: 'Oval to slightly elongated, medium size',
          averageSize: '2.6–3.0 mm length, 1.7–2.0 mm width',
          taste: 'Nutty flavour with earthy depth, suitable for oil and traditional foods',
          aroma: 'Characteristic sesame aroma with roasted complexity',
          storage: 'Good storage behaviour for unhulled seed; proper drying essential for quality retention',
        },
        applications: ['Oil crushing', 'Natural seed trade', 'Domestic confectionery', 'Feed-grade applications'],
        shelfLife: '12–15 months under standard storage conditions',
        exportSuitability:
          'Suitable for export in natural grades, particularly for price-competitive bulk programmes',
      },
      {
        name: 'Swetha',
        slug: 'swetha',
        imagePlaceholder: 'Swetha white sesame seeds in premium export container',
        overview:
          'Swetha is a white sesame variety noted for its clean appearance, good seed size, and suitability for hulling and value-added processing. Its name, meaning "white" in several Indian languages, reflects its attractive seed colour that meets the visual quality expectations of premium sesame buyers.\n\nThe variety produces uniformly white seeds with competitive oil content, making it suitable for tahini, bakery toppings, and confectionery applications where seed colour and appearance are critical quality parameters. Swetha\'s hulling performance is well-regarded by processors.\n\nSwetha contributes to India\'s premium white sesame supply, complementing varieties like RT 46 and RT 125 in the market. Its availability supports diverse procurement strategies for buyers seeking quality white sesame from multiple sourcing regions.',
        characteristics: {
          color: 'Clean white to off-white seed coat',
          shape: 'Plump oval, good boldness',
          averageSize: '3.0–3.4 mm length, 2.0–2.4 mm width',
          taste: 'Pleasant nutty flavour with clean roasted sweetness',
          aroma: 'Delightful sesame aroma, well-suited to food applications',
          storage: 'Good stability; hulled seeds benefit from nitrogen or vacuum packaging for extended shelf life',
        },
        applications: [
          'Hulled white sesame export',
          'Tahini and paste production',
          'Bakery and confectionery',
          'Premium snack toppings',
        ],
        shelfLife: '12–16 months (natural); 10–12 months (hulled) with proper packaging',
        exportSuitability:
          'Good export suitability for hulled and natural white sesame programmes',
      },
    ],
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    slug: 'sunflower',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/sunflower/Sunflower_1.jpg',
    overview:
      'Sunflower is a commercially important oilseed crop in India, cultivated primarily for its high-quality edible oil rich in polyunsaturated fatty acids and Vitamin E. The crop has expanded significantly in Karnataka, Maharashtra, and Andhra Pradesh, supported by hybrids that offer strong yield potential and good oil recovery. GreenWings provides graded sunflower seed for oil extraction and connects buyers with refined sunflower oil supply programmes.\n\nIndian sunflower oil is positioned as a premium heart-healthy cooking medium with clear golden colour, light flavour, and excellent frying stability. Its favourable fatty acid profile — high in linoleic acid with a good balance of monounsaturates — appeals to health-conscious consumers across domestic and export markets. The solvent extraction industry efficiently processes sunflower seed into refined oil, with the resulting meal serving as a valuable protein source for livestock feed.\n\nSunflower cultivation benefits from short duration, drought tolerance, and good fit in multiple cropping systems. The development of improved hybrids with higher oil content and disease resistance continues to strengthen India\'s sunflower sector. GreenWings supports quality-focused procurement with specifications for oil content, seed cleanliness, moisture, and varietal purity.',
    keyBenefits: [
      'Premium heart-healthy oil with high linoleic acid content and naturally rich Vitamin E',
      'Light colour and mild flavour make it versatile for diverse cooking and food-processing applications',
      'Oil content of 38–44 percent ensuring competitive recovery rates for solvent extractors',
      'Sunflower meal provides a high-protein feed ingredient for poultry and livestock industries',
      'Short-duration hybrid crop allowing flexible integration into existing cropping systems',
      'Growing consumer preference for sunflower oil supports expanding domestic and export demand',
    ],
    growingRegions: ['Karnataka', 'Maharashtra', 'Andhra Pradesh', 'Telangana', 'Tamil Nadu'],
    harvestSeason: 'August to October (Kharif); January to March (Rabi)',
    exportAvailability:
      'Sunflower oil is exported from India in refined and crude forms, meeting international food-grade and pharmaceutical-quality standards. Seed export is limited, with domestic crushing absorbing the majority of production. Oil quality and packaging meet global buyer expectations.',
    storageInfo:
      'Sunflower seeds should be dried to below 10 percent moisture and stored in clean, dry, well-ventilated conditions at temperatures below 20 °C. Exposure to heat and humidity accelerates oil degradation. Properly stored seeds maintain quality for 8–10 months; refined oil in sealed containers lasts up to 18 months.',
    nutritionalHighlights: [
      '38–44 percent oil content rich in linoleic acid and oleic acid',
      'One of the richest natural sources of Vitamin E (alpha-tocopherol)',
      'Contains beneficial phytosterols that support cardiovascular health',
      'Good source of B-complex vitamins, particularly thiamine, B6, and folate',
      'Provides essential minerals including selenium, magnesium, and copper',
      'Sunflower meal offers 35–40 percent protein for animal nutrition applications',
    ],
    marketApplications: [
      'Premium refined cooking oil for household, food-service, and industrial frying',
      'Blended vegetable oil formulations combining sunflower with other edible oils',
      'Pharmaceutical and cosmetic-grade oil for skincare, massage, and therapeutic products',
      'Sunflower meal and cake as protein-rich ingredients for poultry and cattle feed',
      'Confectionery-grade kernels for roasted snack and bakery inclusion markets',
      'Margarine and shortening formulations leveraging sunflower oil\'s functional properties',
    ],
    varieties: [
      {
        name: 'KBSH 44',
        slug: 'kbsh-44',
        imagePlaceholder: 'KBSH 44 sunflower hybrid seeds with black striped hulls',
        overview:
          'KBSH 44 is a widely adopted sunflower hybrid in southern India, developed by the University of Agricultural Sciences, Bangalore. It is recognised for its high yield potential, good oil content, and reliable performance across Karnataka\'s diverse growing environments.\n\nThe hybrid produces medium to large seeds with black-striped hulls and competitive oil recovery, making it a preferred choice for oil processors in the region. KBSH 44\'s consistent performance under both rainfed and irrigated conditions supports dependable supply volumes.\n\nKBSH 44 has become a standard reference hybrid in Karnataka\'s sunflower industry, valued by farmers for its agronomic reliability and by processors for its consistent oil quality. Its established market presence ensures efficient trading and competitive procurement pricing.',
        characteristics: {
          color: 'Black-striped seed hull with grey-white kernel',
          shape: 'Elongated oval, medium to large',
          averageSize: '8–12 mm length, 5–7 mm width',
          taste: 'Mildly nutty kernel flavour; oil has light, clean taste',
          aroma: 'Subtle pleasant aroma; refined oil is virtually neutral',
          storage: 'Good storage stability when properly dried; hull provides natural protection for the kernel',
        },
        applications: ['Oil extraction', 'Refined cooking oil', 'Feed meal production', 'Domestic processing'],
        shelfLife: '8–10 months under controlled warehouse storage',
        exportSuitability:
          'Primarily supports domestic oil production for export-grade refined oil supply chains',
      },
      {
        name: 'PAC 36',
        slug: 'pac-36',
        imagePlaceholder: 'PAC 36 sunflower mature flower heads in Karnataka field',
        overview:
          'PAC 36 is a high-performing sunflower hybrid developed for the southern Indian sunflower belt, offering improved yield and oil content compared to older open-pollinated varieties. It has gained strong acceptance in Karnataka and Andhra Pradesh for its consistent field performance and processing quality.\n\nThe hybrid produces bold seeds with good oil recovery and clean extraction characteristics. PAC 36\'s improved genetics translate into better oil yield per unit of seed, which is valued by solvent extraction plants seeking processing efficiency.\n\nPAC 36 represents the ongoing improvement of India\'s sunflower hybrid portfolio, offering farmers better returns per hectare and processors higher quality input material. Its contribution to Karnataka\'s sunflower economy supports the state\'s position as India\'s leading sunflower-producing region.',
        characteristics: {
          color: 'Dark grey to black striped hull with white kernel',
          shape: 'Bold elongated oval',
          averageSize: '9–13 mm length, 5–8 mm width',
          taste: 'Clean nutty kernel flavour with good oil quality',
          aroma: 'Mild seed aroma; oil has pleasant neutral profile',
          storage: 'Good storage behaviour; requires protection from moisture to prevent quality loss',
        },
        applications: [
          'Premium oil extraction',
          'Refined oil production',
          'Blended oil programmes',
          'Feed meal manufacturing',
        ],
        shelfLife: '8–10 months under standard storage conditions',
        exportSuitability:
          'Supports export-grade refined sunflower oil production with consistent quality parameters',
      },
      {
        name: 'Morden',
        slug: 'morden',
        imagePlaceholder: 'Morden sunflower hybrid seeds in agricultural research sample',
        overview:
          'Morden is a recognised sunflower hybrid known for its good adaptation to Indian growing conditions and dependable agronomic performance. It contributes to India\'s sunflower production across multiple states, serving as a reliable component of the national oilseed supply chain.\n\nThe variety produces uniform seeds with acceptable oil content and good extraction characteristics. Morden\'s consistent quality parameters make it well-suited for standard oil crushing and refining programmes.\n\nMorden\'s established presence in the Indian sunflower sector reflects decades of variety evaluation and farmer selection. Its balanced agronomic and quality profile makes it a practical choice for procurement programmes prioritising consistency and availability over premium specifications.',
        characteristics: {
          color: 'Grey to dark striped hull with light grey-white kernel',
          shape: 'Medium oval, uniform size',
          averageSize: '7–11 mm length, 4–6 mm width',
          taste: 'Standard sunflower kernel flavour',
          aroma: 'Typical sunflower seed aroma',
          storage: 'Adequate storage performance under standard conditions',
        },
        applications: ['Oil crushing', 'Standard cooking oil', 'Feed production', 'Domestic market'],
        shelfLife: '8–9 months under proper warehouse management',
        exportSuitability:
          'Contributes to domestic oil production; supports standard export-grade oil supply',
      },
      {
        name: 'PSH 996',
        slug: 'psh-996',
        imagePlaceholder: 'PSH 996 sunflower seed samples in quality control laboratory',
        overview:
          'PSH 996 is an improved sunflower hybrid developed for higher yield potential and enhanced oil content. It represents the advancement of India\'s public-sector sunflower breeding, offering farmers a productive option with measurable quality advantages over older varieties.\n\nThe hybrid produces bold, well-filled seeds with competitive oil recovery rates. PSH 996\'s improved oil content directly benefits solvent extraction operations by delivering higher oil output per unit of seed processed.\n\nPSH 996 is positioned as a modern hybrid for progressive sunflower growers seeking better returns and quality-conscious buyers seeking superior processing input. Its adoption supports the ongoing modernisation of India\'s sunflower production and processing sector.',
        characteristics: {
          color: 'Dark striped hull with bright white kernel',
          shape: 'Bold, well-filled elongated oval',
          averageSize: '9–12 mm length, 5–7 mm width',
          taste: 'Pleasant nutty kernel with good oil quality characteristics',
          aroma: 'Clean aroma profile; refined oil is light and neutral',
          storage: 'Good to very good storage stability with proper drying',
        },
        applications: [
          'High-yield oil extraction',
          'Premium refined oil',
          'Feed meal with improved protein content',
          'Commercial blending programmes',
        ],
        shelfLife: '9–10 months under optimal storage conditions',
        exportSuitability:
          'Supports export-quality refined sunflower oil through improved seed quality and oil recovery',
      },
      {
        name: 'NSFH 9',
        slug: 'nsfh-9',
        imagePlaceholder: 'NSFH 9 sunflower hybrid seeds in processing facility',
        overview:
          'NSFH 9 is a sunflower hybrid recognised for its adaptability and performance in Maharashtra\'s sunflower-growing regions. It contributes to the state\'s significant role in India\'s sunflower economy, offering farmers a dependable hybrid with consistent production characteristics.\n\nThe hybrid produces medium to bold seeds with acceptable oil content suitable for standard crushing and refining operations. NSFH 9\'s field reliability supports steady supply volumes for oil processors operating in Maharashtra and neighbouring states.\n\nNSFH 9 serves as a regional workhorse hybrid in India\'s sunflower sector, balancing agronomic practicality with processing compatibility. Its contribution to Maharashtra\'s sunflower production base supports the state\'s oilseed economy and regional food security.',
        characteristics: {
          color: 'Grey-black striped hull with pale kernel',
          shape: 'Medium to bold oval',
          averageSize: '8–11 mm length, 5–6 mm width',
          taste: 'Standard kernel flavour profile suitable for oil and meal',
          aroma: 'Typical sunflower aroma',
          storage: 'Adequate storage under controlled conditions; moisture management is essential',
        },
        applications: ['Oil crushing', 'Regional refined oil supply', 'Feed meal', 'Domestic trade'],
        shelfLife: '8–9 months with proper drying and warehouse storage',
        exportSuitability:
          'Supports domestic refined oil production with potential for export-grade oil output',
      },
    ],
  },
  {
    id: 'mustard',
    name: 'Mustard / Sarson',
    slug: 'mustard',
    heroImage: 'https://pub-b4b449ec1942478faeec7dcf924c0abe.r2.dev/crop-main/mustard/mustard_1.jpg',
    overview:
      'Mustard is India\'s most culturally significant oilseed crop, deeply embedded in the country\'s culinary traditions, agricultural heritage, and rural economy. Indian mustard oil — known as sarson ka tel — is the preferred cooking medium across northern, eastern, and central India, valued for its pungent flavour, golden colour, and perceived health benefits. GreenWings offers graded mustard seed for oil extraction, condiment manufacturing, and export-oriented supply programmes.\n\nIndia grows several mustard species including Indian mustard (Brassica juncea), yellow mustard (Sinapis alba), and black mustard (Brassica nigra), each serving distinct market segments. The extracted oil serves household cooking, food-service frying, traditional pickle making, and industrial applications, while mustard flour and whole seeds are key ingredients in condiments, sauces, and processed foods.\n\nThe Indian mustard sector benefits from strong domestic demand stability, well-established trading networks, and growing export interest in mustard seed, oil, and meal. GreenWings facilitates quality-focused procurement with attention to oil content, pungency levels, seed cleanliness, and varietal authenticity for buyers seeking reliable mustard supply.',
    keyBenefits: [
      'Deeply rooted in Indian culinary tradition ensuring consistent and strong domestic demand',
      'Oil content of 35–42 percent with characteristic pungent flavour and golden colour',
      'Rich in monounsaturated fatty acids with recognised cardiovascular and anti-inflammatory properties',
      'Natural antimicrobial and preservative properties of mustard oil valued in food preservation',
      'Mustard meal and cake serve as high-value protein ingredients for animal feed',
      'Versatile seed used for oil extraction, condiment manufacturing, and spice applications',
    ],
    growingRegions: ['Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'Haryana', 'West Bengal'],
    harvestSeason: 'February to April (Rabi)',
    exportAvailability:
      'India exports mustard seed, oil, and meal to markets in South Asia, the Middle East, and Southeast Asia. Export grades include brown and yellow mustard seeds for condiment and spice applications, with quality parameters for oil content, pungency, and cleanliness.',
    storageInfo:
      'Mustard seeds should be dried to below 8 percent moisture and stored in cool, dry, well-ventilated warehouses at temperatures below 25 °C. Mustard oil should be stored away from light in sealed containers. Properly stored seeds maintain quality for 12–15 months; oil remains stable for 9–12 months.',
    nutritionalHighlights: [
      '35–42 percent oil content rich in erucic acid, oleic acid, and linoleic acid',
      'Contains glucosinolates and isothiocyanates with recognised health-promoting properties',
      'Good source of Omega-3 fatty acids in the form of alpha-linolenic acid',
      'Rich in selenium, magnesium, and calcium among essential dietary minerals',
      'Contains allyl isothiocyanate responsible for mustard\'s characteristic pungency and preservative qualities',
      'Mustard meal provides 35–38 percent protein with a favourable amino acid profile for animal nutrition',
    ],
    marketApplications: [
      'Premium mustard oil for household cooking, food-service frying, and traditional cuisine',
      'Mustard flour, paste, and condiment production for retail and food-service markets',
      'Whole and ground mustard seed as a spice in Indian, European, and Asian cooking',
      'Industrial applications including lubricants, biofuel feedstock, and pharmaceutical intermediates',
      'Pickle and condiment manufacturing leveraging mustard\'s natural preservative properties',
      'Mustard cake and meal as protein-rich ingredients for cattle and poultry feed',
    ],
    varieties: [
      {
        name: 'Pusa Bold',
        slug: 'pusa-bold',
        imagePlaceholder: 'Pusa Bold mustard seeds with bold brown seed coats in grading tray',
        overview:
          'Pusa Bold is one of India\'s most widely grown Indian mustard varieties, developed by the Indian Agricultural Research Institute. It is celebrated for its bold seed size, high oil content, and strong agronomic performance across the rabi mustard belt of northern India.\n\nThe variety produces large, bold brown seeds with competitive oil recovery, making it the preferred choice for both household-scale and industrial oil extraction. Pusa Bold\'s seed boldness and oil yield directly support better returns for oil millers and more efficient processing operations.\n\nPusa Bold commands a dominant position in India\'s mustard trade, with its name recognised across wholesale markets from Rajasthan to West Bengal. Its consistent quality profile and widespread availability make it the default choice for large-volume mustard procurement programmes.',
        characteristics: {
          color: 'Dark brown to reddish-brown seed coat',
          shape: 'Bold, nearly spherical with slight flattening',
          averageSize: '1.8–2.2 mm diameter (bold grade)',
          taste: 'Strong pungent flavour with sharp, peppery heat',
          aroma: 'Intense mustard aroma with characteristic pungency',
          storage: 'Excellent storage stability under dry conditions; seed coat provides good natural protection',
        },
        applications: ['Mustard oil extraction', 'Condiment manufacturing', 'Whole seed spice trade', 'Feed meal'],
        shelfLife: '12–15 months under proper storage conditions',
        exportSuitability:
          'Highly export-suitable as bold brown mustard seed for South Asian and Middle Eastern markets',
      },
      {
        name: 'Pusa Basanti',
        slug: 'pusa-basanti',
        imagePlaceholder: 'Pusa Basanti yellow mustard seeds in premium export sample',
        overview:
          'Pusa Basanti is a yellow mustard variety noted for its bright golden seed colour, mild pungency, and suitability for condiment and spice applications. Unlike the bold brown Indian mustard types, Pusa Basanti produces lighter-coloured seeds that are preferred in certain culinary traditions and export markets.\n\nThe variety\'s mild pungency and attractive golden colour make it particularly suitable for mustard paste, condiment sauces, and pickling spice blends where a less intense mustard flavour is desired. Its seed appearance supports premium positioning in both domestic and international markets.\n\nPusa Basanti serves a distinct market segment from the dominant brown mustard varieties, offering buyers a specialised yellow mustard option with well-defined quality characteristics. Its availability adds variety and flexibility to India\'s mustard seed export portfolio.',
        characteristics: {
          color: 'Bright golden-yellow seed coat',
          shape: 'Rounded to slightly oval, medium size',
          averageSize: '1.5–1.8 mm diameter',
          taste: 'Mild pungency with clean, slightly sweet mustard flavour',
          aroma: 'Moderate mustard aroma, less intense than brown varieties',
          storage: 'Good storage stability; light colour best preserved in cool, dark conditions',
        },
        applications: [
          'Mustard condiment paste',
          'Pickling spice blends',
          'Mild-flavoured sauces',
          'Premium export seed',
        ],
        shelfLife: '12–14 months under controlled storage',
        exportSuitability:
          'Excellent export suitability as yellow mustard for European, North American, and Asian condiment markets',
      },
      {
        name: 'Kranti',
        slug: 'kranti',
        imagePlaceholder: 'Kranti mustard crop in Rajasthani field approaching harvest',
        overview:
          'Kranti is a high-yielding Indian mustard variety developed for improved agronomic performance in the semi-arid conditions of Rajasthan and surrounding states. It combines good yield potential with acceptable oil content, making it a practical choice for commercial mustard cultivation.\n\nThe variety produces medium to bold brown seeds with reliable oil recovery suitable for both small-scale expeller pressing and industrial solvent extraction. Kranti\'s consistent field performance supports predictable production volumes for procurement programmes.\n\nKranti contributes significantly to Rajasthan\'s dominant position in India\'s mustard economy. Its farmer-friendly agronomic profile and established processing characteristics make it a commercially reliable variety for volume-focused supply chains.',
        characteristics: {
          color: 'Brown to dark brown seed coat',
          shape: 'Oval to nearly spherical, medium-bold',
          averageSize: '1.6–2.0 mm diameter',
          taste: 'Standard pungent mustard flavour with good oil characteristics',
          aroma: 'Strong characteristic mustard aroma',
          storage: 'Good storage behaviour; standard warehouse practices sufficient',
        },
        applications: [
          'Bulk oil extraction',
          'Domestic mustard trade',
          'Feed cake production',
          'Regional condiment markets',
        ],
        shelfLife: '12–14 months under proper dry storage',
        exportSuitability:
          'Suitable for export as standard brown mustard seed with quality grading',
      },
      {
        name: 'Maya',
        slug: 'maya',
        imagePlaceholder: 'Maya mustard variety seeds with clean sorted appearance',
        overview:
          'Maya is an improved mustard variety developed to deliver higher yield and better disease resistance in India\'s rabi mustard-growing regions. It represents progressive breeding efforts to enhance the productivity and reliability of Indian mustard cultivation.\n\nThe variety produces medium-sized brown seeds with good oil content and clean extraction characteristics. Maya\'s improved genetics support more consistent grain quality at harvest, which is valued by processors seeking uniform input material.\n\nMaya is gaining recognition among progressive mustard growers for its agronomic advantages and dependable quality. Its adoption supports the ongoing modernisation of India\'s mustard production sector and provides procurement programmes with a quality-focused variety option.',
        characteristics: {
          color: 'Brown seed coat with smooth, clean appearance',
          shape: 'Rounded oval, uniform medium size',
          averageSize: '1.5–1.9 mm diameter',
          taste: 'Pungent mustard flavour with balanced oil quality',
          aroma: 'Pleasant mustard pungency, moderate intensity',
          storage: 'Good storage stability; maintains quality under standard dry storage',
        },
        applications: [
          'Oil extraction',
          'Domestic and regional trade',
          'Food processing',
          'Feed meal production',
        ],
        shelfLife: '11–13 months under controlled storage conditions',
        exportSuitability:
          'Export-viable with appropriate quality grading and certification',
      },
      {
        name: 'NRCHB 101',
        slug: 'nrchb-101',
        imagePlaceholder: 'NRCHB 101 mustard research samples in controlled environment',
        overview:
          'NRCHB 101 is a modern mustard variety developed through national research programmes to advance India\'s mustard breeding objectives of higher yield, improved oil quality, and better disease tolerance. It represents the cutting edge of Indian mustard genetics available for commercial cultivation.\n\nThe variety produces seeds with competitive oil content and improved oil quality parameters, including favourable fatty acid composition for both culinary and industrial applications. NRCHB 101\'s superior oil characteristics position it for quality-conscious processing programmes.\n\nAs a newer release with demonstrated quality advantages, NRCHB 101 offers GreenWings procurement programmes access to advanced mustard genetics. Its improved profile supports premium positioning in quality-sensitive markets and specialty mustard applications.',
        characteristics: {
          color: 'Dark brown to reddish-brown seed coat, uniform appearance',
          shape: 'Bold, well-filled spherical to oval kernel',
          averageSize: '1.8–2.1 mm diameter',
          taste: 'Rich pungent flavour with superior oil quality characteristics',
          aroma: 'Full-bodied mustard aroma with complex pungency',
          storage: 'Excellent storage stability with good natural seed coat protection',
        },
        applications: [
          'Premium oil extraction',
          'High-quality condiments',
          'Specialty mustard products',
          'Export-grade seed supply',
        ],
        shelfLife: '13–15 months under optimal storage conditions',
        exportSuitability:
          'High export suitability with premium positioning potential for quality-conscious international buyers',
      },
    ],
  },
]
