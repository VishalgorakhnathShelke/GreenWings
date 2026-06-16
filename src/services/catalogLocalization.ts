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
    'Dragon Fruit': '\u0921\u094d\u0930\u0948\u0917\u0928 \u092b\u094d\u0930\u0942\u091f',
    Orange: 'संतरा',
    'Sweet Lime': 'मोसंबी',
    'Custard Apple': '\u0938\u0940\u0924\u093e\u092b\u0932',
    Lemon: 'नींबू',
    Rice: 'चावल',
    Wheat: 'गेहूं',
    Maize: 'मक्का',
    Jowar: 'ज्वार',
    'Jowar / Sorghum': '\u091c\u094d\u0935\u093e\u0930',
    Bajra: 'बाजरा',
    'Bajra / Pearl Millet': '\u092c\u093e\u091c\u0930\u093e',
    Ragi: 'रागी',
    'Ragi / Finger Millet': '\u0930\u093e\u0917\u0940 / \u092e\u0902\u0921\u0941\u0906',
    Chickpea: 'चना',
    'Chana / Chickpea': '\u091a\u0928\u093e',
    'Tur (Pigeon Pea)': 'तूर / अरहर',
    'Tur / Arhar / Pigeon Pea': '\u0924\u0942\u0930 / \u0905\u0930\u0939\u0930',
    'Moong / Green Gram': '\u092e\u0942\u0902\u0917',
    'Urad (Black Gram)': 'उड़द',
    'Urad / Black Gram': '\u0909\u0921\u093c\u0926',
    'Masoor (Lentil)': 'मसूर',
    'Masoor / Red Lentil': '\u092e\u0938\u0942\u0930',
    Soybean: 'सोयाबीन',
    Groundnut: 'मूंगफली',
    'Groundnut / Peanut': '\u092e\u0942\u0902\u0917\u092b\u0932\u0940',
    Sesame: 'तिल',
    'Sesame / Til': '\u0924\u093f\u0932',
    Sunflower: 'सूरजमुखी',
    'Mustard / Sarson': '\u0938\u0930\u0938\u094b\u0902',
    Onion: 'प्याज',
    Tomato: 'टमाटर',
    Potato: '\u0906\u0932\u0942',
    Cauliflower: '\u092b\u0942\u0932\u0917\u094b\u092d\u0940',
    'Brinjal / Eggplant': '\u092c\u0948\u0902\u0917\u0928',
    'Okra / Bhindi': '\u092d\u093f\u0902\u0921\u0940',
    'Capsicum / Bell Pepper': '\u0936\u093f\u092e\u0932\u093e \u092e\u093f\u0930\u094d\u091a',
    'Green Chillies': '\u0939\u0930\u0940 \u092e\u093f\u0930\u094d\u091a',
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
    'Cardamom (Green)': '\u0939\u0930\u0940 \u0907\u0932\u093e\u092f\u091a\u0940',
  },
  mr: {
    Mango: 'आंबा',
    Grapes: 'द्राक्ष',
    Banana: 'केळी',
    Pomegranate: 'डाळिंब',
    Guava: 'पेरू',
    Papaya: 'पपई',
    Watermelon: 'कलिंगड',
    'Dragon Fruit': '\u0921\u094d\u0930\u0945\u0917\u0928 \u092b\u094d\u0930\u0942\u091f',
    Orange: 'संत्रा',
    'Sweet Lime': 'मोसंबी',
    'Custard Apple': '\u0938\u0940\u0924\u093e\u092b\u0933',
    Lemon: 'लिंबू',
    Rice: 'तांदूळ',
    Wheat: 'गहू',
    Maize: 'मका',
    Jowar: 'ज्वारी',
    'Jowar / Sorghum': '\u091c\u094d\u0935\u093e\u0930\u0940',
    Bajra: 'बाजरी',
    'Bajra / Pearl Millet': '\u092c\u093e\u091c\u0930\u0940',
    Ragi: 'नाचणी',
    'Ragi / Finger Millet': '\u0928\u093e\u091a\u0923\u0940',
    Chickpea: 'हरभरा',
    'Chana / Chickpea': '\u0939\u0930\u092d\u0930\u093e',
    'Tur (Pigeon Pea)': 'तूर',
    'Tur / Arhar / Pigeon Pea': '\u0924\u0942\u0930',
    'Moong / Green Gram': '\u092e\u0942\u0917',
    'Urad (Black Gram)': 'उडीद',
    'Urad / Black Gram': '\u0909\u0921\u0940\u0926',
    'Masoor (Lentil)': 'मसूर',
    'Masoor / Red Lentil': '\u092e\u0938\u0942\u0930',
    Soybean: 'सोयाबीन',
    Groundnut: 'शेंगदाणा',
    'Groundnut / Peanut': '\u0936\u0947\u0902\u0917\u0926\u093e\u0923\u093e',
    Sesame: 'तीळ',
    'Sesame / Til': '\u0924\u0940\u0933',
    Sunflower: 'सूर्यफूल',
    'Mustard / Sarson': '\u092e\u094b\u0939\u0930\u0940',
    Onion: 'कांदा',
    Tomato: 'टोमॅटो',
    Potato: '\u092c\u091f\u093e\u091f\u093e',
    Cauliflower: '\u092b\u0941\u0932\u0915\u094b\u092c\u0940',
    'Brinjal / Eggplant': '\u0935\u093e\u0902\u0917\u0940',
    'Okra / Bhindi': '\u092d\u0947\u0902\u0921\u0940',
    'Capsicum / Bell Pepper': '\u0922\u094b\u092c\u0933\u0940 \u092e\u093f\u0930\u091a\u0940',
    'Green Chillies': '\u0939\u093f\u0930\u0935\u0940 \u092e\u093f\u0930\u091a\u0940',
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
    'Cardamom (Green)': '\u0939\u093f\u0930\u0935\u093e \u0935\u0947\u0932\u0926\u094b\u0921\u093e',
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

function displayProductName(name: string, lang: Lang): string {
  return productNames[lang][name] ?? name
}

function localizedKeyBenefits(productName: string, lang: Lang): string[] {
  if (lang === 'hi') {
    return [
      `${productName} के लिए भरोसेमंद गुणवत्ता`,
      'ग्रेडिंग और सुरक्षित हैंडलिंग',
      'किसान और खरीदार दोनों के लिए उपयोगी जानकारी',
      'घरेलू और निर्यात बाजारों के लिए सप्लाई सपोर्ट',
    ]
  }
  return [
    `${productName} साठी विश्वासार्ह गुणवत्ता`,
    'ग्रेडिंग आणि सुरक्षित हाताळणी',
    'शेतकरी आणि खरेदीदारांसाठी उपयुक्त माहिती',
    'देशांतर्गत आणि निर्यात बाजारपेठेसाठी पुरवठा सहाय्य',
  ]
}

function localizedNutrition(productName: string, lang: Lang): string[] {
  if (lang === 'hi') {
    return [
      `${productName} का पोषण मूल्य किस्म, मिट्टी और खेती पद्धति के अनुसार बदल सकता है.`,
      'ताजा और सही तरीके से संभाला गया उत्पाद बेहतर गुणवत्ता बनाए रखता है.',
      'उपयोग से पहले ग्रेड, आकार, परिपक्वता और भंडारण स्थिति की पुष्टि करें.',
    ]
  }
  return [
    `${productName} चे पोषण मूल्य जात, माती आणि शेती पद्धतीनुसार बदलू शकते.`,
    'ताजे आणि योग्य प्रकारे हाताळलेले उत्पादन चांगली गुणवत्ता टिकवते.',
    'वापरापूर्वी ग्रेड, आकार, परिपक्वता आणि साठवण स्थितीची खात्री करा.',
  ]
}

function localizedMarketApplications(lang: Lang): string[] {
  if (lang === 'hi') {
    return [
      'ताजा घरेलू बाजार और संगठित रिटेल',
      'प्रोसेसिंग, पैकिंग और वैल्यू-एडेड उत्पाद',
      'ग्रेड और गुणवत्ता के अनुसार निर्यात अवसर',
      'थोक खरीदार, व्यापारी और संस्थागत मांग',
    ]
  }
  return [
    'ताजी देशांतर्गत बाजारपेठ आणि संघटित रिटेल',
    'प्रक्रिया, पॅकिंग आणि मूल्यवर्धित उत्पादने',
    'ग्रेड आणि गुणवत्तेनुसार निर्यात संधी',
    'घाऊक खरेदीदार, व्यापारी आणि संस्थात्मक मागणी',
  ]
}

function localizedHarvestSeason(lang: Lang): string {
  return lang === 'hi'
    ? 'हंगाम किस्म, प्रदेश और खेती पद्धति के अनुसार बदलता है.'
    : 'हंगाम जात, प्रदेश आणि शेती पद्धतीनुसार बदलतो.'
}

function localizedExportAvailability(lang: Lang): string {
  return lang === 'hi'
    ? 'ग्रेडिंग, पैकिंग और गुणवत्ता मानक पूरे होने पर उपलब्ध.'
    : 'ग्रेडिंग, पॅकिंग आणि गुणवत्ता निकष पूर्ण झाल्यास उपलब्ध.'
}

function localizedStorageInfo(lang: Lang): string {
  return lang === 'hi'
    ? 'उत्पाद के अनुसार स्वच्छ, सुरक्षित और नियंत्रित भंडारण आवश्यक.'
    : 'उत्पादनानुसार स्वच्छ, सुरक्षित आणि नियंत्रित साठवण आवश्यक.'
}

function localizedVarietyApplications(lang: Lang): string[] {
  return lang === 'hi'
    ? ['ताजा बाजार', 'प्रोसेसिंग', 'निर्यात/घरेलू मांग']
    : ['ताजी बाजारपेठ', 'प्रक्रिया', 'निर्यात/देशांतर्गत मागणी']
}

function localizedCharacteristics(lang: Lang): Variety['characteristics'] {
  if (lang === 'hi') {
    return {
      color: 'किस्म और ग्रेड के अनुसार',
      shape: 'किस्म के अनुसार',
      averageSize: 'ग्रेड और बाजार आवश्यकता के अनुसार',
      taste: 'किस्म और परिपक्वता के अनुसार',
      aroma: 'प्राकृतिक सुगंध',
      storage: 'साफ और सुरक्षित भंडारण में रखें',
    }
  }
  return {
    color: 'जात आणि ग्रेडनुसार',
    shape: 'जातीनुसार',
    averageSize: 'ग्रेड आणि बाजारपेठेच्या गरजेनुसार',
    taste: 'जात आणि परिपक्वतेनुसार',
    aroma: 'नैसर्गिक सुगंध',
    storage: 'स्वच्छ आणि सुरक्षित साठवणीत ठेवा',
  }
}

function localizedShelfLife(lang: Lang): string {
  return lang === 'hi'
    ? 'शेल्फ लाइफ किस्म, पैकिंग और भंडारण स्थिति पर निर्भर करती है.'
    : 'शेल्फ लाइफ जात, पॅकिंग आणि साठवण स्थितीवर अवलंबून असते.'
}

function localizedVarietyExportSuitability(lang: Lang): string {
  return lang === 'hi'
    ? 'उचित ग्रेडिंग, पैकिंग और गुणवत्ता जांच के बाद निर्यात के लिए उपयुक्त.'
    : 'योग्य ग्रेडिंग, पॅकिंग आणि गुणवत्ता तपासणीनंतर निर्यातीसाठी योग्य.'
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
  const benefits = localizedKeyBenefits(name, lang).slice(0, 3).join(', ')
  if (lang === 'hi') {
    return `${name} GreenWings के उत्पाद पोर्टफोलियो का महत्वपूर्ण हिस्सा है. यह किसानों, खरीदारों, प्रोसेसिंग यूनिट्स और निर्यात बाजारों के लिए भरोसेमंद गुणवत्ता और व्यवस्थित जानकारी प्रदान करता है. इसकी प्रमुख खूबियां ${benefits} हैं. GreenWings इस उत्पाद के लिए ग्रेडिंग, सॉर्टिंग, सुरक्षित भंडारण, उपलब्धता और बाजार आवश्यकता के अनुसार सप्लाई सपोर्ट देता है.`
  }
  return `${name} हे GreenWings च्या उत्पादन पोर्टफोलिओमधील महत्त्वाचे उत्पादन आहे. हे शेतकरी, खरेदीदार, प्रक्रिया उद्योग आणि निर्यात बाजारांसाठी विश्वासार्ह गुणवत्ता आणि व्यवस्थित माहिती देते. याची प्रमुख वैशिष्ट्ये ${benefits} आहेत. GreenWings या उत्पादनासाठी ग्रेडिंग, सॉर्टिंग, सुरक्षित साठवण, उपलब्धता आणि बाजारपेठेच्या गरजेनुसार पुरवठा सहाय्य देते.`
}

function localizedVarietyOverview(productName: string, variety: Variety, lang: Lang): string {
  if (lang === 'en') return variety.overview
  const applications = localizedVarietyApplications(lang).join(', ')
  const characteristics = localizedCharacteristics(lang)
  if (lang === 'hi') {
    return `${variety.name} ${productName} की एक महत्वपूर्ण किस्म है. इसकी विशेषताएं ${characteristics.color}, ${characteristics.taste} और सुरक्षित हैंडलिंग पर आधारित होती हैं. यह ${applications} के लिए उपयोगी है. GreenWings इस किस्म के लिए आकार, गुणवत्ता, भंडारण और निर्यात उपयुक्तता जैसी जानकारी स्पष्ट रूप से प्रस्तुत करता है.`
  }
  return `${variety.name} ही ${productName} ची महत्त्वाची जात आहे. तिची वैशिष्ट्ये ${characteristics.color}, ${characteristics.taste} आणि सुरक्षित हाताळणीवर आधारित असतात. ती ${applications} यासाठी उपयुक्त आहे. GreenWings या जातीसाठी आकार, गुणवत्ता, साठवण आणि निर्यात योग्यता यांची माहिती स्पष्टपणे सादर करते.`
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
    keyBenefits: localizedKeyBenefits(name, lang),
    harvestSeason: localizedHarvestSeason(lang),
    exportAvailability: localizedExportAvailability(lang),
    storageInfo: localizedStorageInfo(lang),
    nutritionalHighlights: localizedNutrition(name, lang),
    marketApplications: localizedMarketApplications(lang),
    varieties: product.varieties.map((variety) => ({
      ...variety,
      overview: localizedVarietyOverview(name, variety, lang),
      applications: localizedVarietyApplications(lang),
      characteristics: Object.fromEntries(
        Object.entries(localizedCharacteristics(lang)).map(([key, value]) => [
          characteristicLabels[lang][key] ?? key,
          value,
        ]),
      ) as unknown as Variety['characteristics'],
      shelfLife: localizedShelfLife(lang),
      exportSuitability: localizedVarietyExportSuitability(lang),
    })),
  }
}
