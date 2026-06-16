import type { Category, Product, Variety } from '../data/types'
import type { Lang } from '../data/translations'

type LocalCopy = {
  products: string
  productNotFound: string
  categoryNotFound: string
  backToCategories: string
  requestSpecs: string
  harvestSeason: string
  exportStatus: string
  storage: string
  nutrition: string
  nutritionalHighlights: string
  marketApplications: string
  varieties: string
  varietyIntro: string
  keyCharacteristics: string
  shelfLife: string
  exportSuitability: string
  collapse: string
  expand: string
  interested: (name: string) => string
  enquiryText: string
  submitEnquiry: string
  backTo: (name: string) => string
  productCount: (products: number, varieties: number) => string
  viewProfile: string
  viewAllProducts: string
  explore: string
}

export const catalogueCopy: Record<Lang, LocalCopy> = {
  en: {
    products: 'Products',
    productNotFound: 'Product not found',
    categoryNotFound: 'Category not found',
    backToCategories: '<- Back to all categories',
    requestSpecs: 'Request specifications ->',
    harvestSeason: 'Harvest Season',
    exportStatus: 'Export Status',
    storage: 'Storage',
    nutrition: 'Nutrition',
    nutritionalHighlights: 'Nutritional Highlights',
    marketApplications: 'Market Applications',
    varieties: 'Varieties',
    varietyIntro: 'Click any variety to expand its full profile with characteristics, applications, and export information.',
    keyCharacteristics: 'Key Characteristics',
    shelfLife: 'Shelf Life',
    exportSuitability: 'Export Suitability',
    collapse: 'Collapse',
    expand: 'Expand',
    interested: (name) => `Interested in ${name}?`,
    enquiryText: 'Submit an enquiry and our team will respond with specifications, pricing, and availability.',
    submitEnquiry: 'Submit enquiry ->',
    backTo: (name) => `Back to ${name}`,
    productCount: (products, varieties) => `${products} products · ${varieties} varieties`,
    viewProfile: 'View profile ->',
    viewAllProducts: 'View all products ->',
    explore: 'Explore ->',
  },
  hi: {
    products: 'उत्पाद',
    productNotFound: 'उत्पाद नहीं मिला',
    categoryNotFound: 'श्रेणी नहीं मिली',
    backToCategories: '<- सभी श्रेणियों पर वापस जाएं',
    requestSpecs: 'स्पेसिफिकेशन मांगें ->',
    harvestSeason: 'कटाई का मौसम',
    exportStatus: 'निर्यात स्थिति',
    storage: 'भंडारण',
    nutrition: 'पोषण',
    nutritionalHighlights: 'पोषण विशेषताएं',
    marketApplications: 'बाजार उपयोग',
    varieties: 'किस्में',
    varietyIntro: 'किसी भी किस्म पर क्लिक करके उसकी विशेषताएं, उपयोग और निर्यात जानकारी देखें.',
    keyCharacteristics: 'मुख्य विशेषताएं',
    shelfLife: 'शेल्फ लाइफ',
    exportSuitability: 'निर्यात उपयुक्तता',
    collapse: 'बंद करें',
    expand: 'खोलें',
    interested: (name) => `क्या आप ${name} में रुचि रखते हैं?`,
    enquiryText: 'पूछताछ भेजें और हमारी टीम स्पेसिफिकेशन, कीमत और उपलब्धता के साथ उत्तर देगी.',
    submitEnquiry: 'पूछताछ भेजें ->',
    backTo: (name) => `${name} पर वापस जाएं`,
    productCount: (products, varieties) => `${products} उत्पाद · ${varieties} किस्में`,
    viewProfile: 'प्रोफाइल देखें ->',
    viewAllProducts: 'सभी उत्पाद देखें ->',
    explore: 'देखें ->',
  },
  mr: {
    products: 'उत्पादने',
    productNotFound: 'उत्पादन सापडले नाही',
    categoryNotFound: 'श्रेणी सापडली नाही',
    backToCategories: '<- सर्व श्रेणींवर परत जा',
    requestSpecs: 'तपशील मागवा ->',
    harvestSeason: 'काढणीचा हंगाम',
    exportStatus: 'निर्यात स्थिती',
    storage: 'साठवण',
    nutrition: 'पोषण',
    nutritionalHighlights: 'पोषण वैशिष्ट्ये',
    marketApplications: 'बाजारपेठेतील उपयोग',
    varieties: 'जाती',
    varietyIntro: 'कोणत्याही जातीवर क्लिक करून तिची वैशिष्ट्ये, उपयोग आणि निर्यात माहिती पाहा.',
    keyCharacteristics: 'मुख्य वैशिष्ट्ये',
    shelfLife: 'शेल्फ लाइफ',
    exportSuitability: 'निर्यात योग्यता',
    collapse: 'बंद करा',
    expand: 'उघडा',
    interested: (name) => `${name} मध्ये रुची आहे का?`,
    enquiryText: 'चौकशी पाठवा आणि आमची टीम तपशील, किंमत आणि उपलब्धता यासह उत्तर देईल.',
    submitEnquiry: 'चौकशी पाठवा ->',
    backTo: (name) => `${name} कडे परत जा`,
    productCount: (products, varieties) => `${products} उत्पादने · ${varieties} जाती`,
    viewProfile: 'प्रोफाइल पाहा ->',
    viewAllProducts: 'सर्व उत्पादने पाहा ->',
    explore: 'पाहा ->',
  },
}

