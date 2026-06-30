export interface PhoneCountry {
  iso2: string
  name: string
  dialCode: string
  minLength: number
  maxLength: number
  exactLengths?: number[]
  example: string
}

type RawPhoneCountry = [string, string, string, string, string]

const commonExactLengths: Record<string, number[]> = {
  AU: [9],
  BD: [10],
  BH: [8],
  CA: [10],
  CN: [11],
  FR: [9],
  IN: [10],
  JP: [10],
  KW: [8],
  LK: [9],
  NP: [10],
  OM: [8],
  PK: [10],
  QA: [8],
  SA: [9],
  SG: [8],
  US: [10],
  AE: [9],
}

const rawCountries: RawPhoneCountry[] = [
  ['AF', 'Afghanistan', '+93', '7-9', '701234567'],
  ['AX', 'Aland Islands', '+358', '5-12', '412345678'],
  ['AL', 'Albania', '+355', '8-9', '671234567'],
  ['DZ', 'Algeria', '+213', '8-9', '551234567'],
  ['AS', 'American Samoa', '+1', '10', '6847331234'],
  ['AD', 'Andorra', '+376', '6-9', '312345'],
  ['AO', 'Angola', '+244', '9', '923123456'],
  ['AI', 'Anguilla', '+1', '10', '2642351234'],
  ['AG', 'Antigua and Barbuda', '+1', '10', '2684641234'],
  ['AR', 'Argentina', '+54', '10', '91123456789'],
  ['AM', 'Armenia', '+374', '8', '77123456'],
  ['AW', 'Aruba', '+297', '7', '5601234'],
  ['AU', 'Australia', '+61', '9', '412345678'],
  ['AT', 'Austria', '+43', '10-13', '6641234567'],
  ['AZ', 'Azerbaijan', '+994', '9', '501234567'],
  ['BS', 'Bahamas', '+1', '10', '2423571234'],
  ['BH', 'Bahrain', '+973', '8', '36001234'],
  ['BD', 'Bangladesh', '+880', '10', '1712345678'],
  ['BB', 'Barbados', '+1', '10', '2462501234'],
  ['BY', 'Belarus', '+375', '9', '291234567'],
  ['BE', 'Belgium', '+32', '8-9', '471234567'],
  ['BZ', 'Belize', '+501', '7', '6221234'],
  ['BJ', 'Benin', '+229', '8-10', '90011234'],
  ['BM', 'Bermuda', '+1', '10', '4413701234'],
  ['BT', 'Bhutan', '+975', '7-8', '17123456'],
  ['BO', 'Bolivia', '+591', '8', '71234567'],
  ['BQ', 'Bonaire, Sint Eustatius and Saba', '+599', '7', '7012345'],
  ['BA', 'Bosnia and Herzegovina', '+387', '8', '61123456'],
  ['BW', 'Botswana', '+267', '7-8', '71123456'],
  ['BR', 'Brazil', '+55', '10-11', '11987654321'],
  ['IO', 'British Indian Ocean Territory', '+246', '7', '3801234'],
  ['VG', 'British Virgin Islands', '+1', '10', '2843001234'],
  ['BN', 'Brunei', '+673', '7', '7123456'],
  ['BG', 'Bulgaria', '+359', '8-9', '881234567'],
  ['BF', 'Burkina Faso', '+226', '8', '70123456'],
  ['BI', 'Burundi', '+257', '8', '79123456'],
  ['KH', 'Cambodia', '+855', '8-9', '12123456'],
  ['CM', 'Cameroon', '+237', '9', '671234567'],
  ['CA', 'Canada', '+1', '10', '4161234567'],
  ['CV', 'Cape Verde', '+238', '7', '9912345'],
  ['KY', 'Cayman Islands', '+1', '10', '3453231234'],
  ['CF', 'Central African Republic', '+236', '8', '70012345'],
  ['TD', 'Chad', '+235', '8', '63012345'],
  ['CL', 'Chile', '+56', '9', '912345678'],
  ['CN', 'China', '+86', '11', '13123456789'],
  ['CX', 'Christmas Island', '+61', '9', '412345678'],
  ['CC', 'Cocos Islands', '+61', '9', '412345678'],
  ['CO', 'Colombia', '+57', '10', '3123456789'],
  ['KM', 'Comoros', '+269', '7', '3212345'],
  ['CG', 'Congo', '+242', '9', '061234567'],
  ['CD', 'Congo Democratic Republic', '+243', '9', '991234567'],
  ['CK', 'Cook Islands', '+682', '5', '71234'],
  ['CR', 'Costa Rica', '+506', '8', '83123456'],
  ['CI', 'Cote d Ivoire', '+225', '8-10', '0701234567'],
  ['HR', 'Croatia', '+385', '8-9', '911234567'],
  ['CU', 'Cuba', '+53', '8', '51234567'],
  ['CW', 'Curacao', '+599', '7', '9512345'],
  ['CY', 'Cyprus', '+357', '8', '96123456'],
  ['CZ', 'Czech Republic', '+420', '9', '601123456'],
  ['DK', 'Denmark', '+45', '8', '20123456'],
  ['DJ', 'Djibouti', '+253', '8', '77123456'],
  ['DM', 'Dominica', '+1', '10', '7672251234'],
  ['DO', 'Dominican Republic', '+1', '10', '8092345678'],
  ['EC', 'Ecuador', '+593', '8-9', '991234567'],
  ['EG', 'Egypt', '+20', '10', '1001234567'],
  ['SV', 'El Salvador', '+503', '8', '70123456'],
  ['GQ', 'Equatorial Guinea', '+240', '9', '222123456'],
  ['ER', 'Eritrea', '+291', '7', '7123456'],
  ['EE', 'Estonia', '+372', '7-8', '51234567'],
  ['SZ', 'Eswatini', '+268', '8', '76123456'],
  ['ET', 'Ethiopia', '+251', '9', '911234567'],
  ['FK', 'Falkland Islands', '+500', '5', '51234'],
  ['FO', 'Faroe Islands', '+298', '6', '211234'],
  ['FJ', 'Fiji', '+679', '7', '7012345'],
  ['FI', 'Finland', '+358', '7-12', '412345678'],
  ['FR', 'France', '+33', '9', '612345678'],
  ['GF', 'French Guiana', '+594', '9', '694123456'],
  ['PF', 'French Polynesia', '+689', '8', '87123456'],
  ['GA', 'Gabon', '+241', '8', '06123456'],
  ['GM', 'Gambia', '+220', '7', '7012345'],
  ['GE', 'Georgia', '+995', '9', '555123456'],
  ['DE', 'Germany', '+49', '10-11', '15123456789'],
  ['GH', 'Ghana', '+233', '9', '241234567'],
  ['GI', 'Gibraltar', '+350', '8', '57123456'],
  ['GR', 'Greece', '+30', '10', '6912345678'],
  ['GL', 'Greenland', '+299', '6', '221234'],
  ['GD', 'Grenada', '+1', '10', '4734031234'],
  ['GP', 'Guadeloupe', '+590', '9', '690123456'],
  ['GU', 'Guam', '+1', '10', '6713001234'],
  ['GT', 'Guatemala', '+502', '8', '51234567'],
  ['GG', 'Guernsey', '+44', '10', '7781123456'],
  ['GN', 'Guinea', '+224', '9', '621123456'],
  ['GW', 'Guinea-Bissau', '+245', '7', '9551234'],
  ['GY', 'Guyana', '+592', '7', '6091234'],
  ['HT', 'Haiti', '+509', '8', '34123456'],
  ['HN', 'Honduras', '+504', '8', '91234567'],
  ['HK', 'Hong Kong', '+852', '8', '51234567'],
  ['HU', 'Hungary', '+36', '9', '201234567'],
  ['IS', 'Iceland', '+354', '7', '6111234'],
  ['IN', 'India', '+91', '10', '9876543210'],
  ['ID', 'Indonesia', '+62', '9-12', '81234567890'],
  ['IR', 'Iran', '+98', '10', '9123456789'],
  ['IQ', 'Iraq', '+964', '10', '7701234567'],
  ['IE', 'Ireland', '+353', '9', '851234567'],
  ['IM', 'Isle of Man', '+44', '10', '7524123456'],
  ['IL', 'Israel', '+972', '9', '501234567'],
  ['IT', 'Italy', '+39', '9-10', '3123456789'],
  ['JM', 'Jamaica', '+1', '10', '8762101234'],
  ['JP', 'Japan', '+81', '10', '9012345678'],
  ['JE', 'Jersey', '+44', '10', '7797123456'],
  ['JO', 'Jordan', '+962', '9', '791234567'],
  ['KZ', 'Kazakhstan', '+7', '10', '7011234567'],
  ['KE', 'Kenya', '+254', '9', '712345678'],
  ['KI', 'Kiribati', '+686', '5-8', '72001234'],
  ['XK', 'Kosovo', '+383', '8', '44123456'],
  ['KW', 'Kuwait', '+965', '8', '50012345'],
  ['KG', 'Kyrgyzstan', '+996', '9', '700123456'],
  ['LA', 'Laos', '+856', '8-10', '2023123456'],
  ['LV', 'Latvia', '+371', '8', '21234567'],
  ['LB', 'Lebanon', '+961', '7-8', '71123456'],
  ['LS', 'Lesotho', '+266', '8', '50123456'],
  ['LR', 'Liberia', '+231', '7-8', '77123456'],
  ['LY', 'Libya', '+218', '9', '912345678'],
  ['LI', 'Liechtenstein', '+423', '7', '6601234'],
  ['LT', 'Lithuania', '+370', '8', '61234567'],
  ['LU', 'Luxembourg', '+352', '9', '621123456'],
  ['MO', 'Macau', '+853', '8', '66123456'],
  ['MG', 'Madagascar', '+261', '9', '321234567'],
  ['MW', 'Malawi', '+265', '9', '991234567'],
  ['MY', 'Malaysia', '+60', '9-10', '123456789'],
  ['MV', 'Maldives', '+960', '7', '7712345'],
  ['ML', 'Mali', '+223', '8', '65012345'],
  ['MT', 'Malta', '+356', '8', '99123456'],
  ['MH', 'Marshall Islands', '+692', '7', '2351234'],
  ['MQ', 'Martinique', '+596', '9', '696123456'],
  ['MR', 'Mauritania', '+222', '8', '22123456'],
  ['MU', 'Mauritius', '+230', '8', '51234567'],
  ['YT', 'Mayotte', '+262', '9', '639123456'],
  ['MX', 'Mexico', '+52', '10', '5512345678'],
  ['FM', 'Micronesia', '+691', '7', '3501234'],
  ['MD', 'Moldova', '+373', '8', '62123456'],
  ['MC', 'Monaco', '+377', '8-9', '612345678'],
  ['MN', 'Mongolia', '+976', '8', '88123456'],
  ['ME', 'Montenegro', '+382', '8', '67123456'],
  ['MS', 'Montserrat', '+1', '10', '6644921234'],
  ['MA', 'Morocco', '+212', '9', '612345678'],
  ['MZ', 'Mozambique', '+258', '9', '821234567'],
  ['MM', 'Myanmar', '+95', '8-10', '912345678'],
  ['NA', 'Namibia', '+264', '9', '811234567'],
  ['NR', 'Nauru', '+674', '7', '5551234'],
  ['NP', 'Nepal', '+977', '10', '9812345678'],
  ['NL', 'Netherlands', '+31', '9', '612345678'],
  ['NC', 'New Caledonia', '+687', '6', '751234'],
  ['NZ', 'New Zealand', '+64', '8-10', '211234567'],
  ['NI', 'Nicaragua', '+505', '8', '81234567'],
  ['NE', 'Niger', '+227', '8', '90123456'],
  ['NG', 'Nigeria', '+234', '10', '8012345678'],
  ['NU', 'Niue', '+683', '4', '1234'],
  ['NF', 'Norfolk Island', '+672', '6', '381234'],
  ['KP', 'North Korea', '+850', '8-10', '1912345678'],
  ['MK', 'North Macedonia', '+389', '8', '70123456'],
  ['MP', 'Northern Mariana Islands', '+1', '10', '6702341234'],
  ['NO', 'Norway', '+47', '8', '41234567'],
  ['OM', 'Oman', '+968', '8', '92123456'],
  ['PK', 'Pakistan', '+92', '10', '3012345678'],
  ['PW', 'Palau', '+680', '7', '6201234'],
  ['PS', 'Palestine', '+970', '9', '599123456'],
  ['PA', 'Panama', '+507', '8', '61234567'],
  ['PG', 'Papua New Guinea', '+675', '7-8', '70123456'],
  ['PY', 'Paraguay', '+595', '9', '981123456'],
  ['PE', 'Peru', '+51', '9', '912345678'],
  ['PH', 'Philippines', '+63', '10', '9171234567'],
  ['PL', 'Poland', '+48', '9', '512345678'],
  ['PT', 'Portugal', '+351', '9', '912345678'],
  ['PR', 'Puerto Rico', '+1', '10', '7872345678'],
  ['QA', 'Qatar', '+974', '8', '33123456'],
  ['RE', 'Reunion', '+262', '9', '692123456'],
  ['RO', 'Romania', '+40', '9', '712345678'],
  ['RU', 'Russia', '+7', '10', '9123456789'],
  ['RW', 'Rwanda', '+250', '9', '781234567'],
  ['BL', 'Saint Barthelemy', '+590', '9', '690123456'],
  ['SH', 'Saint Helena', '+290', '4-5', '51234'],
  ['KN', 'Saint Kitts and Nevis', '+1', '10', '8697651234'],
  ['LC', 'Saint Lucia', '+1', '10', '7582841234'],
  ['MF', 'Saint Martin', '+590', '9', '690123456'],
  ['PM', 'Saint Pierre and Miquelon', '+508', '6', '551234'],
  ['VC', 'Saint Vincent and the Grenadines', '+1', '10', '7844301234'],
  ['WS', 'Samoa', '+685', '5-7', '7212345'],
  ['SM', 'San Marino', '+378', '6-10', '666123456'],
  ['ST', 'Sao Tome and Principe', '+239', '7', '9812345'],
  ['SA', 'Saudi Arabia', '+966', '9', '512345678'],
  ['SN', 'Senegal', '+221', '9', '701234567'],
  ['RS', 'Serbia', '+381', '8-9', '601234567'],
  ['SC', 'Seychelles', '+248', '7', '2512345'],
  ['SL', 'Sierra Leone', '+232', '8', '25123456'],
  ['SG', 'Singapore', '+65', '8', '81234567'],
  ['SX', 'Sint Maarten', '+1', '10', '7215201234'],
  ['SK', 'Slovakia', '+421', '9', '912123456'],
  ['SI', 'Slovenia', '+386', '8', '31123456'],
  ['SB', 'Solomon Islands', '+677', '5-7', '7412345'],
  ['SO', 'Somalia', '+252', '7-9', '611234567'],
  ['ZA', 'South Africa', '+27', '9', '721234567'],
  ['KR', 'South Korea', '+82', '9-10', '1012345678'],
  ['SS', 'South Sudan', '+211', '9', '921123456'],
  ['ES', 'Spain', '+34', '9', '612345678'],
  ['LK', 'Sri Lanka', '+94', '9', '712345678'],
  ['SD', 'Sudan', '+249', '9', '912345678'],
  ['SR', 'Suriname', '+597', '6-7', '7412345'],
  ['SJ', 'Svalbard and Jan Mayen', '+47', '8', '41234567'],
  ['SE', 'Sweden', '+46', '7-10', '701234567'],
  ['CH', 'Switzerland', '+41', '9', '781234567'],
  ['SY', 'Syria', '+963', '9', '944123456'],
  ['TW', 'Taiwan', '+886', '9', '912345678'],
  ['TJ', 'Tajikistan', '+992', '9', '917123456'],
  ['TZ', 'Tanzania', '+255', '9', '621234567'],
  ['TH', 'Thailand', '+66', '9', '812345678'],
  ['TL', 'Timor-Leste', '+670', '7-8', '77212345'],
  ['TG', 'Togo', '+228', '8', '90123456'],
  ['TK', 'Tokelau', '+690', '4', '1234'],
  ['TO', 'Tonga', '+676', '5-7', '7712345'],
  ['TT', 'Trinidad and Tobago', '+1', '10', '8682911234'],
  ['TN', 'Tunisia', '+216', '8', '20123456'],
  ['TR', 'Turkiye', '+90', '10', '5012345678'],
  ['TM', 'Turkmenistan', '+993', '8', '61234567'],
  ['TC', 'Turks and Caicos Islands', '+1', '10', '6492311234'],
  ['TV', 'Tuvalu', '+688', '5-6', '901234'],
  ['VI', 'U.S. Virgin Islands', '+1', '10', '3406421234'],
  ['UG', 'Uganda', '+256', '9', '701234567'],
  ['UA', 'Ukraine', '+380', '9', '501234567'],
  ['AE', 'United Arab Emirates', '+971', '9', '501234567'],
  ['GB', 'United Kingdom', '+44', '10', '7123456789'],
  ['US', 'United States', '+1', '10', '4151234567'],
  ['UY', 'Uruguay', '+598', '8', '91234567'],
  ['UZ', 'Uzbekistan', '+998', '9', '901234567'],
  ['VU', 'Vanuatu', '+678', '5-7', '5912345'],
  ['VA', 'Vatican City', '+39', '9-10', '3123456789'],
  ['VE', 'Venezuela', '+58', '10', '4121234567'],
  ['VN', 'Vietnam', '+84', '9-10', '912345678'],
  ['WF', 'Wallis and Futuna', '+681', '6', '821234'],
  ['EH', 'Western Sahara', '+212', '9', '612345678'],
  ['YE', 'Yemen', '+967', '8-9', '712345678'],
  ['ZM', 'Zambia', '+260', '9', '955123456'],
  ['ZW', 'Zimbabwe', '+263', '9', '771234567'],
]

