export interface GarmentItemData {
  id: string;
  name: string;
  type: string;
  category: string;
  price: string;
  colorName: string;
  colorHex: string;
  image: string;
  backImage: string | null; // Explicit null if photographic back asset not provided
  description: string;
  details: string[];
  sizes: string[];
  fit: string;
  hangerType: 'coat' | 'clip';
  railYOffset: number; // Fine vertical alignment along the curved rail
}

export const GARMENTS: GarmentItemData[] = [
  {
    id: 'varsity-jacket',
    name: 'Archive Varsity Jacket',
    type: 'varsity',
    category: 'Outerwear',
    price: '$380',
    colorName: 'Forest Green / Bone',
    colorHex: '#1B382B',
    image: '/garments/varsity-jacket.png',
    backImage: null,
    description: 'Heavyweight 650gsm Melton wool body paired with full-grain off-white leather sleeves. Chainstitch archive chest monogram and striped wool-ribbed trims.',
    details: [
      'Heavyweight 650gsm Melton wool body',
      'Full-grain off-white leather sleeves',
      'Custom chenille & chainstitch archive embroidery',
      'Dual welt hand pockets with leather triangle reinforcement',
      'Heavy custom snap front closure'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Relaxed boxy silhouette with dropped shoulders',
    hangerType: 'coat',
    railYOffset: 0
  },
  {
    id: 'heavyweight-hoodie-oatmeal',
    name: 'Heavyweight Fleece Hoodie',
    type: 'hoodie',
    category: 'Sweatshirts',
    price: '$210',
    colorName: 'Raw Oatmeal',
    colorHex: '#D8D4CC',
    image: '/garments/heavyweight-hoodie-oatmeal.png',
    backImage: null,
    description: 'Ultra-dense 500gsm custom loopback French terry with pre-shrunk vintage wash. Double-layered crossover hood without drawstrings for a clean architectural fall.',
    details: [
      '500gsm custom combed cotton loopback fleece',
      'Double-ply crossover hood construction',
      'Blind stitch kangaroo pocket',
      'Reverse weave side-ribbing panels for shape retention'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    fit: 'Oversized boxy streetwear drape',
    hangerType: 'coat',
    railYOffset: 8
  },
  {
    id: 'piped-pullover-navy',
    name: 'Piped Track Pullover',
    type: 'crewneck',
    category: 'Knitwear',
    price: '$240',
    colorName: 'Midnight Navy',
    colorHex: '#1A2338',
    image: '/garments/piped-pullover-navy.png',
    backImage: null,
    description: 'Architectural knit pullover featuring contrasting ecru piping along drop-shoulder seams and spine. Heavy drape fabric with structured ribbed cuffs.',
    details: [
      'Structured double-face interlock jersey',
      'Contrast ecru piping through structural seams',
      'Tonal hidden archive silicone badge',
      'Extended ribbed cuffs and hem'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Relaxed drop-shoulder cut',
    hangerType: 'coat',
    railYOffset: 12
  },
  {
    id: 'chunky-knit-burgundy',
    name: 'Washed Merino Crewneck',
    type: 'crewneck',
    category: 'Knitwear',
    price: '$290',
    colorName: 'Oxblood Burgundy',
    colorHex: '#691D26',
    image: '/garments/chunky-knit-burgundy.png',
    backImage: null,
    description: 'Chunky 5-gauge pure Merino wool rib knit with garment-dyed depth. Soft tactile hand feel with substantial warmth and natural drape.',
    details: [
      '100% Extra-fine Australian Merino wool',
      '5-gauge brioche fisherman rib stitch',
      'Folded collar rib and reinforced shoulder tape',
      'Natural temperature-regulating fibers'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Classic relaxed boxy fit',
    hangerType: 'coat',
    railYOffset: 14
  },
  {
    id: 'mohair-striped-cardigan',
    name: 'Brushed Mohair Striped Cardigan',
    type: 'cardigan',
    category: 'Knitwear',
    price: '$340',
    colorName: 'Earthy Multi Stripe',
    colorHex: '#3D5A54',
    image: '/garments/mohair-striped-cardigan.png',
    backImage: null,
    description: 'Artisanal brushed kid mohair blend featuring uneven horizontal bands in dusty teal, rust orange, and ecru. Featherlight loft with cozy insulation.',
    details: [
      '60% Kid Mohair, 25% Wool, 15% Polyamide',
      'Hand-brushed textured surface finish',
      'Genuine corozo nut buttons',
      'Seamless welt pocket detailing'
    ],
    sizes: ['S', 'M', 'L'],
    fit: 'Relaxed slouchy vintage drape',
    hangerType: 'coat',
    railYOffset: 15
  },
  {
    id: 'washed-field-jacket',
    name: 'Vintage Wash Field Jacket',
    type: 'field_jacket',
    category: 'Outerwear',
    price: '$360',
    colorName: 'Faded Olive Drab',
    colorHex: '#364F42',
    image: '/garments/washed-field-jacket.png',
    backImage: null,
    description: 'Enzyme-washed heavyweight cotton canvas military silhouette. Features 3D gusseted bellow pockets, reinforced elbow patches, and custom oxidized hardware.',
    details: [
      '420gsm heavy cotton ripstop canvas',
      'Stone & enzyme vintage wash treatment',
      'Four oversized storm flap pockets',
      'Concealed two-way brass zipper with storm flap'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Roomy utilitarian outerwear cut',
    hangerType: 'coat',
    railYOffset: 15
  },
  {
    id: 'wide-leg-denim',
    name: '14oz Wide-Leg Skater Denim',
    type: 'denim',
    category: 'Bottoms',
    price: '$220',
    colorName: 'Ice Blue Acid Wash',
    colorHex: '#8DA6C2',
    image: '/garments/wide-leg-denim.png',
    backImage: null,
    description: 'Wide straight-cut silhouette crafted from 14oz Japanese selvedge denim. Finished with authentic vintage hand-sanding and nickel clip suspension.',
    details: [
      '14oz Japanese shuttle loom selvedge denim',
      'Custom branded brass rivets and shank button',
      'Stacked hem break with reinforced chainstitch',
      'Classic five-pocket styling with deep coin pocket'
    ],
    sizes: ['30', '32', '34', '36'],
    fit: 'Wide leg with relaxed puddle hem',
    hangerType: 'clip',
    railYOffset: 14
  },
  {
    id: 'chore-work-jacket',
    name: 'Caramel Duck Canvas Chore Coat',
    type: 'chore_coat',
    category: 'Outerwear',
    price: '$310',
    colorName: 'Toasted Caramel',
    colorHex: '#7A4A28',
    image: '/garments/chore-work-jacket.png',
    backImage: null,
    description: 'Rugged duck canvas chore coat with contrasting dark espresso corduroy collar. Built to soften with wear and develop a personalized patina.',
    details: [
      '12oz firm-hand ring-spun duck canvas',
      '8-wale English corduroy collar facing',
      'Triple-needle stitching on high-stress seams',
      'Chest patch pocket with pen slot + twin waist drop pockets'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Square workwear silhouette',
    hangerType: 'coat',
    railYOffset: 12
  },
  {
    id: 'fleece-hoodie-heather',
    name: 'Drop-Shoulder Fleece Hoodie',
    type: 'grey_hoodie',
    category: 'Sweatshirts',
    price: '$210',
    colorName: 'Muted Heather Grey',
    colorHex: '#B8B9B7',
    image: '/garments/fleece-hoodie-heather.png',
    backImage: null,
    description: 'Brushed interior heavyweight fleece with relaxed ergonomic shoulder panelling. Clean front pocket opening and subtle tonal branding stamp.',
    details: [
      '480gsm custom combed cotton fleece',
      'Thermal micro-ribbing at cuffs and waist',
      'Reinforced shoulder tape for drape retention',
      'Seamless hood edge with structured collar base'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Boxy streetwear drape with high waist break',
    hangerType: 'coat',
    railYOffset: 8
  },
  {
    id: 'shadow-plaid-overshirt',
    name: 'Shadow Plaid Flannel Overshirt',
    type: 'flannel',
    category: 'Shirts',
    price: '$230',
    colorName: 'Charcoal & Amber Plaid',
    colorHex: '#38332E',
    image: '/garments/shadow-plaid-overshirt.png',
    backImage: null,
    description: 'Heavyweight brushed cotton twill in custom shadow ombre plaid. Features dual buttoned flap chest pockets and a soft fray-stitched raw hem detail.',
    details: [
      '380gsm double-brushed cotton twill flannel',
      'Woven shadow ombré pattern repeat',
      'Heavy-duty matte black snap buttons',
      'Subtle distress fray detail along the straight hem'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fit: 'Relaxed overshirt profile designed for layering',
    hangerType: 'coat',
    railYOffset: 0
  }
];
