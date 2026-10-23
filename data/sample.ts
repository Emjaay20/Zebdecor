export interface Product {
  id: string;
  name: string;
  price: string;
  clientPrice: string;
  category: 'living' | 'dining' | 'bedroom' | 'office' | 'storage' | 'lighting' | 'tables';
  tag: string;
  badge?: string;
  ref: string;
  description: string;
  subtitle: string;
  materialsNote: string;
  dimensions: string;
  provenance: string;
  hasAR: boolean;
  image: string;
  gallery: { src: string; label: string; alt: string }[];
  swatches: { name: string; color: string }[];
  scales?: { name: string; dimension: string; price: string }[];
  slabOptions?: { name: string; gradient: string }[];
  timberOptions?: { name: string; color: string }[];
  textiles?: { name: string; color: string }[];
  finishes?: { name: string; label: string }[];
  specs: { label: string; value: string }[];
  complementaryIds?: string[];
  pillarCards?: { icon: string; title: string; desc: string; note: string }[];
}

export interface Project {
  slug: string;
  title: string;
  location: string;
  scope: string;
  headline: string;
  description: string;
  quoteTitle: string;
  quoteText: string;
  stats: { value: string; label: string }[];
  image: string;
}

export interface Material {
  id: string;
  name: string;
  badge: string;
  description: string;
  image: string;
}

export interface Category {
  id: string;
  slug: string;
  title: string;
  badge: string;
  countBadge: string;
  description: string;
  image: string;
}

export const categories: Category[] = [
  {
    id: 'living',
    slug: 'living',
    title: 'Living',
    badge: 'Curated Living',
    countBadge: '24 Bespoke Designs',
    description: 'Curved bouclé sofas, sculptural travertine coffee tables, walnut media consoles, and custom modular daybeds.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmw-Jz4i5NMI4n0xM0rBzqI7uLoB6SORsMdOU6laT7g0vbNd0NG7hF0UFpN1NRfIHNN3agn-zbmO2l6NZcGNSBKqS3mf5atCqE6QwPtb3pbjcOeexpJiGTELgkbrQCUh1qC7sQT-7Z4J2JI0gvJ8qi2Uuru4FR7fRPyNlVfrHEOo6rNzng-15YKkog42FuuxyYd2XgiIpCKplYVRrBHqrOGmNlrQ_JlJNBlydgICXYmZsK19D7TQ6p',
  },
  {
    id: 'bedroom',
    slug: 'bedroom',
    title: 'Bedroom',
    badge: 'Master Sanctuaries',
    countBadge: '18 Master Suites',
    description: 'Floating oak platform beds, upholstered velvet headboards, integrated ambient nightstands, and walk-in dressing suites.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBemxtMLzj-mrywf8ham7LXHAHb5XMYJKWYvknIwZXwX34UmHxDOln6C3rReaj9iI9SVx-gyDu0gciQ6gVncWbaw_1TXaF5AwM22QY0NYv1Akr-BorjOO5RAWkJ6LsCXkQsa2HZS-7yRImaLL59JKHRIF_twsMQ_N4VMB6GtKisSlF9r8QGueCltS5TvAnPZgCUMamBV1i3JWryDv1gZosVITLxrkDpw5PWcEUpq76sp3aFfs4Gs8Do',
  },
  {
    id: 'dining',
    slug: 'dining',
    title: 'Dining',
    badge: 'Architectural Banquets',
    countBadge: '16 Curated Tables',
    description: 'Solid Iroko and Teak expandable dining tables, sculpted dining armchairs, and monolithic wine credenzas.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDo1w22Q93wjHIiOzGHcfs3b-cAVv8TEZ3210XuSyUmndvZVGpg015RNLSH9f6ftvcoSkyE_ZDV8soKRst-T1y1BtYA5By6mEuW_fWaTMg-TgbfKnw1nnqDWki-WjYZdh3SPW218EqUvoe9w1GbUUFFYlEfC063672nxlS8r5I9_Mm08SERFOfIrOXNc6dnF1F1PSjKVZFXD0uOPyPRSByWHRzSl3EyFA6OjG8EElBrH_8DJ3Y0jH3c',
  },
  {
    id: 'office',
    slug: 'office',
    title: 'Office',
    badge: 'Executive Studies',
    countBadge: '12 Executive Suites',
    description: 'Executive fluted mahogany desks, ergonomic top-grain leather seating, acoustic millwork, and private conference tables.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCHr9KJIKjOIGbVEeTbJZ941VNlmFubPEvvVdph89Z2dMR6lvY_sffomUVP72PzbciRk7WtLiKDvdaA2npTKiNSW35cUXQ0x9JpEBMq2PBriXNiltgi9G3jcNRrA7_hz7tB7owjkQgR6JF9fqtdHgU4YLx9ka8x3RuTkVYJ-g8Zm8zUVYKkxw60bk-xTS0KqFpdKMe8wBpD2U7wFbj5q4f4uPEoB68tcSYbEPWMStvP2otUX-RzFB5T',
  },
  {
    id: 'kitchen',
    slug: 'kitchen',
    title: 'Kitchen & Joinery',
    badge: 'Architectural Joinery',
    countBadge: 'Bespoke Joinery',
    description: 'Architectural cabinetry, fluted marble islands, concealed butler pantries, and bespoke brass-framed display cases.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9jws6cNLDreNDeXlcgcNxXPdHgjwMCugdrcpPuuhRDd-XzoffFFAMLV_YObshRGlQEMlLYB-p8CojPXftsbMTaiBBIAFI9qi3FiVo7Q-8c45iZEe1AmMvNGfjWM6Fh28Jrlo6nKkgCfZJXYmCOWk8qgcs6lowRplcihXGqjgXnYbExnuItalzIqlDPv2IwRyPZ90oP45sMSZ-QCaa4UmqO97fq1GiLbYnr8gM50k0RzJAwkjngX-l',
  },
  {
    id: 'turnkey',
    slug: 'turnkey',
    title: 'Custom Turnkey',
    badge: 'Spatial Turnkey',
    countBadge: 'Private Commissions',
    description: 'Complete spatial architecture fit-outs, private diplomatic villas, commercial penthouses, and bespoke hospitality suites.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA2qdwDe98VUVXEpxb1VzPgeIRl3x_aNzYmTMCkqze4noMEZxGfWDaoOv8VQ6occYrD8tvdHNBK2p0FEo16Rf1WgLiIFBs1cqDMl7Tr22-hpFBlaeKJHKh-KnTtyNb-aCOOcuSE7AxiOVDZL04Ujnl0uGP72-oHq8UQ9CUTguyOdVIIOAMgfyyJ3gOTK0J399s6qRIku0zerHFTXyz1C7tM4ySalDHDVa8ZUL_ZlM-5obsYRpwrOTrj',
  },
];