const categoryNames: Record<Lang, Record<string, string>> = {
  en: {},
  hi: {
    fruits: 'ताजे फल',
    grains: 'अनाज',
    millets: 'मिलेट',
    pulses: 'दालें',
    vegetables: 'सब्जियां',
    oilseeds: 'तिलहन',
    'export-produce': 'निर्यात उत्पाद',
  },
  mr: {
    fruits: 'ताजी फळे',
    grains: 'धान्य',
    millets: 'मिलेट',
    pulses: 'डाळी',
    vegetables: 'भाज्या',
    oilseeds: 'तेलबिया',
    'export-produce': 'निर्यात उत्पादने',
  },
}

const productNames: Record<Lang, Record<string, string>> = {
  en: {},
  hi: {
    Mango: 'आम',
    Grapes: 'अंगूर',
    Banana: 'केला',
    Pomegranate: 'अनार',
    Guava: 'अमरूद',
    Papaya: 'पपीता',
    Watermelon: 'तरबूज',
    Orange: 'संतरा',
    'Sweet Lime': 'मोसंबी',
    Lemon: 'नींबू',
    Rice: 'चावल',
    Wheat: 'गेहूं',
    Maize: 'मक्का',
    Jowar: 'ज्वार',
    Bajra: 'बाजरा',
    Ragi: 'रागी',
    Chickpea: 'चना',
    'Tur (Pigeon Pea)': 'तूर / अरहर',
    'Urad (Black Gram)': 'उड़द',
    'Masoor (Lentil)': 'मसूर',
    Soybean: 'सोयाबीन',
    Groundnut: 'मूंगफली',
    Sesame: 'तिल',
    Sunflower: 'सूरजमुखी',
    Onion: 'प्याज',
    Tomato: 'टमाटर',
    Garlic: 'लहसुन',
    Turmeric: 'हल्दी',
    Chilli: 'मिर्च',
    Ginger: 'अदरक',
    Coconut: 'नारियल',
    Amla: 'आंवला',
    Saffron: 'केसर',
    Cashew: 'काजू',
    'Black Pepper': 'काली मिर्च',
    Cardamom: 'इलायची',
  },
  mr: {
    Mango: 'आंबा',
    Grapes: 'द्राक्ष',
    Banana: 'केळी',
    Pomegranate: 'डाळिंब',
    Guava: 'पेरू',
    Papaya: 'पपई',
    Watermelon: 'कलिंगड',
    Orange: 'संत्रा',
    'Sweet Lime': 'मोसंबी',
    Lemon: 'लिंबू',
    Rice: 'तांदूळ',
    Wheat: 'गहू',
    Maize: 'मका',
    Jowar: 'ज्वारी',
    Bajra: 'बाजरी',
    Ragi: 'नाचणी',
    Chickpea: 'हरभरा',
    'Tur (Pigeon Pea)': 'तूर',
    'Urad (Black Gram)': 'उडीद',
    'Masoor (Lentil)': 'मसूर',
    Soybean: 'सोयाबीन',
    Groundnut: 'शेंगदाणा',
    Sesame: 'तीळ',
    Sunflower: 'सूर्यफूल',
    Onion: 'कांदा',
    Tomato: 'टोमॅटो',
    Garlic: 'लसूण',
    Turmeric: 'हळद',
    Chilli: 'मिरची',
    Ginger: 'आले',
    Coconut: 'नारळ',
    Amla: 'आवळा',
    Saffron: 'केशर',
    Cashew: 'काजू',
    'Black Pepper': 'काळी मिरी',
    Cardamom: 'वेलदोडा',
  },
}

const characteristicLabels: Record<Lang, Record<string, string>> = {
  en: {},
  hi: {
    color: 'रंग',
    shape: 'आकार',
    averageSize: 'औसत आकार',
    taste: 'स्वाद',
    aroma: 'सुगंध',
    storage: 'भंडारण',
  },
  mr: {
    color: 'रंग',
    shape: 'आकार',
    averageSize: 'सरासरी आकार',
    taste: 'चव',
    aroma: 'सुगंध',
    storage: 'साठवण',
  },
}

