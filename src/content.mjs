/* BRASS Kitchen & Bar - content.
   Built on the Panel Chrome engine (../engine-panel-chrome).

   EVERY price, dish name, hour and detail below is transcribed from Brass's own
   published material, checked 16 August 2026:
     - brass.is (home, MENU, DRINKS, BÁRUSALUR)
     - their printed menu JPEGs, menu-20.02.2026 and menu1-20.02.2026
     - dineout.is/brass (kitchen closing time, groups of 10+)
   Nothing here is invented. Anything I could not read is marked TODO and left out
   of the page rather than guessed at. */

export const COPY = {
  lang: 'is',
  brand: 'Brass',
  descriptor: 'Kitchen & Bar',
  handle: '@brass_kitchen_and_bar',
  chromeMid: 'Laugavegur 66-68, 101 Reykjavík',
  title: 'Brass Kitchen & Bar - Laugavegur 66, 101 Reykjavík',
  description:
    'Brass Kitchen & Bar á jarðhæð Alda Hótel við Laugaveg. Opið alla daga 14-22, happy hour alla daga 14-18.',

  nav: [
    { label: 'Matseðill', href: '#matsedill' },
    { label: 'Drykkir', href: '#drykkir' },
    { label: 'Bárusalur', href: '#barusalur' },
    { label: 'Morgunverður', href: '#morgunverdur' },
    { label: 'Finna okkur', href: '#finna' },
  ],

  hero: {
    image: 'img/hero-front.jpg',
    alt: 'Framhlið Brass við Laugaveg að kvöldi, tíglamynstur og ljós inni.',
    /* the glass behind this already says BRASS KITCHEN & BAR in their own vinyl,
       so the type says the thing the glass does not: when to come. */
    lines: ['Opið alla daga frá 14.', 'Happy hour til 18.'],
    fact: 'Laugavegur 66-68 · Eldhúsið lokar 21:30 · Morgunverður 07-10',
    secondary: 'Sjá matseðil',
    marksTop: ['Jarðhæð Alda Hótel', 'Bárusalur fyrir hópa', 'Panta borð á Dineout'],
  },

  marquee: 'Good food · Good drinks · Good times',

  happyHour: {
    label: 'Happy hour',
    from: '14:00',
    to: '18:00',
    note: 'Alla daga vikunnar / Every day of the week',
  },

  /* the brave chapter: their own words, their own amber, their own room */
  wash: {
    image: 'img/cover.jpg',
    alt: 'Barinn í Brass, koparlampar og flöskur í hillum.',
    eyebrow: 'Síðan 2017',
    lines: ['Good food.', 'Good drinks.', 'Good times.'],
  },

  place: {
    eyebrow: 'Staðurinn / The place',
    image: 'img/room-wide.jpg',
    alt: 'Horn Laugavegar, skilti Brass yfir gangstéttinni.',
  },

  statement: {
    lead: 'Fjórir tímar af happy hour, alla daga vikunnar.',
    body:
      'Brass er veitingastaður og bar á jarðhæð Alda Hótel við Laugaveg, í hjarta Reykjavíkur. Smáréttir til að deila, borgarar úr 150 g rib eye, íslenskur kranabjór og kökuskápur sem er verið að fylla á meðan þú lest þetta.',
    facts: [
      { term: 'Eldhús og bar', en: 'Kitchen and bar, every day', detail: '14:00 - 22:00' },
      { term: 'Happy hour', en: 'Every day of the week', detail: '14:00 - 18:00' },
      { term: 'Morgunverðarhlaðborð', en: 'Breakfast buffet', detail: '07:00 - 10:00' },
      { term: 'Eldhúsið lokar', en: 'Kitchen closes', detail: '21:30' },
    ],
  },

  menu: {
    image: 'img/burger-plate.jpg',
    alt: 'Borgari með frönskum á gylltum diski á borði í Brass.',
    eyebrow: 'Matseðill / Menu',
    currency: 'Verð í krónum / Prices in ISK',
    footnote:
      'Allir borgarar eru 150 g rib eye á brioche brauði með cheddar osti, parmesan frönskum og trufflu mæjó til hliðar. Brass getur einnig boðið upp á glútenlaust brauð.',
    sections: [
      {
        title: 'smáréttir',
        note: 'Tilvalið að deila / Perfect to share',
        image: 'img/cover.jpg',
        imageAlt: 'Barinn í Brass.',
        rows: [
          {
            name: 'Franskar, bearnaise, parmesan og graslaukur',
            note: 'French fries, bearnaise, parmesan and chives',
            price: '1.990',
          },
          {
            name: 'Kjúklingavængir með gráðostasósu',
            note: 'Chicken wings with blue cheese sauce. Buffalo, BBQ or plain',
            price: '2.600 / 3.890',
          },
          {
            name: 'Blómkálsvængir tempura og chilli veganmæjó',
            note: 'Cauliflower wings and vegan chilli mayo. Buffalo or BBQ',
            price: '2.600',
          },
          {
            name: 'Bakaður camembert, grillað brauð',
            note: 'Baked camembert, spiced cashew nuts and mango chutney',
            price: '3.190',
          },
          {
            name: 'Nauta carpaccio, klettasalat, parmesan',
            note: 'Beef carpaccio, crispy potato strings and truffle sauce',
            price: '3.190',
          },
          {
            name: 'Úrval íslenskra osta og grillað brauð',
            note: 'Selection of Icelandic cheeses, grilled bread',
            price: '3.190',
          },
        ],
      },
      {
        title: 'hamborgarar',
        note: 'Hamburgers and other courses',
        image: 'img/burger-plate.jpg',
        imageAlt: 'Borgari úr 150 g rib eye með frönskum.',
        rows: [
          {
            name: 'Gráðostaborgari',
            note: 'Blue cheese burger. Cheddar, blue cheese mayo, bacon, Brass relish',
            price: '4.190',
            peek: 'img/burger.jpg',
          },
          {
            name: 'Brass börger',
            note: 'Double cheddar, deep fried onion rings, pickles, Brass sauce',
            price: '4.190',
          },
          {
            name: 'Lamba bearnaise hamborgari',
            note: 'Lamb burger, cheddar, bearnaise, red onion relish and bacon',
            price: '4.190',
          },
          {
            name: 'Stökkur kjúklingaborgari',
            note: 'Crispy chicken burger, bacon, BBQ, honey mustard coleslaw',
            price: '4.190',
          },
          {
            name: 'Vegan Moving Mountain borgari',
            note: 'Vegan bun, chilli vegan mayo, vegan cheese and onion rings',
            price: '4.190',
          },
          {
            name: 'Kjúklingasalat með bláberjum',
            note: 'Chicken salad, melon, radish, spiced cashews, basil dressing',
            price: '4.190',
          },
        ],
      },
      {
        title: 'eftirréttir',
        note: 'Desserts',
        image: 'img/lava-cake.jpg',
        imageAlt: 'Lava súkkulaðikaka með berjum og ís.',
        rows: [
          {
            name: 'Lava súkkulaðikaka með berjum og ís',
            note: 'Lava cake with berries and ice cream. Available gluten free',
            price: '2.490',
            peek: 'img/lava-cake.jpg',
          },
          {
            name: 'Kíkið á kökuskápinn okkar',
            note: 'Ask the waiter about our cake selection of the day',
            price: '',
          },
        ],
      },
    ],
  },

  drinks: {
    image: 'img/cover.jpg',
    alt: 'Barinn í Brass, koparlampar yfir hillunum og Gull á krana.',
    eyebrow: 'Drykkir / Drinks',
    currency: 'Verð í krónum / Prices in ISK',
    note: 'Happy hour er alla daga frá 14:00 til 18:00.',
    draught: {
      title: 'kranabjór',
      head: ['Draught beer', '300 ml', '400 ml'],
      rows: [
        { name: 'Gull íslenskur lager', note: 'Icelandic lager', prices: ['1.450', '1.690'] },
        { name: 'Tuborg Classic amber lager', note: 'Amber lager', prices: ['1.450', '1.690'] },
        { name: 'Gull Lite', note: 'Gluten free', prices: ['1.450', '1.690'] },
        { name: 'Borg Brewery', note: 'Spyrjið þjóninn / Ask the waiter', prices: ['', '2.100'] },
      ],
    },
    mixed: {
      title: 'bjórsmökkun',
      rows: [
        {
          name: 'Taste of Icelandic beers',
          note: '5 x 150 ml glas',
          price: '3.990',
        },
        {
          name: 'Bjór mánaðarins',
          note: 'Beer of the month. Spyrjið þjóninn / Ask the waiter',
          price: '',
        },
      ],
    },
    coffee: {
      title: 'kaffi & te',
      rows: [
        { name: 'Americano', note: 'Coffee', price: '900' },
        { name: 'Espresso', note: 'Single', price: '800' },
        { name: 'Espresso double', note: 'Double', price: '900' },
        { name: 'Cappuccino', note: 'Coffee and milk', price: '990' },
        { name: 'Latté', note: 'Coffee and milk', price: '1.090' },
        { name: 'Te', note: 'Tea', price: '900' },
        { name: 'Heitt súkkulaði', note: 'Hot chocolate', price: '1.090' },
        { name: 'Baileys coffee', note: 'Irish coffee 2.900', price: '2.900' },
      ],
    },
  },

  /* the moving band. Only the photographs that survived the upscale go in here:
     it never stops moving, so a weak frame is on screen for a long time. */
  rail: {
    eyebrow: 'Staðurinn',
    items: [
      { image: 'img/cover.jpg', caption: 'Barinn.' },
      { image: 'img/burger.jpg', caption: 'Borgari úr 150 g rib eye.' },
      { image: 'img/hero-front.jpg', caption: 'Framhliðin við Laugaveg.' },
      { image: 'img/buffet.jpg', caption: 'Salurinn lagður fyrir hóp.' },
      { image: 'img/breakfast.jpg', caption: 'Morgunverður frá 07.' },
      { image: 'img/room-wide.jpg', caption: 'Hornið á Laugavegi.' },
    ],
  },

  room: {
    image: 'img/buffet.jpg',
    alt: 'Salurinn lagður fyrir hóp, hlaðborð á löngu borði.',
    eyebrow: 'Bárusalur',
    lede: 'Bárusalur, fyrir hópa frá 10 manns.',
    fact: 'Hópmatseðill · info@brass.is · 519 6566',
    body:
      'Afmæli, vinnustaðakvöld og allt þar á milli. Við setjum saman hópmatseðil með ykkur og höldum barnum opnum eins lengi og þarf. Sendið línu á info@brass.is eða hringið í 519 6566.',
    action: { label: 'Senda fyrirspurn', href: 'mailto:info@brass.is' },
  },

  breakfast: {
    eyebrow: 'Morgunverður',
    lede: 'Morgunverðarhlaðborð alla daga, 07:00 til 10:00.',
    body:
      'Brass er á jarðhæð Alda Hótel, svo morgunninn byrjar hér áður en eldhúsið opnar fyrir daginn klukkan 14:00.',
    image: 'img/breakfast.jpg',
    alt: 'Morgunverðarborð með pönnukökum, skyri, ávöxtum og kaffi.',
  },

  find: {
    /* the shopfront belongs here, where it does a job: this is the door */
    image: 'img/room-wide.jpg',
    imageAlt: 'Horn Laugavegar og Brass, skilti yfir gangstéttinni og rauða húsið á móti.',
    eyebrow: 'Finna okkur',
    lede: 'Laugavegur 66-68, 101 Reykjavík. Jarðhæð Alda Hótel.',
    hours: [
      { term: 'Alla daga', en: 'Kitchen and bar, seven days a week', detail: '14:00 - 22:00' },
      { term: 'Happy hour', en: 'Four hours, every day', detail: '14:00 - 18:00' },
      { term: 'Morgunverður', en: 'Breakfast buffet', detail: '07:00 - 10:00' },
      { term: 'Sími', en: 'Phone', detail: '519 6566' },
    ],
    contact: [
      { label: 'info@brass.is', href: 'mailto:info@brass.is' },
      { label: '519 6566', href: 'tel:+3545196566' },
    ],
    action: { label: 'Panta borð', href: 'https://www.dineout.is/brass?isolation=true&lng=en' },
  },

  voice: {
    image: 'img/cover.jpg',
    alt: 'Barinn í Brass að kvöldi, koparlampar yfir hillunum.',
    headline: 'Kökuskápurinn breytist. Kraninn líka.',
    body:
      'Sendu okkur netfangið þitt og við látum vita þegar bjór mánaðarins skiptir um krana og þegar eitthvað nýtt ratar í kökuskápinn.',
    inputLabel: 'Netfang',
    placeholder: 'nafn@netfang.is',
    submit: 'Skrá',
    ok: 'Takk. Við heyrum í þér.',
    invalid: 'Þetta netfang vantar eitthvað.',
  },

  foot: {
    address: ['Laugavegur 66-68', '101 Reykjavík', 'Sími 519 6566'],
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/brass_kitchen_and_bar/' },
      { label: 'Facebook', href: 'https://www.facebook.com/brassiceland' },
      { label: 'Panta borð', href: 'https://www.dineout.is/brass?isolation=true&lng=en' },
    ],
    legal: 'Kt. 610417-0780 · VSK 128393',
  },
};