export const products: Product[] = [
  {
    id: 'the-aso-curved-sofa',
    name: 'The Aso Minimalist Curved Sofa',
    price: '₦4,850,000',
    clientPrice: '₦4,850,000',
    category: 'living',
    tag: 'Made in Maitama',
    badge: 'Flagship Living Masterpiece',
    ref: 'ZEB-ASO-2025',
    description:
      'A sculptural organic silhouette inspired by the undulating granite hills of Abuja. Handcrafted with kiln-seasoned Benue teak framing, double-density ergonomic latex core with pure down-blend envelopment, trimmed in vegetable-tanned saddle leather.',
    subtitle: 'Ivory Italian Bouclé • Seasoned Walnut Frame • Down Blend Cushioning',
    materialsNote: 'Ivory Italian Bouclé • Seasoned Walnut Frame • Down Blend Cushioning',
    dimensions: '2800L x 1150W x 780H mm',
    provenance: 'Seasoned Benue Teak • Maitama Atelier Spec',
    hasAR: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAhlL5B9IZW04Uc4006wJJhSgZ58z4xpu9JrVrlYTuGfVJJ4IKeIwC4rkGGUdgsWXgQGRkZEXBNBcRloxbe_gSQyO47QhesxWDciSXNPj1d8azCXI9iqe3JWdkb95R_UDd3IT60LVaAL9zAGvBJdpK7B8xWEdVql-Q3ab7sklU2OGszFG98JPVLu-n-d3t2cqafQ8cIFEnS25SSB_LIe0Rsb1VaKfrDg3-j2R4iNaL164e9ZHOVzH8L',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYlGWZqVUK0p-ypTdNCtSjH7mhljVnnw49OnLOe-5aLBMls5ErqHiefBv1pBdiVYTew-wiZgbGqRfV_M7eWch9O8l3p4ysNB-Od3hOaqswUnXM7fXKpxXVTAMJ4KRVb0RAwTkKlpHZUu3vJ7kg_bjmN2rnzRE2T4wyW4YqVpF6K1dF7mGtBNyDBY1Z9E0NMKVbGFbcWGQAXw1O7DgZH-eKyedeN_4v6BwzaH4kwE2HIEJKC6kH0zeN',
        label: 'Perspective View',
        alt: 'Full architectural wide angle perspective of ivory bouclé curved three-piece sectional sofa in a grand Abuja salon.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBswI5OSqDde4ujS-0ZqwwQ8zlg9q97gxVTcWObNXILTMQT4IgFyf6avAwVPCj0THs0yngPQeIrIs3op4GRJqYxv23d9ysa9-mqYWzpp2q64v_5uqBPARUH9LF31LIye4Nbj5LldPlSrVPzKUsq9mYQd9vPiRstvy95H_kYnQyY6WSEy_Q4HKzA4lXrMQjfMkxaz7ErVmHdOIqRRYC0jsJk2jR0e6CpTYpFqUggGgUMCKyySDcwUaYE',
        label: 'Teak Plinth Detail',
        alt: 'Macro close-up detail of organic solid Benue teak timber plinth base showing continuous steam bent grain curves.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7S7nBQ-riEb6jXVrbe-6Lqp3PHa57T3Czirz6XwdewZnZIc6P3_8y-83uHVruLxi-V6nHYShT9EX53Ooh9wMv92eChZxHnbfeflOSEFGjSJVNbUSIa_eZPDM91yYM_0bvxGi6xDYxz2rUfuzxu7ShjUhTdM03IWLyDmd3yrCp7JAumVx3d4HyAls99-xpQGzS_VGfDskm29Yg9OySn6KQQXfYw4y7hGNytu9DrUQ8TBJWHEmBn_lL',
        label: 'Bouclé Texture',
        alt: 'Tactile macro texture view of warm ivory textured Italian bouclé fabric with soft natural sunlight.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCCdud6L9VpD-w6oCOdPytTJimBNC9xZqWt-tiPAeCIuWnWS2SeJJfFnGXX_dwNHHfemi4X5tUt1c5WpUrYImRVcXW35elwMkOKydxczdQBa1MaUEvK3Ae6FEKWLM3qV7WIXRxX3yo4tkhmGw8zJNjefYUMAgSH97Djhka1rF0-IHV42hdfzX0hPnVaPLI3WmDtH6jhn9ryEyvkGHr6DtOq9cQ_n7yc5g6gGERZYen8aCZAr_pYHBuE',
        label: 'Leather Piping',
        alt: 'Precision tailored perimeter piping detail in cognac vegetable tanned saddle leather encasing the curved sofa profile.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9d_9wgMw3d7DSxjfCEUdXSOLZLSAhdEefkQtIKDu_QlhmNQ2JO_8_AxPd9_JdwBjtVoRBE4sVE34GIP6nLHUDgmEhbJTVZ7hvsZDrtfOmxxXhrOesFpOiXicfM7ehC2kAxtl5KbQ3Xezqk7QFFP0Lg_nrJSYFb6m-J8OQGh6T1Z_eUq89GxBGtR12YC86dcBt3hVdwoLO8F6UKXCYasvhnPZklv3PTlk_aLWdQVMV3C0FE8c6fkxs',
        label: 'Ergonomic Arc',
        alt: 'Sculptural angle looking down the curved lumbar seat slope of an organic luxury sofa.',
      },
    ],
    swatches: [
      { name: 'Ivory Bouclé', color: '#f4f0ea' },
      { name: 'Warm Oatmeal', color: '#3d2a21' },
      { name: 'Camel Velvet', color: '#8c6747' },
    ],
    scales: [
      { name: 'Petite (240cm)', dimension: '3-Seater Petite (2400mm)', price: '₦4,200,000' },
      { name: 'Standard (280cm)', dimension: '4-Seater Standard (2800mm)', price: '₦4,850,000' },
      { name: 'Grand (340cm)', dimension: '5-Seater Presidential (3400mm)', price: '₦5,950,000' },
    ],
    textiles: [
      { name: 'Ivory Textured Bouclé', color: '#EDE8E1' },
      { name: 'Warm Oatmeal Heavy Weave', color: '#D8CEBF' },
      { name: 'Camel Velvet', color: '#9E734A' },
      { name: 'Smoked Olive Pure Wool', color: '#4E5142' },
    ],
    finishes: [
      { name: 'Kiln-Dried Benue Teak (Natural)', label: 'Natural Teak' },
      { name: 'Black Stained Limba Hardwood', label: 'Black Limba' },
      { name: 'Raw Sapele Deep Mahogany Tone', label: 'Sapele Wood' },
    ],
    specs: [
      { label: 'Overall Dimensions', value: '2800 (L) x 1150 (D) x 780 (H) mm' },
      { label: 'Seat Height / Seat Depth', value: '430 mm / 680 mm' },
      { label: 'Internal Timber Frame', value: 'Benue Teak & Cured Iroko Bracing' },
      { label: 'Kiln Moisture Stability', value: '8% - 10% Tropical Equilibrium' },
      { label: 'Net Weight', value: '145 kg (Engineered Stability)' },
      { label: 'Handcrafting Lead Time', value: '5 to 7 Weeks from Deposit' },
      { label: 'Bespoke Arc Orientation', value: 'Left or Right Facing Custom Curves' },
    ],
    pillarCards: [
      {
        icon: 'architecture',
        title: 'Continuous Curved Geometry',
        desc: 'Engineered using internal multi-ply steam-bent ribs kiln-cured over 60 days to prevent tropical moisture distortion, creating a seamless unbroken arc.',
        note: 'Benue Woodwork',
      },
      {
        icon: 'layers',
        title: 'Down-Blend Core Dynamics',
        desc: 'A high-resilience natural latex core enveloped in channel-quilted sterilized duck feathers ensures sink-in softness without losing its crisp sculptural silhouette.',
        note: 'Climate Responsive',
      },
      {
        icon: 'handyman',
        title: 'Saddle-Stitched Bridle Leather',
        desc: 'The rear timber lip is wrapped in vegetable-tanned harness leather with hand-waxed twin needle saddle stitching, providing 360° grandeur when floating in open-plan spaces.',
        note: 'Artisanal Tailoring',
      },
    ],
    complementaryIds: ['maitama-fluted-credenza', 'guzape-lounge-chair', 'zuma-travertine-table'],
  },
  {
    id: 'the-zuma-dining-suite',
    name: 'The Zuma Sculptural Dining Suite',
    price: '₦14,850,000',
    clientPrice: '₦14,850,000',
    category: 'dining',
    tag: 'Seats 10-12',
    badge: 'Flagship Masterpiece',
    ref: 'ZEB-ZUM-2025',
    description:
      'Monolithic Honed Calacatta Viola Marble and Dual Fluted Benue Teak Pylons, accompanied by Eight Hand-Turned Armchairs wrapped in Italian Saddle Leather & Textured Bouclé.',
    subtitle: 'Single-slab Seasoned Teak • Natural Travertine Bases • Zero-VOC Wax',
    materialsNote: 'Single-slab Seasoned Teak • Natural Travertine Bases • Zero-VOC Wax',
    dimensions: '3000 × 1200 × 760 mm',
    provenance: 'Ethical Nigerian Teak • Aguiyi Ironsi, Maitama',
    hasAR: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuALsWLR9lpF6Cj-BiDDTKHJNKBzs8JhVjWJNApBuB4zjVR6yRtWAfFsiethlSUybit39BByC1J58pk0yh2eXoXN3D0bT791MCutHofnSIPjARBL_Tcj0JyHj56e0qSbwy39uMFPSfDzrQvm9CC28tcKA61tbPIH5JjYQyYyyAROQZSzzjeS5kDLZQSpdqlXps-BRHW0OQm4SQiAGOpS5KjBLWPWFNlyZjHmkmu9R5YtT2Lo5-x2W-FV',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuALsWLR9lpF6Cj-BiDDTKHJNKBzs8JhVjWJNApBuB4zjVR6yRtWAfFsiethlSUybit39BByC1J58pk0yh2eXoXN3D0bT791MCutHofnSIPjARBL_Tcj0JyHj56e0qSbwy39uMFPSfDzrQvm9CC28tcKA61tbPIH5JjYQyYyyAROQZSzzjeS5kDLZQSpdqlXps-BRHW0OQm4SQiAGOpS5KjBLWPWFNlyZjHmkmu9R5YtT2Lo5-x2W-FV',
        label: 'Full Suite Composition',
        alt: 'The Zuma Sculptural Dining Suite in honed Calacatta Viola marble and fluted Benue teak set in a sunlit architectural villa.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDn9iFi_jFwDpQX7trCCsk2J7n-bLcKLWpuerriy0v0QaQbVQjcIwHlYRNOosBrv2qhngPly0kX2jVogL2KgLOUZ59cBUTz9UJorps_xn96oTEuk9s3aIfagLiNAc4wNP_pxHXFGrMJZBVd6XJ7PQ3T-mI1qMSeP1tdb_NMy4dPpcHtdcXDQWbTyvpXiCFRliZ3efyUGDhXkKd8Jcbrx5PjIs-UhMWitS_Qy9Ha0gpvgLkjBhmvKzC4',
        label: 'Fluted Teak Pylons',
        alt: 'Macro close-up shot of hand-turned fluted solid Benue teak timber pedestal base.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJwX0qTkfxX-B-YgRClwsGJ2wChrCERdCWfb0MfpMEk2SlxFXeATn-7gV_Jvhq-pief6s7Av7t_tLcz8tNDXoMz1EbEwcRvBrjoJ0fuIrQPaWYDJuXSPJG3bgrqY9bmhB0tY-MDpVub_dvZrB07UfLdpUFoy7bkbigxX-QL8nzmbOMFpDvYNWAAWD5xC2_rP41sCQwj9SSMM8W9_6TJieMNC_PeF9aT30P50IBhb1-M2YEuEIxX2MU',
        label: 'Calacatta Viola Stone',
        alt: 'Extreme macro editorial photograph of honed Italian Calacatta Viola marble slab edge displaying dramatic deep burgundy wine veins.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD4wY6Hz8NJc034hoYsvcnI8IHzNs_UewZC7SHPXcR2ycSakZgwAMPm1X29u5EGoi_Hss3E5YVT92B5wWhsFn6JWfhBZdvtnLq4Mwg3tyl3t4hgcBWw6bHMVawho3fXqUDCI0bbYXHcODaCiI9mbTR8WvHQ8ZNVPlKjQBzPiL0SH9lywqC58dZdIzHdc9H5i7k2eTl7Rp4MaLsxmPBA2MSU8cWY-iaJt058hdVZAuqEe8cplh3xG-Vt',
        label: 'Cognac Saddle Back',
        alt: 'Artisanal detail of saddle-stitched cognac Italian semi-aniline leather embracing curved wooden rear backrest.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVlHhuF66nfyaQ_hIs-phquVUe4D9YB89IJ6gu93q0kf-o-2_-E0j83LLr0v6VQh_qRzo8w7rWyg9Tb7FkH9QiBFtCGAcCRXtm9u2IvPeh19qWgWy2csVfN17qUolsA5LmwiDUPIpj5-Tdh5nVnIN5AMUEABxqDKr75CUitTkv_T3av1zguOmAN_WQ1Az4zeGL-YHBwloLvGJvNlHew9UB6fp0q-4yB6oGf99QybBLgK7BoceWjJv1',
        label: 'Bouclé Weave Seat',
        alt: 'Tactile macro texture of premium heavy-weave off-white bouclé fabric upholstery on dining armchair.',
      },
    ],
    swatches: [
      { name: 'Seasoned Teak', color: '#af7942' },
      { name: 'Roman Travertine', color: '#dfd6c6' },
      { name: 'Calacatta Viola', color: '#5c4033' },
    ],
    scales: [
      { name: '8-Seater (300cm)', dimension: '8-Seater (300 × 120 cm)', price: '₦14,850,000' },
      { name: '10-Seater (360cm)', dimension: '10-Seater Grand (360 × 125 cm)', price: '₦18,200,000' },
      { name: '12-Seater (420cm)', dimension: '12-Seater Presidential (420 × 130 cm)', price: '₦22,500,000' },
    ],
    slabOptions: [
      { name: 'Honed Calacatta Viola', gradient: 'from-[#3a1a2b] via-[#e2d5cb] to-[#8d4766]' },
      { name: 'Nero Marquina Velvet', gradient: 'from-[#101010] via-[#222222] to-[#404040]' },
      { name: 'Roman Silver Travertine', gradient: 'from-[#d9d0c5] via-[#eee7dd] to-[#c7bcb0]' },
      { name: 'Solid Teak Parquet', gradient: 'from-[#80502a] via-[#a36838] to-[#593418]' },
    ],
    timberOptions: [
      { name: 'Kiln-Dried Benue Teak', color: '#8f5d34' },
      { name: 'Blackened Nigerian Limba', color: '#201d1c' },
      { name: 'Smoked Obeche Wood', color: '#52443d' },
    ],
    specs: [
      { label: 'Table Top Dimensions', value: '3000L × 1200W × 50H mm (Standard 8-Seat)' },
      { label: 'Total Suite Weight', value: '480 kg (Table Slab 320kg + Pylons 160kg)' },
      { label: 'Chair Dimensions', value: '580W × 620D × 780H mm (Seat Height 480mm)' },
      { label: 'Timber Moisture Level', value: '8%–10% Kiln-Stabilized (Zero Tropical Warp)' },
      { label: 'Floor Load Capability', value: 'Suitable for reinforced residential concrete slabs' },
      { label: 'Lead Time to Completion', value: '6 to 8 Weeks from Custom Commission Deposit' },
      { label: 'Bespoke Customization', value: 'Custom length available up to 4.80 meters' },
    ],
    pillarCards: [
      {
        icon: 'landslide',
        title: 'Hand-Honed Calacatta Viola',
        desc: 'Quarried in Tuscany, cut to 50mm chamfered thickness, and hand-finished with our signature matte hone in our Abuja stone workshop to resist tropical humidity and heat.',
        note: 'Sealed with Eco-Nano Sealant',
      },
      {
        icon: 'carpenter',
        title: 'Fluted Benue Teak Pylons',
        desc: 'Sustainably cultivated Benue hardwood seasoned for 180 days in temperature-regulated kilns. Each vertical flute is individually contoured by master woodturners in Guzape.',
        note: 'Internal Steel Structural Skeleton',
      },
      {
        icon: 'chair',
        title: 'Ergonomic Cantilevered Seats',
        desc: 'Eight bespoke dining armchairs featuring steam-bent solid teak loops, vegetable-tanned Italian saddle leather back-wraps, and dense bouclé seats for 4-hour dinner comfort.',
        note: 'Full Lumbar Support Calibration',
      },
    ],
    complementaryIds: ['maitama-fluted-credenza', 'aso-curved-daybed', 'guzape-bronze-chandelier'],
  },
  {
    id: 'maitama-fluted-credenza',
    name: 'Maitama Fluted Credenza',
    price: '₦3,200,000',
    clientPrice: '₦3,200,000',
    category: 'storage',
    tag: 'Limited Run',
    badge: 'Limited Run',
    ref: 'ZEB-MAI-2025',
    description:
      'Vertical ribbed blackened Limba wood doors, brushed brass hairline inlays, and an Italian bronze marble top with push-latch acoustic dampened hinges.',
    subtitle: 'Blackened Nigerian Limba • Hand-brushed Brass Inlay • Soft-close Joinery',
    materialsNote: 'Solid Hardwood • Brushed Brass Hairline Inlays',
    dimensions: '2200L × 520W × 750H mm',
    provenance: 'Guzape Workshop Spec',
    hasAR: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBXf1epVBXgaCYWRhLzW5qNMWifn8O7g2yKUjfYovLD-eN2sF5uL8_3R8D0K-SHSq82xBxRCWd2bM9cgyNC6tQC7AQ3nbghxiVO1YxgixxF_l4nJMcCqi7Rq-pRaDv6tVrqcez9X16zkUEYH3vkIRJ88S9EIwCGV_XwxFnxepQtmvcUqP0ceGzVRqg9mKkVdYSWqX6ruSx70_pGnwCK0CgmBpe3uj3IPGOtZ98FtMbYFrf3Zcqm_Q-g',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXf1epVBXgaCYWRhLzW5qNMWifn8O7g2yKUjfYovLD-eN2sF5uL8_3R8D0K-SHSq82xBxRCWd2bM9cgyNC6tQC7AQ3nbghxiVO1YxgixxF_l4nJMcCqi7Rq-pRaDv6tVrqcez9X16zkUEYH3vkIRJ88S9EIwCGV_XwxFnxepQtmvcUqP0ceGzVRqg9mKkVdYSWqX6ruSx70_pGnwCK0CgmBpe3uj3IPGOtZ98FtMbYFrf3Zcqm_Q-g',
        label: 'Front Elevation',
        alt: 'Editorial catalog showcase of the Maitama Fluted Credenza.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-she1EVdoON0n56LEuS_GTxtwZE_K9nmoWez28Q9Ck5JAhE2NgHwSzKT2BizjEgtz9epSTLw7hBxaChSFi2idfYyReUXau0bbiwYfF5PSoXSF434OR089K_PhC5pqFAIvn62njYI9JvYcqpes5ZOl4_AgJ4nRfSKiz_JDlyTxucXqcOA-LlnvMZfRgmqZRqJ3RyPf-TkneH6Sr6kCNaMIHF2lsnC7qDv3F-5fxyRNOH-ETfaGCRRN',
        label: 'In-Situ Villa View',
        alt: 'Maitama Fluted Credenza in a luxury residence.',
      },
    ],
    swatches: [
      { name: 'Blackened Limba', color: '#1e1c1b' },
      { name: 'Brushed Brass', color: '#c5a059' },
      { name: 'Walnut Core', color: '#4a3528' },
    ],
    specs: [
      { label: 'Overall Dimensions', value: '2200L × 520W × 750H mm' },
      { label: 'Materials', value: 'Blackened Nigerian Limba & Brushed Brass' },
      { label: 'Internal Hardware', value: 'Blum Push-to-Open Dampened Hinges' },
      { label: 'Top Surface', value: 'Honed Calacatta or Solid Limba' },
    ],
    complementaryIds: ['the-aso-curved-sofa', 'guzape-lounge-chair'],
  },
  {
    id: 'guzape-lounge-chair',
    name: 'Guzape Sculptural Lounge Chair',
    price: '₦1,950,000',
    clientPrice: '₦1,950,000',
    category: 'living',
    tag: 'Iconic Ergonomics',
    badge: 'Iconic Ergonomics',
    ref: 'ZEB-GUZ-2025',
    description:
      'Handcrafted with warm rich cognac saddle leather and an angled architectural mahogany timber frame in a bright sunlit studio with solid brass hardware.',
    subtitle: 'Cognac Saddle Leather • Sculpted Solid Mahogany • Brass Hardware',
    materialsNote: 'Top-Grain Leather • Solid Sculpted Mahogany',
    dimensions: '820W × 860D × 740H mm',
    provenance: 'Hand-Finished in Guzape Workshop',
    hasAR: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAmKcSYBQZMODZbZWOc5EZy-8cCZjue6rHPNdQv4OMoUMQNAqkgp_Lfac61EHPvucntPV8scLSbwqoA0PZwFajkomPDGsv1A7WyhUYolcEVhq0g-J62RD4sAohvj7H_0rh5uG1ddT28PRKBqLUJ_3EIqSv0ysUhpch1VC6gIheaccBzSEfZvxllwHvZOJgLsZgy274tBuROBVpuXPNPtKSaMUixDuMjOx4CdKbmYnkxeWZPoFRe5Kln',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmKcSYBQZMODZbZWOc5EZy-8cCZjue6rHPNdQv4OMoUMQNAqkgp_Lfac61EHPvucntPV8scLSbwqoA0PZwFajkomPDGsv1A7WyhUYolcEVhq0g-J62RD4sAohvj7H_0rh5uG1ddT28PRKBqLUJ_3EIqSv0ysUhpch1VC6gIheaccBzSEfZvxllwHvZOJgLsZgy274tBuROBVpuXPNPtKSaMUixDuMjOx4CdKbmYnkxeWZPoFRe5Kln',
        label: 'Portrait Angle',
        alt: 'Editorial portrait of the Guzape Sculptural Armchair.',
      },
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9-XmpwbM0PJHbqRO4VMvWnd8jjusoe3jZ9C5mnUuMgLUeU8AjZCP94BNcaTR6zGiKbUQk1hlnDz8-Jb1_s4w-lqHLpYXhKusAcAJKqJ4hsp4lyoezBVakCjhGVe3KVoluLdf-N2-kQWQb5sYkn8ICxzZ7DOVMVY1ckHc60KOuYCVwCchiZxc8RrBI1z3126zo_zbewDadxwYF9ORp9P0Lhes39i2fJEe_PkfUQK1duGRsJro4p-2Q',
        label: 'Villa Setting',
        alt: 'Guzape Sculptural Lounge Chair in sunlit living room.',
      },
    ],
    swatches: [
      { name: 'Cognac Saddle', color: '#964b00' },
      { name: 'Midnight Onyx', color: '#1b1b1b' },
      { name: 'Natural Sand', color: '#d2b48c' },
    ],
    specs: [
      { label: 'Overall Dimensions', value: '820W × 860D × 740H mm' },
      { label: 'Upholstery', value: 'Italian Full-Grain Semi-Aniline Leather' },
      { label: 'Timber Skeleton', value: 'Cured Benue Mahogany with Wax Buff' },
      { label: 'Joinery Pins', value: 'Solid Machined Brass Dowels' },
    ],
    complementaryIds: ['the-aso-curved-sofa', 'zuma-travertine-table'],
  },
  {
    id: 'zuma-travertine-table',
    name: 'Zuma Travertine Table',
    price: '₦2,400,000',
    clientPrice: '₦2,400,000',
    category: 'tables',
    tag: 'Centerpieces',
    badge: 'Centerpieces',
    ref: 'ZEB-ZTRAV-2025',
    description:
      'Low monolithic coffee table crafted from solid honed cream Roman travertine stone with architectural block legs in an upscale minimalist villa.',
    subtitle: 'Honed Roman Travertine • Chamfered Edge • Anti-Stain Seal',
    materialsNote: 'Roman Travertine Stone • Satin Nano-Seal',
    dimensions: '1400L × 800W × 360H mm',
    provenance: 'Abuja Stone Workshop',
    hasAR: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuB3vKtiUz2iXz2VnzWn5hrkKbGrDZrLf8EuDFsLjwQr5F01YASLc2SKiP6D3PI9O0pQ3m4D5T0v1nIaWZaVHbC2zoTQ1Zct6C3KC3Jubx-KQQzOsg5on-nj84DIlg1WiPEKcSTart2TkBAqVq-BFAFi7-apqCXg0_TZ5PKlE4RNYysSX8zUhkDREtJvPRDAJ049WDmP1J1p3rxv8CSrUNXUmZomC6K2a_NQrinMJYJ1lhRGjvw3WF3Q',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3vKtiUz2iXz2VnzWn5hrkKbGrDZrLf8EuDFsLjwQr5F01YASLc2SKiP6D3PI9O0pQ3m4D5T0v1nIaWZaVHbC2zoTQ1Zct6C3KC3Jubx-KQQzOsg5on-nj84DIlg1WiPEKcSTart2TkBAqVq-BFAFi7-apqCXg0_TZ5PKlE4RNYysSX8zUhkDREtJvPRDAJ049WDmP1J1p3rxv8CSrUNXUmZomC6K2a_NQrinMJYJ1lhRGjvw3WF3Q',
        label: 'Architectural Stone Block',
        alt: 'Zuma Travertine Table in minimalist interior.',
      },
    ],
    swatches: [
      { name: 'Cream Travertine', color: '#dfd6c6' },
      { name: 'Silver Travertine', color: '#c7bcb0' },
    ],
    specs: [
      { label: 'Overall Dimensions', value: '1400L × 800W × 360H mm' },
      { label: 'Material', value: 'Solid Italian Roman Travertine (50mm Top)' },
      { label: 'Finish', value: 'Matte Honed with Satin Nano Protective Seal' },
      { label: 'Net Weight', value: '190 kg' },
    ],
    complementaryIds: ['the-aso-curved-sofa', 'guzape-lounge-chair'],
  },
  {
    id: 'aso-curved-daybed',
    name: 'The Aso Minimalist Curved Daybed',
    price: '₦4,850,000',
    clientPrice: '₦4,850,000',
    category: 'living',
    tag: 'Lounge Accents',
    badge: 'Lounge Accents',
    ref: 'ZEB-DAY-2025',
    description:
      'Sculptural curved chaise designed for seamless transitions from formal dining to tea. Upholstered in sand bouclé with low-slung walnut plinth base in high-ceiling Maitama living room gallery.',
    subtitle: 'Sand French Bouclé • Low-Slung Walnut Plinth • High Density Core',
    materialsNote: 'French Bouclé • Solid Nigerian Walnut Base',
    dimensions: '2100L × 900W × 680H mm',
    provenance: 'Maitama Atelier Spec',
    hasAR: true,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD5iZ27Zz78j3kQmG-67TTJL7skwd6LfZPG-aDnwGhFMKDdza9jkgHLKLI2m5kIhnsxtQoj8dp7LUAMp6X0X6jOte1-CxS5uQtImtyoHOQ-JNFuBH9Fi7hfI7VF1YqylvFmZi4o0_XQTnKHGzpHtqxdAfukmhpUu9NYo5WXGI3e-5IscibZ2zXJ5bH2V4PDUqnSjYxgBP1bxIjWGRxBtvdir18F-XW7hiYVPT_MoAlW-4uEg2AJqDKV',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD5iZ27Zz78j3kQmG-67TTJL7skwd6LfZPG-aDnwGhFMKDdza9jkgHLKLI2m5kIhnsxtQoj8dp7LUAMp6X0X6jOte1-CxS5uQtImtyoHOQ-JNFuBH9Fi7hfI7VF1YqylvFmZi4o0_XQTnKHGzpHtqxdAfukmhpUu9NYo5WXGI3e-5IscibZ2zXJ5bH2V4PDUqnSjYxgBP1bxIjWGRxBtvdir18F-XW7hiYVPT_MoAlW-4uEg2AJqDKV',
        label: 'Lounge Chaise Profile',
        alt: 'The Aso Minimalist Curved Daybed in luxury gallery.',
      },
    ],
    swatches: [
      { name: 'Sand Bouclé', color: '#EDE8E1' },
      { name: 'Cognac Velvet', color: '#9E734A' },
    ],
    specs: [
      { label: 'Overall Dimensions', value: '2100L × 900W × 680H mm' },
      { label: 'Plinth Foundation', value: 'Kiln-Dried Nigerian Walnut' },
      { label: 'Foam Specification', value: 'Dual Layer Ergonomic Latex & Down' },
    ],
    complementaryIds: ['the-zuma-dining-suite', 'the-aso-curved-sofa'],
  },
  {
    id: 'guzape-bronze-chandelier',
    name: 'Guzape Sculptural Bronze Chandelier',
    price: '₦2,200,000',
    clientPrice: '₦2,200,000',
    category: 'lighting',
    tag: 'Architectural Lighting',
    badge: 'Illumination',
    ref: 'ZEB-CHAN-2025',
    description:
      'Handcrafted heavy patinated bronze branch chandelier suspended above dining and living spaces, casting warm linear dimmable architectural glow in an Abuja luxury estate.',
    subtitle: 'Cast Solid Bronze • 2700K Warm LED Baffles • Brass Suspension Rods',
    materialsNote: 'Solid Bronze • Brushed Brass Suspension Hardware',
    dimensions: '1800L × 450W × 600H mm',
    provenance: 'Guzape Foundry & Workshop',
    hasAR: false,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6fLloHtJkMUFHc_n93uoy2L7jXSI23inb5QHthKDICvzkZdWFu-11QepF2dUqqonF_C5r-2Bwc2E8DwUMFFhwl8VxUZO_94LTYcIs6nCUg-gfVFvsIf0xgtJDmIQ5I0wC-RCVLVkWvvdwDTU6Tu9tmhuIi22J_zsgqjC8k1aRAjIEbBeO-kfJ8OfewogRJJkEbkJYPz5PNpIJaNgkamnzMeF9GGfgTZV4POWRZszlpb3f-a5rjWGx',
    gallery: [
      {
        src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC6fLloHtJkMUFHc_n93uoy2L7jXSI23inb5QHthKDICvzkZdWFu-11QepF2dUqqonF_C5r-2Bwc2E8DwUMFFhwl8VxUZO_94LTYcIs6nCUg-gfVFvsIf0xgtJDmIQ5I0wC-RCVLVkWvvdwDTU6Tu9tmhuIi22J_zsgqjC8k1aRAjIEbBeO-kfJ8OfewogRJJkEbkJYPz5PNpIJaNgkamnzMeF9GGfgTZV4POWRZszlpb3f-a5rjWGx',
        label: 'Suspended Luminaire',
        alt: 'Guzape Bronze Chandelier glowing above dining table.',
      },
    ],
    swatches: [
      { name: 'Aged Bronze', color: '#52443d' },
      { name: 'Brushed Brass', color: '#c5a059' },
    ],
    specs: [
      { label: 'Overall Dimensions', value: '1800L × 450W × 600H mm' },
      { label: 'Color Temperature', value: '2700K Warm Dimmable Architectural LED' },
      { label: 'Voltage & Driver', value: '220-240V Integrated Lutron/KNX Compatible' },
    ],
    complementaryIds: ['the-zuma-dining-suite'],
  },
];