const phraseMaps: Record<Lang, Record<string, string>> = {
  en: {},
  hi: {
    High: 'उच्च',
    Medium: 'मध्यम',
    Low: 'कम',
    Excellent: 'उत्कृष्ट',
    Good: 'अच्छी',
    Moderate: 'मध्यम',
    Sweet: 'मीठा',
    Mild: 'हल्का',
    Rich: 'समृद्ध',
    Fresh: 'ताजा',
    Green: 'हरा',
    Yellow: 'पीला',
    Red: 'लाल',
    Black: 'काला',
    White: 'सफेद',
    Golden: 'सुनहरा',
    Firm: 'मजबूत',
    Soft: 'मुलायम',
    Crisp: 'कुरकुरा',
    Aromatic: 'सुगंधित',
    Export: 'निर्यात',
    Domestic: 'घरेलू',
    days: 'दिन',
    weeks: 'सप्ताह',
    months: 'महीने',
    year: 'वर्ष',
    storage: 'भंडारण',
    processing: 'प्रोसेसिंग',
    retail: 'रिटेल',
    markets: 'बाजार',
  },
  mr: {
    High: 'उच्च',
    Medium: 'मध्यम',
    Low: 'कमी',
    Excellent: 'उत्कृष्ट',
    Good: 'चांगली',
    Moderate: 'मध्यम',
    Sweet: 'गोड',
    Mild: 'सौम्य',
    Rich: 'समृद्ध',
    Fresh: 'ताजे',
    Green: 'हिरवा',
    Yellow: 'पिवळा',
    Red: 'लाल',
    Black: 'काळा',
    White: 'पांढरा',
    Golden: 'सोनरी',
    Firm: 'घट्ट',
    Soft: 'मऊ',
    Crisp: 'कुरकुरीत',
    Aromatic: 'सुगंधी',
    Export: 'निर्यात',
    Domestic: 'देशांतर्गत',
    days: 'दिवस',
    weeks: 'आठवडे',
    months: 'महिने',
    year: 'वर्ष',
    storage: 'साठवण',
    processing: 'प्रक्रिया',
    retail: 'रिटेल',
    markets: 'बाजारपेठा',
  },
}

const applicationNames: Record<Lang, Record<string, string>> = {
  en: {},
  hi: {
    'Fresh retail': 'ताजा रिटेल',
    Export: 'निर्यात',
    Processing: 'प्रोसेसिंग',
    'Food service': 'फूड सर्विस',
    'Juice processing': 'जूस प्रोसेसिंग',
    Snacking: 'स्नैकिंग',
    Cooking: 'खाना पकाना',
    Bakery: 'बेकरी',
    'Premium retail': 'प्रीमियम रिटेल',
  },
  mr: {
    'Fresh retail': 'ताजे रिटेल',
    Export: 'निर्यात',
    Processing: 'प्रक्रिया',
    'Food service': 'फूड सर्विस',
    'Juice processing': 'रस प्रक्रिया',
    Snacking: 'स्नॅकिंग',
    Cooking: 'स्वयंपाक',
    Bakery: 'बेकरी',
    'Premium retail': 'प्रीमियम रिटेल',
  },
}

function displayProductName(name: string, lang: Lang): string {
  return productNames[lang][name] ?? name
}

function localizeSimpleText(value: string, lang: Lang): string {
  if (lang === 'en') return value
  let output = value
  Object.entries(phraseMaps[lang]).forEach(([from, to]) => {
    output = output.replace(new RegExp(`\\b${from}\\b`, 'gi'), to)
  })
  return output
}

function localizeList(items: string[], lang: Lang): string[] {
  if (lang === 'en') return items
  return items.map((item) => applicationNames[lang][item] ?? localizeSimpleText(item, lang))
}

function localizedCategoryIntro(category: Category, lang: Lang): string {
  if (lang === 'en') return category.description
  const name = categoryNames[lang][category.slug] ?? category.name
  if (lang === 'hi') {
    return `${name} श्रेणी में किसानों, खरीदारों और भागीदारों के लिए प्रमुख भारतीय उत्पादों की जानकारी दी गई है. GreenWings गुणवत्ता, ग्रेडिंग, सुरक्षित हैंडलिंग और बाजार संपर्क पर ध्यान देकर इस श्रेणी को घरेलू और निर्यात अवसरों से जोड़ता है.`
  }
  return `${name} श्रेणीमध्ये शेतकरी, खरेदीदार आणि भागीदारांसाठी प्रमुख भारतीय उत्पादनांची माहिती दिली आहे. GreenWings गुणवत्ता, ग्रेडिंग, सुरक्षित हाताळणी आणि बाजारपेठ संपर्क यावर भर देऊन ही श्रेणी देशांतर्गत आणि निर्यात संधींशी जोडते.`
}