function parseLengthSpec(spec: string) {
  if (spec.includes('-')) {
    const [min, max] = spec.split('-').map((value) => Number.parseInt(value, 10))
    return { minLength: min, maxLength: max }
  }
  const lengths = spec.split(',').map((value) => Number.parseInt(value, 10)).filter(Boolean)
  const minLength = Math.min(...lengths)
  const maxLength = Math.max(...lengths)
  return { minLength, maxLength, exactLengths: lengths.length > 1 ? lengths : undefined }
}

export const phoneCountries: PhoneCountry[] = rawCountries
  .map(([iso2, name, dialCode, lengthSpec, example]) => {
    const parsed = parseLengthSpec(lengthSpec)
    const exactLengths = commonExactLengths[iso2] || parsed.exactLengths
    return {
      iso2,
      name,
      dialCode,
      minLength: exactLengths ? Math.min(...exactLengths) : parsed.minLength,
      maxLength: exactLengths ? Math.max(...exactLengths) : parsed.maxLength,
      exactLengths,
      example,
    }
  })
  .sort((first, second) => first.name.localeCompare(second.name))

export const defaultPhoneCountry = phoneCountries.find((country) => country.iso2 === 'IN') || phoneCountries[0]

export function getPhoneCountryByIso(iso2: string): PhoneCountry {
  return phoneCountries.find((country) => country.iso2 === iso2) || defaultPhoneCountry
}

export function onlyPhoneDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function formatInternationalPhone(country: PhoneCountry, nationalDigits: string): string {
  return `${country.dialCode} ${onlyPhoneDigits(nationalDigits)}`
}

export function phoneLengthHint(country: PhoneCountry): string {
  if (country.exactLengths?.length === 1) {
    return `${country.name} numbers must be ${country.exactLengths[0]} digits after ${country.dialCode}.`
  }
  if (country.exactLengths?.length) {
    return `${country.name} numbers must be ${country.exactLengths.join(' or ')} digits after ${country.dialCode}.`
  }
  return `${country.name} numbers must be ${country.minLength}-${country.maxLength} digits after ${country.dialCode}.`
}

export function validateNationalPhone(country: PhoneCountry, value: string): string {
  const digits = onlyPhoneDigits(value)
  if (!digits) return 'Please enter a mobile number.'
  if (country.exactLengths?.length && !country.exactLengths.includes(digits.length)) {
    return phoneLengthHint(country)
  }
  if (!country.exactLengths && (digits.length < country.minLength || digits.length > country.maxLength)) {
    return phoneLengthHint(country)
  }
  return ''
}