export const projects: Project[] = [
  {
    slug: 'villa-bella-residence',
    title: 'Villa Bella Residence',
    location: 'Maitama Diplomatic Zone, Abuja',
    scope: 'Full Penthouse Millwork & Furnishings',
    headline: 'Double-Height Penthouse Millwork & Curved Sculptural Seating',
    description:
      'A 680-square-meter private penthouse overlooking the capital. Zebdecor crafted bespoke fluted Limba wood wall panelling, custom acoustic ceiling baffles, an 18-seat monolithic Iroko dining suite, and low-slung bouclé conversational seating.',
    quoteTitle: 'Lead Architect Notes:',
    quoteText:
      '"We banished rigid rectangular forms in favor of sweeping curves that reflect the undulating topography of Aso Rock visible through the living room glass."',
    stats: [
      { value: '680 m²', label: 'Floor Area' },
      { value: '14 Weeks', label: 'Craft & Fit-Out' },
      { value: '100%', label: 'Bespoke Millwork' },
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAia0U1q_DG47hUml15HjOFK73IyoV84-8HZrK4oV43IgxzWJ4exejM077Wj7FiF8hFHFZoU77sYUFiuQISW5A-KWhauEKgLQ_obzX8cNjH6FOQZOb9l9ufWGXis4ltPUmPfjpkPXTRrv2p1UU0CBBPVTBZifM3gWYjf0uUpecXCBcLlJEK2FlfT6XsJ2JUBRvJipxqsoqbMLLDHpedQY909vnXnIQtEEyJEwVhw1OiiWS3s-nPO3qK',
  },
  {
    slug: 'the-ridge-sanctuary',
    title: 'The Ridge Sanctuary',
    location: 'Asokoro Hills, Abuja',
    scope: 'Full Joinery & Curated Furnishing',
    headline: 'Modernist Granite Pavilion with Teak & Patinated Brass Palettes',
    description:
      'Constructed upon the granite outcroppings of Asokoro, this modernist estate demanded earthy balance. We supplied seasoned Benue Teak joinery, hand-finished full-grain leather seating, and custom brass-lit floating media consoles.',
    quoteTitle: 'Client Briefing:',
    quoteText:
      '"Create spaces that feel like a peaceful retreat from public life, where organic tactile surfaces soothe the senses after long executive days."',
    stats: [
      { value: '12 Rooms', label: 'Total Spatial Scope' },
      { value: 'Teak & Brass', label: 'Primary Palette' },
      { value: 'Turnkey', label: 'Delivery Model' },
    ],
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCt9IrSSHV08R6t7xXnAVvA_fN6WQdnksYGQiP30j22VWKJtlQ1nngUhk7UMvIEHR7NIzsSsvbT6Etek9AmVQwe9STlsa9H6s-JLAe3t-W6ud0SBkh52JXbU3kA3fOw7k4CL1xxkJlO0GWpwbxE_t1m35Nr6ELBuW3feSevigfKWZNOo2OkV8EzvokhvFy3qJ_1aSXAh_IUrbER5J-vBuZevbY1RKZ2onUsRIf9UfOeBxmVWPJKDYJI',
  },
];

export const materials: Material[] = [
  {
    id: 'hardwoods',
    name: 'Nigerian Hardwoods',
    badge: 'Forest Certified',
    description:
      'Iroko, Teak, and Obeche seasoned in our temperature-controlled Abuja kilns for 60 days to prevent warping under tropical climate shifts.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC_DKvoQdHI4ko3KNhJs3BxJ6tNOj0cCRUcDsqKzBTn9YQ2AbOuhC1xAIGuIV15c-TLTg2hL98rmXV-UVn1354qbH9DjLplJpZLasNHMBVfxS3_8LDgFtYl-mwqcCtesZAw3_U8oN_0kPWrRileSwwOIB0KN_rXronAl0Hb_5UYBlAHOL6HK9ZvN14_Nncg9bbRVBs48QN-wDxYhgk26gn0uQQ0cFfDiPVNk9yblLxKVu6vo9yWIbuC',
  },
  {
    id: 'marbles',
    name: 'Honed Natural Marbles',
    badge: 'Direct Quarry',
    description:
      'Hand-selected slabs of Calacatta and Roman Travertine, cut with diamond-wire precision and finished with satin anti-stain seals.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCx9nnZIvDa-wxhR_KvGt9vucrjBEsMQFg-_KXBwiG08zub03eSjbAblS0yYeS5qKU614PNR7yb3Dy_pZa4OPqtMVpLkb3X9XI6MigwcDjd0Wpo41zt7miJyWC-g2UDoJOgk9-XXoF68M4PLTTk8lw1uUqYJNUPcJ4j3Qj8HMybh9UG5tFVb9aLFNafFfbnrMAWfbXb15Z0mIDty4LZOQ8H0xXILxHDUkNpuap_d58TWsJ-y6G-YN2D',
  },
  {
    id: 'brass',
    name: 'Brushed Brass & Bronze',
    badge: 'Precision Cast',
    description:
      'Heavy-gauge solid brass and champagne bronze details, hand-waxed with micro-crystalline sealants to age with refined patina.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA08_VDK1T8-a1x-1Z8-eJ3H9aY74aIdErKQpKP_CuOn1xRAgapLI5odGYRqF1Wo9kdptR6jvBYEKa2yoNZQceUDhvERIFLRj3cNKZng7hlnPBgKnQKjsDHGFIPRNOqUuGECFNKuoSOv25k8oLCcEr9wW-2TnNCguXZPdSIR41Lt9gy4RyGlNDxdvQUjMYwtwEqlsumIXlO0UIpahZxTQvGJEe5OrR8q5ZpCu97ctX8UBeZ15kM1tBU',
  },
  {
    id: 'textiles',
    name: 'Bouclé & Full-Grain Leathers',
    badge: 'European Looms',
    description:
      'Heavyweight wool bouclés from northern France paired with butter-soft Italian pull-up leathers that breathe naturally.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBGbdsnFJQgXf5KhdtRWs-s3HxLqKJE9q5XVVHd6eYu9l82Nm80qXhouUGie1lhTdY_rybChihz-HNbxqoNtGuos0_H0C9nDPDdJuBHIJtUO9lSwjERcArCnJQRQy9Jvu1ba-zU2B8BZU18IU4WsWoyxXkNauuEUWCeI7bifTwEg5Lo8sgfJgdvYCsIqXTwezKuAWt1au_VGAiRyo2ywNBg7g2D05PDMUiGa0vJb7W1pd-5qH1usLm1',
  },
];

export const testimonials = [
  {
    author: 'Senator O. Adeleke',
    role: 'Private Resident, Asokoro',
    quote:
      'Zebdecor transformed our Asokoro villa from a cavernous concrete shell into an intimate haven. Their woodwork craftsmanship matches anything we’ve seen in Milan or London.',
  },
  {
    author: 'Arch. Nkem Okoye',
    role: 'Principal Architect, Studio Forma',
    quote:
      'As an architectural developer, finding a reliable local atelier in Abuja that respects millimetric tolerances was rare until we partnered with Zebdecor for our luxury penthouses.',
  },
  {
    author: 'Dr. Aisha Danjuma',
    role: 'Diplomatic Quarter, Maitama',
    quote:
      'The AR preview feature allowed my husband and I to visualize our curved sofa scale before production. Delivery and on-site joinery installation was immaculate.',
  },
];