function localizedProductOverview(product: Product, lang: Lang): string {
  if (lang === 'en') return product.overview
  const name = displayProductName(product.name, lang)
  const regions = product.growingRegions.slice(0, 4).join(', ')
  const benefits = localizeList(product.keyBenefits.slice(0, 3), lang).join(', ')
  if (lang === 'hi') {
    return `${name} GreenWings के उत्पाद पोर्टफोलियो का महत्वपूर्ण हिस्सा है. यह उत्पाद ${regions || 'भारत के प्रमुख कृषि क्षेत्रों'} से जुड़ा है और किसानों, खरीदारों, प्रोसेसिंग यूनिट्स तथा निर्यात बाजारों के लिए भरोसेमंद गुणवत्ता प्रदान करता है. इसकी प्रमुख खूबियां ${benefits || 'गुणवत्ता, सुरक्षित हैंडलिंग और बाजार उपयोग'} हैं. GreenWings इस उत्पाद के लिए ग्रेडिंग, सॉर्टिंग, सुरक्षित भंडारण, उपलब्धता और बाजार आवश्यकताओं के अनुसार सप्लाई सपोर्ट देता है.`
  }
  return `${name} हे GreenWings च्या उत्पादन पोर्टफोलिओमधील महत्त्वाचे उत्पादन आहे. हे उत्पादन ${regions || 'भारताच्या प्रमुख कृषी भागां'}शी जोडलेले असून शेतकरी, खरेदीदार, प्रक्रिया उद्योग आणि निर्यात बाजारांसाठी विश्वासार्ह गुणवत्ता देते. याची प्रमुख वैशिष्ट्ये ${benefits || 'गुणवत्ता, सुरक्षित हाताळणी आणि बाजारपेठ उपयोग'} आहेत. GreenWings या उत्पादनासाठी ग्रेडिंग, सॉर्टिंग, सुरक्षित साठवण, उपलब्धता आणि बाजारपेठेच्या गरजेनुसार पुरवठा सहाय्य देते.`
}

function localizedVarietyOverview(productName: string, variety: Variety, lang: Lang): string {
  if (lang === 'en') return variety.overview
  const applications = localizeList(variety.applications, lang).join(', ')
  const color = localizeSimpleText(variety.characteristics.color, lang)
  const taste = localizeSimpleText(variety.characteristics.taste, lang)
  if (lang === 'hi') {
    return `${variety.name} ${productName} की एक महत्वपूर्ण किस्म है. इसका रंग ${color} और स्वाद ${taste} माना जाता है, इसलिए यह ${applications || 'ताजा बाजार और प्रसंस्करण'} के लिए उपयोगी है. GreenWings इस किस्म के लिए आकार, गुणवत्ता, भंडारण और निर्यात उपयुक्तता जैसी जानकारी स्पष्ट रूप से प्रस्तुत करता है.`
  }
  return `${variety.name} ही ${productName} ची महत्त्वाची जात आहे. तिचा रंग ${color} आणि चव ${taste} मानली जाते, त्यामुळे ती ${applications || 'ताज्या बाजारपेठ आणि प्रक्रिया'} यासाठी उपयुक्त आहे. GreenWings या जातीसाठी आकार, गुणवत्ता, साठवण आणि निर्यात योग्यता यांची माहिती स्पष्टपणे सादर करते.`
}

export function localizeCategory(category: Category, lang: Lang): Category {
  if (lang === 'en') return category
  const name = categoryNames[lang][category.slug] ?? category.name
  return {
    ...category,
    name,
    description: localizedCategoryIntro(category, lang),
    tagline: localizedCategoryIntro(category, lang),
  }
}

export function localizeProduct(product: Product, lang: Lang): Product {
  if (lang === 'en') return product
  const name = displayProductName(product.name, lang)
  return {
    ...product,
    name,
    overview: localizedProductOverview(product, lang),
    keyBenefits: localizeList(product.keyBenefits, lang),
    harvestSeason: localizeSimpleText(product.harvestSeason, lang),
    exportAvailability: localizeSimpleText(product.exportAvailability, lang),
    storageInfo: localizeSimpleText(product.storageInfo, lang),
    nutritionalHighlights: localizeList(product.nutritionalHighlights, lang),
    marketApplications: localizeList(product.marketApplications, lang),
    varieties: product.varieties.map((variety) => ({
      ...variety,
      overview: localizedVarietyOverview(name, variety, lang),
      applications: localizeList(variety.applications, lang),
      characteristics: Object.fromEntries(
        Object.entries(variety.characteristics).map(([key, value]) => [
          characteristicLabels[lang][key] ?? key,
          localizeSimpleText(value, lang),
        ]),
      ) as unknown as Variety['characteristics'],
      shelfLife: localizeSimpleText(variety.shelfLife, lang),
      exportSuitability: localizeSimpleText(variety.exportSuitability, lang),
    })),
  }
}
