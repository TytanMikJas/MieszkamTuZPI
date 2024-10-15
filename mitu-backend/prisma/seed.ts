import {
  $Enums,
  CommentStatus,
  InvestmentStatus,
  PostType,
  PostVoteType,
  PrismaClient,
  UserRole,
  UserStatus,
} from '@prisma/client';

import { hash } from 'bcrypt';
import { slugify } from '../src/utils/string-utils';
import { connect } from 'node:http2';

const prisma = new PrismaClient();
const NUMBER_OF_DUMMY_POSTS = 25;
const NUMBER_OF_USERS = 13;
const ID_OFFSET = 10_000;
let counter = 1;

async function main() {
  await seedUsers();

  await seedBadges();

  await seedInvestmentCategories();
  await seedAnnouncementCategories();

  // Here we seed CUSTOM, posts and investments, announcements, listings
  await seedPostsForInvestments();
  await seedInvestments();

  await new Promise((resolve) => setTimeout(resolve, 5000));

  await seedPostsForAnnouncements();
  await seedAnnouncements();

  await seedPostsForListings();
  await seedListings();

  await seedPostsForComments();
  await seedComments();

  // Here we seed DUMMY posts and investments, announcements, listings - random data

  await seedPostsForDummyInvestments();
  await seedDummyInvestments();

  // nie odkomentowuj, bo nie działa obecnie
  // await seedPostsForDummyAnnouncements();
  // await seedDummyAnnouncements();

  // await seedPostsForDummyListings();
  // await seedDummyListings();

  await seedPostsForDummyComments();
  await seedDummyComments();

  await seedPostVotes();

  await seedBlankNewsletters();

  // TODO: here you can add seedBadges function
}

const badges = [
  {
    name: 'Przyjazne niepełnosprawnym',
    primary: '#0A60A5', // Icon Color And Main Background Color; Darker color
    secondary: '#99C6EB', // Background Color behind Icon; Lighter color
    icon: 'accessible',
  },
  {
    name: 'Eko projekt',
    primary: '#1C5926',
    secondary: '#21E04E',
    icon: 'eco',
  },
  {
    name: 'Przyjazne rodzinom',
    primary: '#D15017',
    secondary: '#E6A712',
    icon: 'family_restroom',
  },
  {
    name: 'Przyjazne rowerzystom',
    primary: '#5F1AB9',
    secondary: '#A361CE',
    icon: 'directions_bike',
  },
  {
    name: 'Miejsca pracy',
    primary: '#D2C019',
    secondary: '#F6EEA4',
    icon: 'work',
  },
  {
    name: 'Dobry wskaźnik BAF',
    primary: '#2CA53F',
    secondary: '#98EFAD',
    icon: 'compost',
  },
  {
    name: 'Rozwój społeczności lokalnej',
    primary: '#997A8D',
    secondary: '#D9CEDA',
    icon: 'diversity_3',
  },
  {
    name: 'Inwestycje zasilana OZE',
    primary: '#20AF24',
    secondary: '#79E381',
    icon: 'solar_power',
  },
  {
    name: 'Stacja ładowania EV',
    primary: '#CC0000',
    secondary: '#EF9898',
    icon: 'ev_station',
  },
];

const investmentCategories = [
  {
    name: 'Fabryka',
    icon: 'factory',
  },
  {
    name: 'Mieszkania',
    icon: 'apartment',
  },
  {
    name: 'Edukacja',
    icon: 'school',
  },
  {
    name: 'Drogi',
    icon: 'directions_car',
  },
  {
    name: 'Transport',
    icon: 'transportation',
  },
  {
    name: 'Rekreacja',
    icon: 'mood',
  },
  {
    name: 'Sport',
    icon: 'sports_and_outdoors',
  },
  {
    name: 'Zdrowie',
    icon: 'health_metrics',
  },
  {
    name: 'Ekologia',
    icon: 'eco',
  },
  {
    name: 'Kultura',
    icon: 'theater_comedy',
  },
  {
    name: 'Turystyka',
    icon: 'tour',
  },
  {
    name: 'Technologia',
    icon: 'biotech',
  },
  {
    name: 'Handel',
    icon: 'storefront',
  },
  {
    name: 'Biura',
    icon: 'work',
  },
  {
    name: 'Bezpieczeństwo',
    icon: 'security',
  },
  {
    name: 'Inne',
    icon: 'star',
  },
];

const announcementCategories = [
  {
    name: 'Awaria',
    icon: 'dangerous',
  },
  {
    name: 'Remont',
    icon: 'engineering',
  },
  {
    name: 'Budowa',
    icon: 'construction',
  },
  {
    name: 'Konsultacje',
    icon: 'forum',
  },
  {
    name: 'Konkurs',
    icon: 'emoji_events',
  },
  {
    name: 'Ogłoszenie',
    icon: 'info_i',
  },
  {
    name: 'Wydarzenie',
    icon: 'event',
  },
  {
    name: 'Zaproszenie',
    icon: 'mail',
  },
];

async function seedUsers() {
  const hashedPassword = await hash('P@ssw0rd!', 10);
  await prisma.user.createMany({
    data: [
      {
        id: 0 + ID_OFFSET,
        firstName: 'Admin1',
        lastName: 'The-First',
        email: 'admin-1@gmail.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
      {
        id: 1 + ID_OFFSET,
        firstName: 'Admin2',
        lastName: 'The-Second',
        email: 'admin-2@gmail.com',
        password: hashedPassword,
        role: UserRole.ADMIN,
        status: UserStatus.ACTIVE,
      },
      {
        id: 2 + ID_OFFSET,
        firstName: 'Mateusz',
        lastName: 'Kowalski',
        email: 'matkow123@gmail.com',
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
      },
      {
        id: 3 + ID_OFFSET,
        firstName: 'Joanna',
        lastName: 'Jankiewicz',
        email: 'joannajan@gmail.com',
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        newsletter_agreement: true,
      },
      {
        id: 4 + ID_OFFSET,
        firstName: 'Katarzyna',
        lastName: 'Sztos',
        email: 'katos@gmail.com',
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.ACTIVE,
        newsletter_agreement: true,
      },
      {
        id: 5 + ID_OFFSET,
        firstName: 'Wiktor',
        lastName: 'Stankiewicz',
        email: 'wikstan@gmail.com',
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.BANNED,
        newsletter_agreement: true,
      },
      {
        id: 6 + ID_OFFSET,
        firstName: 'Kacper',
        lastName: 'Grobelny',
        email: 'kacgro@gmail.com',
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.DELETED,
        newsletter_agreement: true,
      },
      {
        id: 7 + ID_OFFSET,
        firstName: 'Mikołaj',
        lastName: 'Jastrzebski',
        email: 'mikjas@gmail.com',
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.EMAIL_NOT_CONFIRMED,
        newsletter_agreement: true,
      },
      {
        id: 8 + ID_OFFSET,
        firstName: 'Jakub',
        lastName: 'Ner',
        email: 'jakner@gmail.com',
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.SHADOW_BANNED,
      },
      {
        id: 9 + ID_OFFSET,
        firstName: 'Mariusz',
        lastName: 'Pudzian',
        email: 'officialbierunmp@gmail.com',
        password: hashedPassword,
        role: UserRole.OFFICIAL,
        status: UserStatus.ACTIVE,
      },
      {
        id: 10 + ID_OFFSET,
        firstName: 'Bartłomiej',
        lastName: 'Pięta',
        email: 'officialbierunbp@gmail.com',
        password: hashedPassword,
        role: UserRole.OFFICIAL,
        status: UserStatus.ACTIVE,
      },
      {
        id: 11 + ID_OFFSET,
        firstName: 'Kornelia',
        lastName: 'Wojciechowska',
        email: 'officialbierunkw@gmail.com',
        password: hashedPassword,
        role: UserRole.OFFICIAL,
        status: UserStatus.DELETED,
      },
      {
        id: 12 + ID_OFFSET,
        firstName: 'Mateusz',
        lastName: 'Gondek',
        email: 'officialbierunmg@gmail.com',
        password: hashedPassword,
        role: UserRole.OFFICIAL,
        status: UserStatus.EMAIL_NOT_CONFIRMED,
      },
    ],
  });
  console.log('Seeding Users finished.');
}

async function seedPostsForInvestments() {
  const postContents = [
    'Projekt dotyczący instalacji nowoczesnego zegara słonecznego w centrum miasta, mającego na celu połączenie tradycji z nowoczesną technologią oraz stworzenie przestrzeni edukacyjnej dla mieszkańców i turystów.',
    'Inicjatywa wprowadzenia nowych, bardziej pojemnych i estetycznych śmietników w parkach miejskich, by poprawić zarządzanie odpadami i zachęcić do dbania o czystość przestrzeni publicznych.',
    'Zamierzenie wymiany ogrodzenia wokół lokalnego parku na bardziej trwałe i estetycznie dopasowane do otoczenia, co ma na celu zwiększenie bezpieczeństwa i poprawę wizerunku miejsca.',
    'Projekt montażu nowych, bezpiecznych ławek na placach zabaw oraz stworzenie dodatkowych miejsc odpoczynku dla rodziców i opiekunów, co ma na celu podniesienie komfortu oraz zachęcenie do spędzania wolnego czasu na świeżym powietrzu.',
    'Inicjatywa sadzenia nowych drzew wzdłuż ulic miejskich i w parkach, mająca na celu poprawę jakości powietrza, estetyki miasta oraz stworzenie lepszych warunków życia dla mieszkańców i małej fauny.',
  ];

  await Promise.all(
    postContents.map(async (content, index) => {
      await prisma.post.create({
        data: {
          postType: PostType.INVESTMENT,
          content: content,
          thumbnail: `/uploads/investment${index + 1}.jpg`,
          createdBy: {
            connect: {
              id: (index % 4) + 9 + ID_OFFSET, // only user 9 -12 are officials
            },
          },
        },
      });
    }),
  );

  console.log('Seeding posts for investments finished.');
}

function randomBadges(): { name: string }[] {
  //get a random amount of items from badges
  const badgeIds = badges.map((b) => b.name);
  const randomlyChosen = [
    ...new Set(
      badgeIds
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * badgeIds.length)),
    ),
  ];

  const _R = randomlyChosen.map((e) => ({
    name: e,
  }));
  console.log(_R);
  return _R;
}

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

async function seedInvestments() {
  const investments = [
    {
      title: 'Zegar słoneczny',
      locationX: 51.110194,
      locationY: 17.030389,
      area: '51.109300,17.029289;51.109300,17.029489;51.109084,17.029289;51.109084,17.029489',
      address: 'Rynek 14, Wrocław',
      street: 'Rynek',
      buildingNr: '14',
      apartmentNr: null,
      status: InvestmentStatus.APPROVED,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Finansowanie śmietnikowe',
      locationX: 51.112194,
      locationY: 17.032389,
      area: '51.109642,17.031074;51.109642,17.031094;51.109442,17.031074;51.109442,17.031094',
      address: 'Spiżowa 1, Wrocław',
      street: 'Spiżowa',
      buildingNr: '1',
      apartmentNr: '5',
      status: InvestmentStatus.IN_PROGRESS,
      responsible: 'Miasto Wrocław',
      isCommentable: true,
    },
    {
      title: 'Nowy płot',
      locationX: 51.113194,
      locationY: 17.028389,
      area: '51.109858,17.029198;51.109858,17.029398;51.109658,17.029198;51.109658,17.029398',
      address: 'Oświęcimska 460, Wrocław',
      street: 'Oświęcimska',
      buildingNr: '460',
      apartmentNr: null,
      status: InvestmentStatus.COMPLETED,
      responsible: 'Urząd Wrocław',
      isCommentable: true,
    },
    {
      title: 'Nowe ławki',
      locationX: 51.114194,
      locationY: 17.037389,
      area: '51.109056,17.030044;51.109056,17.030244;51.108856,17.030044;51.108856,17.030244',
      address: 'Rynek 7, Wrocław',
      street: 'Rynek',
      buildingNr: '7',
      apartmentNr: null,
      status: InvestmentStatus.IN_PROGRESS,
      responsible: 'Miasto Wrocław',
      isCommentable: true,
    },
    {
      title: 'Nowe drzewa przy kościele',
      locationX: 51.105194,
      locationY: 17.028389,
      area: '51.109008,17.029138;51.109008,17.029338;51.108808,17.029138;51.108808,17.029338',
      address: 'Słowackiego 4, Wrocław',
      street: 'Słowackiego',
      buildingNr: '4',
      apartmentNr: null,
      status: InvestmentStatus.APPROVED,
      responsible: 'Urząd Wrocław',
      isCommentable: false,
    },
  ];

  for (let i = 0; i < investments.length; i++) {
    const pOI = await prisma.pOI.create({
      data: {
        id: counter++,
        title: investments[i].title,
        slug: slugify(investments[i].title),
        locationX: investments[i].locationX,
        locationY: investments[i].locationY,
        responsible: investments[i].responsible,
        street: investments[i].street,
        buildingNr: investments[i].buildingNr,
        apartmentNr: investments[i].apartmentNr,
      },
    });

    await prisma.investment.create({
      data: {
        post: {
          connect: {
            id: counter++,
          },
        },
        area: investments[i].area,
        isCommentable: investments[i].isCommentable,
        status: investments[i].status,
        badges: {
          connect: randomBadges(),
        },
        category: {
          connect: {
            name: investmentCategories[
              getRandomInt(investmentCategories.length)
            ].name,
          },
        },
        poi: {
          connect: {
            id: pOI.id,
          },
        },
      },
      include: {
        badges: true,
      },
    });
  }
  console.log('Seeding investments finished.');
}

async function seedPostsForAnnouncements() {
  const postContents = [
    'Zapraszamy na niepowtarzalne wydarzenie muzyczne w naszym mieście - Koncert 1000 Gitar! To wyjątkowa okazja, by doświadczyć magii muzyki granej na żywo przez tysiąc gitarzystów z różnych zakątków kraju. Koncert odbędzie się na głównym placu miasta, będąc doskonałą okazją do spędzenia czasu w rodzinnej atmosferze.',
    'Mieszkańcy miasta! Zapraszamy na konsultacje społeczne dotyczące przyszłości naszego rynku. To wyjątkowa szansa, by podzielić się swoimi pomysłami i sugestiami na temat rozwoju centrum naszej społeczności. Spotkanie odbędzie się w ratuszu miejskim, a każdy głos ma znaczenie w kształtowaniu przestrzeni wspólnej.',
    'Nie przegap nadchodzącej publicznej przemowy Kacpra Grobelnego, znanego działacza społecznego i inspirującego mówcy. Kacper podzieli się swoimi przemyśleniami na temat zaangażowania obywatelskiego i jego wpływu na lokalne społeczności. Wydarzenie to zapewni cenne spostrzeżenia i może stać się punktem zwrotnym w naszym podejściu do wspólnych działań i inicjatyw.',
  ];

  await Promise.all(
    postContents.map(async (content, index) => {
      await prisma.post.create({
        data: {
          postType: PostType.ANNOUNCEMENT,
          content: content,
          thumbnail: `/uploads/announcement${index + 1}.jpg`,
          createdBy: {
            connect: {
              id: (index % 4) + 9 + ID_OFFSET, // only user 9 -12 are officials
            },
          },
        },
      });
    }),
  );

  console.log('Seeding posts for announcements finished.');
}

async function seedAnnouncements() {
  const announcements = [
    {
      title: 'Koncert Gitar',
      locationX: 51.110194,
      locationY: 17.031389,
      address: 'Rynek 19, Wrocław',
      street: 'Rynek',
      buildingNr: '19',
      apartmentNr: null,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Konsultacje społeczne odpady komunalne',
      locationX: 51.107194,
      locationY: 17.050389,
      area: '51.107520, 17.052252;51.107520, 17.053660;51.106620, 17.053660;51.106620, 17.052252',
      address: 'Hejnałowa 4, Wrocław',
      street: 'Hejnałowa',
      buildingNr: '4',
      apartmentNr: null,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Kacper Grobelny przemawia!',
      locationX: 51.109194,
      locationY: 17.038989,
      address: 'Rynek 5, Wrocław',
      street: 'Rynek',
      buildingNr: '5',
      apartmentNr: null,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
  ];

  for (let i = 0; i < announcements.length; i++) {
    const pOI = await prisma.pOI.create({
      data: {
        id: counter++, // czy tutaj powinno byc ++?
        title: announcements[i].title,
        slug: slugify(announcements[i].title),
        locationX: announcements[i].locationX,
        locationY: announcements[i].locationY,
        responsible: announcements[i].responsible,
        street: announcements[i].street,
        buildingNr: announcements[i].buildingNr,
        apartmentNr: announcements[i].apartmentNr,
      },
    });

    await prisma.announcement.create({
      data: {
        area: announcements[i].area || null,
        category: {
          connect: {
            name: announcementCategories[
              getRandomInt(announcementCategories.length)
            ].name,
          },
        },
        isCommentable: announcements[i].isCommentable,
        poi: {
          connect: {
            id: pOI.id,
          },
        },
        post: {
          connect: {
            id: counter++,
          },
        },
      },
    });
  }

  console.log('Seeding announcements finished.');
}

async function seedPostsForListings() {
  const postContents = [
    'Szukasz swojego wymarzonego domu w Bieruniu? Oferujemy na sprzedaż przestronny, nowoczesny dom położony w malowniczej okolicy, idealny dla rodziny szukającej spokoju i komfortu. Nieruchomość oferuje duży ogród, garaż na dwa samochody i jest wykończona w wysokim standardzie.',
    'Pilnie potrzebujesz mieszkania w Bieruniu? Mamy dla Ciebie świetną ofertę! Wynajem: komfortowe, w pełni wyposażone mieszkanie na ulicy Krakowskiej 5 dostępne od zaraz. Doskonała lokalizacja, blisko do centrum miasta oraz licznych punktów usługowych i handlowych.',
    'Posiadasz firmę i potrzebujesz miejsca na przechowywanie sprzętu? Mamy dla Ciebie rozwiązanie! Do wynajęcia przestronny hangar na sprzęt, idealny dla firm. Hangar zlokalizowany jest w dogodnej lokalizacji, zapewniając łatwy dostęp i wysoki poziom bezpieczeństwa.',
    'Marzysz o domu z ogrodem, ale nie jesteś gotowy na zakup? Oferujemy na wynajem urokliwy dom z przestronnym ogrodem, idealny dla rodziny. Dom znajduje się w cichej, bezpiecznej okolicy, oferując komfort i prywatność, a jednocześnie bliskość do centrum miasta i infrastruktury.',
    'Rozwijasz startup i szukasz miejsca na swoje biuro? Mamy coś specjalnie dla Ciebie! Przestrzeń biurowa w centrum Bierunia, idealna dla młodych firm i startupów. Nowoczesne biuro w prestiżowej lokalizacji zapewni odpowiednie warunki do pracy i rozwoju Twojego biznesu.',
  ];

  await Promise.all(
    postContents.map(async (content, index) => {
      await prisma.post.create({
        data: {
          postType: PostType.LISTING,
          content: content,
          thumbnail: `/uploads/listing${index + 1}.jpg`,
          createdBy: {
            connect: {
              id: (index % 4) + 9 + ID_OFFSET, // only user 9 -12 are officials
            },
          },
        },
      });
    }),
  );

  console.log('Seeding posts for listings finished.');
}

async function seedListings() {
  const listings = [
    {
      title: 'Dom na sprzedaż',
      locationX: 51.095594,
      locationY: 17.025589,
      address: 'Krakowska 1, Wrocław',
      street: 'Krakowska',
      buildingNr: '1',
      apartmentNr: null,
      sell: true,
      price: 5000000,
      surface: 150,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Mieszkanie do wynajęcia',
      locationX: 51.096994,
      locationY: 17.030989,
      address: 'Krakowska 5, Wrocław',
      street: 'Krakowska',
      buildingNr: '5',
      apartmentNr: null,
      sell: false,
      price: 2000,
      surface: 50,
      responsible: 'Miasto Wrocław',
      isCommentable: true,
    },
    {
      title: 'Hangar na sprzęt',
      locationX: 51.091994,
      locationY: 17.020989,
      address: 'Krakowska 7, Wrocław',
      street: 'Krakowska',
      buildingNr: '7',
      apartmentNr: null,
      sell: false,
      price: 10000,
      surface: 300,
      responsible: 'Budwal',
    },
    {
      title: 'Dom z ogrodem',
      locationX: 51.097194,
      locationY: 17.028389,
      address: 'Krakowska 9, Wrocław',
      street: 'Krakowska',
      buildingNr: '9',
      apartmentNr: null,
      sell: false,
      price: 4000,
      surface: 120,
      responsible: 'DomyPL',
    },
    {
      title: 'Przestrzeń biurowa',
      locationX: 51.099194,
      locationY: 17.024389,
      address: 'Krakowska 11, Wrocław',
      street: 'Krakowska',
      buildingNr: '11',
      apartmentNr: null,
      sell: false,
      price: 3000,
      surface: 200,
      responsible: 'Kozaczek',
    },
  ];

  for (let i = 0; i < listings.length; i++) {
    // Najpierw tworzymy POI
    const pOI = await prisma.pOI.create({
      data: {
        id: counter++, // Dodano id
        title: listings[i].title,
        slug: slugify(listings[i].title),
        locationX: listings[i].locationX,
        locationY: listings[i].locationY,
        responsible: listings[i].responsible,
        street: listings[i].street,
        buildingNr: listings[i].buildingNr,
        apartmentNr: listings[i].apartmentNr,
      },
    });

    await prisma.listing.create({
      data: {
        post: {
          connect: {
            id: counter++, // czy dobrze ++?
          },
        },
        sell: listings[i].sell,
        price: listings[i].price,
        surface: listings[i].surface,
        poi: {
          connect: {
            id: pOI.id,
          },
        },
      },
    });
  }

  console.log('Seeding listings finished.');
}

async function seedPostsForComments() {
  const postContents = [
    'Czy są już dostępne dokładniejsze informacje o planowanym terminie rozpoczęcia budowy zegara słonecznego?',
    'Wspaniała inicjatywa! Zegar słoneczny to nie tylko atrakcja turystyczna, ale też edukacyjna.',
    'Jakie technologie zostaną wykorzystane do realizacji tego projektu? Czy zegar będzie w pełni ekologiczny?',
    'Czy mieszkańcy mogą jakoś przyczynić się do realizacji projektu? Może organizujecie zbiórkę funduszy czy wolontariat?',
    'Bardzo się cieszę, że nasze miasto inwestuje w takie projekty. To krok w stronę promowania zrównoważonego rozwoju.',
    'Mam nadzieję, że projekt będzie uwzględniał dostępność dla osób z niepełnosprawnościami.',
    'Czy przewidziane są jakieś utrudnienia w ruchu miejskim w związku z budową zegara? Dobrze byłoby wiedzieć z wyprzedzeniem.',
    'To świetnie, że coś takiego powstaje w Bieruniu. Zegar słoneczny na pewno przyciągnie więcej turystów do naszego miasta.',
  ];

  await Promise.all(
    postContents.map(async (content, index) => {
      await prisma.post.create({
        data: {
          postType: PostType.COMMENT,
          content: content,
          createdBy: {
            connect: {
              id: index + ID_OFFSET,
            },
          },
        },
      });
    }),
  );

  console.log('Seeding posts for comments finished.');
}

async function seedComments() {
  await prisma.comment.createMany({
    data: [
      {
        id: counter++,
        parentNodeId: 1,
        status: CommentStatus.APPROVED,
      },
      // This comment gets two subcomments
      {
        id: counter++,
        parentNodeId: 1,
        status: CommentStatus.APPROVED,
      },
      {
        id: counter++,
        // Here the counter - 2 is the parentNodeId for previous comment.
        // Counter -1 would point to the comment itself because of counter++. so we subtract 2.
        parentNodeId: counter - 2,
        status: CommentStatus.APPROVED,
      },
      {
        id: counter++,
        // We want to add another comment to the one I'm describing above, so we use counter - 3.
        parentNodeId: counter - 3,
        status: CommentStatus.APPROVED,
      },
      {
        id: counter++,
        parentNodeId: 1,
        status: CommentStatus.HIDDEN,
      },
      {
        id: counter++,
        parentNodeId: 1,
        status: CommentStatus.BANNED,
      },
      {
        id: counter++,
        parentNodeId: 1,
        status: CommentStatus.HIDDEN,
      },
      {
        id: counter++,
        parentNodeId: 1,
        status: CommentStatus.PENDING,
      },
    ],
  });

  console.log('Seeding comments finished.');
}

async function seedPostsForDummyInvestments() {
  for (let i = 0; i < NUMBER_OF_DUMMY_POSTS; i++) {
    await prisma.post.create({
      data: {
        postType: PostType.INVESTMENT,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nec auctor erat. Duis arcu nulla, consequat ut facilisis ut, vehicula et lectus. Pellentesque aliquet, neque eleifend dapibus porta, mi mauris vestibulum odio, a posuere enim nulla nec elit. Ut cursus massa odio, a faucibus ex vulputate quis. Vestibulum ultricies blandit efficitur. Ut vitae ipsum est. Quisque fringilla consequat velit eget placerat.',
        createdBy: {
          connect: {
            id: (i % 4) + 9 + ID_OFFSET, // only user 9 -12 are officials
          },
        },
      },
    });
  }
  console.log('Seeding DUMMY investment posts finished.');
}

async function seedDummyInvestments() {
  const MIN_LATITUDE = 50.082497;
  const MAX_LATITUDE = 50.103219;
  const MIN_LONGITUDE = 19.071075;
  const MAX_LONGITUDE = 19.102676;
  const OFFSET = 0.00045;

  const investmentTitles = [
    'Początek inwestycji środowiskowej',
    'Rewitalizacja żłobka',
    'Budowa Portu Lotniczego',
    // ... (pozostałe tytuły)
  ];

  const responsibleNames = [
    'Progres',
    'Modern Budownictwo',
    'EkoRzeka Polska',
    // ... (pozostałe nazwy)
  ];

  const investmentTypes = [
    InvestmentStatus.APPROVED,
    InvestmentStatus.REJECTED,
    InvestmentStatus.PENDING,
    InvestmentStatus.IN_PROGRESS,
    InvestmentStatus.COMPLETED,
  ];

  const allBadges = await prisma.badge.findMany();
  const allBadgeIds = allBadges.map((badge) => ({ name: badge.name }));

  const getRandomBadgeIds = () => {
    const shuffled = [...allBadgeIds].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 4) + 1);
  };

  await Promise.all(
    investmentTitles.map(async (title, i) => {
      const centerLatitude =
        Math.random() * (MAX_LATITUDE - MIN_LATITUDE) + MIN_LATITUDE;
      const centerLongitude =
        Math.random() * (MAX_LONGITUDE - MIN_LONGITUDE) + MIN_LONGITUDE;

      const area =
        `${(centerLatitude + OFFSET).toFixed(6)},${(
          centerLongitude - OFFSET
        ).toFixed(6)};` +
        `${(centerLatitude + OFFSET).toFixed(6)},${(
          centerLongitude + OFFSET
        ).toFixed(6)};` +
        `${(centerLatitude - OFFSET).toFixed(6)},${(
          centerLongitude + OFFSET
        ).toFixed(6)};` +
        `${(centerLatitude - OFFSET).toFixed(6)},${(
          centerLongitude - OFFSET
        ).toFixed(6)}`;

      // Najpierw tworzymy POI
      const pOI = await prisma.pOI.create({
        data: {
          id: counter,
          title: title,
          slug: slugify(title),
          locationX: centerLatitude,
          locationY: centerLongitude,
          responsible: responsibleNames[i % responsibleNames.length],
          street: 'Rynek', // Opcjonalne
          buildingNr: '11', // Opcjonalne
          apartmentNr: null, // Opcjonalne, jeśli nie jest potrzebne
        },
      });

      // Następnie tworzymy Investment i łączymy z POI
      await prisma.investment.create({
        data: {
          area: area,
          isCommentable: Math.random() >= 0.5,
          status:
            investmentTypes[Math.floor(Math.random() * investmentTypes.length)],
          badges: {
            connect: getRandomBadgeIds(),
          },
          category: {
            connect: {
              name: investmentCategories[
                getRandomInt(investmentCategories.length)
              ].name,
            },
          },
          poi: {
            connect: {
              id: pOI.id,
            },
          },
          post: {
            connect: {
              id: counter++,
            },
          },
        },
      });
    }),
  );

  console.log('Seeding DUMMY investments finished.');
}

async function seedPostsForDummyAnnouncements() {
  for (let i = 0; i < NUMBER_OF_DUMMY_POSTS; i++) {
    await prisma.post.create({
      data: {
        postType: PostType.ANNOUNCEMENT,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nec auctor erat. Duis arcu nulla, consequat ut facilisis ut, vehicula et lectus. Pellentesque aliquet, neque eleifend dapibus porta, mi mauris vestibulum odio, a posuere enim nulla nec elit. Ut cursus massa odio, a faucibus ex vulputate quis. Vestibulum ultricies blandit efficitur. Ut vitae ipsum est. Quisque fringilla consequat velit eget placerat.',
        createdBy: {
          connect: {
            id: (i % 4) + 9 + ID_OFFSET, // only user 9 -12 are officials
          },
        },
      },
    });
  }
  console.log('Seeding DUMMY announcement posts finished.');
}

// TODO: FIX
async function seedDummyAnnouncements() {
  const MIN_LATITUDE = 50.082497;
  const MAX_LATITUDE = 50.103219;
  const MIN_LONGITUDE = 19.071075;
  const MAX_LONGITUDE = 19.102676;

  const announcementTitles = [
    'Zapowiedź nowego etapu inwestycyjnego w Bieruniu',
    'Uroczyste otwarcie zmodernizowanego żłobka',
    'Oficjalne rozpoczęcie budowy Portu Lotniczego w naszym mieście',
    'Ukończenie modernizacji drogi na Ulicy 1 Maja',
    'Akcja społeczna czyszczenia rzeki Bierunia - zapraszamy do udziału!',
    'Zakończenie projektu modernizacji oświetlenia ulicznego',
    'Nowa ścieżka rowerowa wokół jeziora już otwarta!',
    'Otwarcie odnowionego parku miejskiego i nowej siłowni plenerowej',
    'Rozbudowa biblioteki miejskiej - zapraszamy do nowej czytelni',
    'Realizacja projektu zielonych dachów - krok w stronę ekologii',
    'Nowe stacje ładowania pojazdów elektrycznych już dostępne',
    'Start miejskiego programu recyklingu - dołącz do nas!',
    'Rozwój ogrodów społecznych - zapraszamy mieszkańców do współpracy',
    'Modernizacja targowiska miejskiego zakończona sukcesem',
    'Nowe place zabaw dla dzieci z niepełnosprawnościami już otwarte',
    'Implementacja nowego systemu zarządzania odpadami komunalnymi',
    'Inwestujemy w bezpieczeństwo - nowy system monitoringu wizyjnego',
    'Infrastruktura dla psów - nowe wybiegi i punkty z wodą',
    'Modernizacja systemu kanalizacyjnego - zapobiegamy podtopieniom',
    'Zapraszamy na otwarcie kąpieliska miejskiego nad rzeką',
    'Projekt oczyszczalni ścieków z nowoczesnymi technologiami zakończony',
    'Miejskie centrum kultury otwiera nowe pracownie - sprawdź ofertę',
    'Rozwój miejskiego car-sharingu - ekologiczna alternatywa dla mieszkańców',
    'Nowe mieszkania komunalne dla młodych rodzin - start programu',
    'Projekt termomodernizacji budynków komunalnych - inwestujemy w przyszłość',
  ];

  await Promise.all(
    announcementTitles.map(async (title) => {
      const centerLatitude =
        Math.random() * (MAX_LATITUDE - MIN_LATITUDE) + MIN_LATITUDE;
      const centerLongitude =
        Math.random() * (MAX_LONGITUDE - MIN_LONGITUDE) + MIN_LONGITUDE;

      // Tworzenie POI
      const pOI = await prisma.pOI.create({
        data: {
          id: counter,
          title: title,
          slug: slugify(title),
          locationX: centerLatitude,
          locationY: centerLongitude,
          responsible: 'UM Bieruń',
          street: 'Rynek',
          buildingNr: '12',
        },
      });

      // Tworzenie ogłoszenia
      const announcement = await prisma.announcement.create({
        data: {
          area: null, // Możesz ustawić odpowiednią wartość lub null, jeśli pole jest opcjonalne
          categoryId:
            announcementCategories[getRandomInt(announcementCategories.length)]
              .name, // Upewnij się, że to jest poprawne
          isCommentable: true, // lub false, w zależności od potrzeb
          poi: {
            connect: {
              id: pOI.id,
            },
          },
          post: {
            connect: {
              id: counter++,
            },
          },
        },
      });
    }),
  );

  console.log('Seeding DUMMY announcements finished.');
}

async function seedPostsForDummyListings() {
  for (let i = 0; i < NUMBER_OF_DUMMY_POSTS; i++) {
    await prisma.post.create({
      data: {
        postType: PostType.LISTING,
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nec auctor erat. Duis arcu nulla, consequat ut facilisis ut, vehicula et lectus. Pellentesque aliquet, neque eleifend dapibus porta, mi mauris vestibulum odio, a posuere enim nulla nec elit. Ut cursus massa odio, a faucibus ex vulputate quis. Vestibulum ultricies blandit efficitur. Ut vitae ipsum est. Quisque fringilla consequat velit eget placerat.',
        createdBy: {
          connect: {
            id: (i % 4) + 9 + ID_OFFSET, // only user 9 -12 are officials
          },
        },
      },
    });
  }
  console.log('Seeding DUMMY listing posts finished.');
}

// TODO: FIX
async function seedDummyListings() {
  const MIN_LATITUDE = 50.082497;
  const MAX_LATITUDE = 50.103219;
  const MIN_LONGITUDE = 19.071075;
  const MAX_LONGITUDE = 19.102676;

  const responsibleNames = [
    'Progres',
    'Modern Budownictwo',
    'EkoRzeka Polska',
    'Budimex Dromex',
    'Polskie Oświetlenie Miejskie',
    'Ścieżki Rowerowe Polska',
    'Kacper Grobelny',
    'Citified',
    'Citified',
    'ElektroMobilność',
    'Recykling Miasta',
    'Ogrody Społeczne',
    'Targowisko Nowa Era',
    'Dostępność Plus',
    'EkoZarządzanie',
    'Bezpieczne Miasto',
    'Kocham Bieruń',
    'HydroKanal',
    'AquaPark Bieruń',
    'Oczyszczalnia Nowoczesna',
    'Centrum Kultury Innowacje',
    'AutoNaWspółkę',
    'Mieszkania dla Rodzin',
    'EkoEnergia Miejska',
    'TermoModernizacja',
  ];

  const listingTitles = [
    'Niezwykła okazja inwestycyjna: działka pod rozwój w centrum Bierunia',
    'Żłobek po kompleksowej modernizacji na sprzedaż - idealny dla prowadzenia działalności edukacyjnej',
    'Sprzedam teren pod budowę Portu Lotniczego - unikalna inwestycja w naszym mieście',
    'Na sprzedaż: grunt wzdłuż zmodernizowanej drogi na Ulicy 1 Maja - wysoki potencjał komercyjny',
    'Dołącz do akcji społecznej: kup grunt nad rzeką Bierunia i przyczyn się do jej ochrony',
    'Lokal handlowy w centrum z nowoczesnym oświetleniem LED na sprzedaż',
    'Działka rekreacyjna w okolicy nowej ścieżki rowerowej - idealna na weekendowy wypoczynek',
    'Otwarcie sprzedaży apartamentów w odnowionym parku miejskim z dostępem do siłowni plenerowej',
    'Rozbudowana biblioteka miejska na sprzedaż - z czytelnią i przestrzenią na warsztaty',
    'Inwestycja w zielone dachy: sprzedam budynek biurowy z ekologicznym dachem',
    'Parking z nowymi stacjami ładowania EV - na sprzedaż lub wynajem',
    'Współpraca: teren pod miejski program recyklingu - poszukiwani inwestorzy',
    'Działki pod rozwój ogrodów społecznych - zapraszamy do inwestycji',
    'Zmodernizowane targowisko miejskie do przejęcia - szansa na rozwój własnej działalności',
    'Plac zabaw dla dzieci z niepełnosprawnościami - poszukiwany operator',
    'Sprzedam nieruchomość z nowoczesnym systemem zarządzania odpadami',
    'Budynek z zaawansowanym systemem monitoringu wizyjnego do wynajęcia - zwiększ bezpieczeństwo swojego biznesu',
    'Teren z infrastrukturą dla psów - nowe wybiegi i punkty z wodą na sprzedaż',
    'Inwestycja: grunt pod modernizację systemu kanalizacyjnego - zapobiegajmy podtopieniom razem',
    'Kąpielisko miejskie nad rzeką - szukamy operatora do zarządzania',
    'Nowoczesna oczyszczalnia ścieków do przejęcia - technologia na sprzedaż',
    'Lokale w miejskim centrum kultury na wynajem - stwórz przestrzeń kreatywną dla swojej działalności',
    'Wynajem miejsc parkingowych dla systemu miejskiego car-sharingu - zainwestuj w ekologiczną alternatywę',
    'Mieszkania komunalne dla młodych rodzin - zainwestuj w przyszłość nowych pokoleń',
    'Projekt budynku z termomodernizacją - na sprzedaż: zainwestuj w energooszczędne rozwiązania',
  ];

  await Promise.all(
    listingTitles.map(async (title, i) => {
      const centerLatitude =
        Math.random() * (MAX_LATITUDE - MIN_LATITUDE) + MIN_LATITUDE;
      const centerLongitude =
        Math.random() * (MAX_LONGITUDE - MIN_LONGITUDE) + MIN_LONGITUDE;

      // Najpierw tworzymy POI
      const pOI = await prisma.pOI.create({
        data: {
          title: title,
          slug: slugify(title),
          locationX: centerLatitude,
          locationY: centerLongitude,
          responsible: responsibleNames[i],
          street: 'Rynek',
          buildingNr: 15,
        },
      });

      // Następnie tworzymy Listing i łączymy z POI
      await prisma.listing.create({
        data: {
          price: 10000,
          surface: 100,
          sell: Math.random() >= 0.5,
          poi: {
            connect: {
              id: pOI.id,
            },
          },
        },
      });
    }),
  );

  console.log('Seeding DUMMY listings finished.');
}

async function seedPostsForDummyComments() {
  for (let i = 0; i < NUMBER_OF_DUMMY_POSTS * 2; i++) {
    await prisma.post.create({
      data: {
        postType: PostType.COMMENT,
        content:
          'Lorem ipsum dolor sit amet, a posuere enim nulla nec elit. Ut cursus massa odio, a faucibus ex vulputate quis. Vestibulum ultricies blandit efficitur. Ut vitae ipsum est. Quisque fringilla consequat velit eget placerat.',
        createdBy: {
          connect: {
            id: (i % 12) + ID_OFFSET,
          },
        },
      },
    });
  }
  console.log('Seeding DUMMY comment posts finished.');
}

async function seedDummyComments() {
  // The dummy comments are added only to the well thought out posts. Meaning the first 13 posts
  // those are 5 investments, 3 announcements, 5 listings. + 1 because prisma iterates from 1
  const LOWEST_CUSTOM_POST_NUM = 1;
  const HIGHEST_CUSTOM_POST_NUM = 14;

  const commentsIds = Array.from({ length: NUMBER_OF_DUMMY_POSTS * 2 }, () =>
    Math.floor(
      Math.random() * (HIGHEST_CUSTOM_POST_NUM - LOWEST_CUSTOM_POST_NUM + 1) +
        LOWEST_CUSTOM_POST_NUM,
    ),
  );
  const commentTypes = [
    CommentStatus.APPROVED,
    CommentStatus.BANNED,
    CommentStatus.PENDING,
    CommentStatus.HIDDEN,
  ];

  await Promise.all(
    commentsIds.map(async (index) => {
      const commentType =
        commentTypes[Math.floor(Math.random() * commentTypes.length)];
      await prisma.comment.create({
        data: {
          id: counter++,
          parentNodeId: index,
          status: commentType,
        },
      });
    }),
  );

  console.log('Seeding DUMMY announcements finished.');
}

async function seedPostVotes() {
  const userIds = Array.from({ length: NUMBER_OF_USERS }, (_, i) => i);
  const postIds = Array.from({ length: counter }, (_, i) => i);
  const voteTypes = [PostVoteType.UPVOTE, PostVoteType.DOWNVOTE];

  const votePromises = userIds.flatMap((userId) => {
    return postIds.map((postId) => {
      const voteType = voteTypes[Math.floor(Math.random() * voteTypes.length)];
      return prisma.postVote.create({
        data: {
          userId,
          postId,
          type: voteType,
        },
      });
    });
  });

  await Promise.all(votePromises);

  console.log('Seeding post votes finished.');
}

async function seedBadges() {
  await Promise.all(
    badges.map(async (badge) => {
      await prisma.badge.create({
        data: {
          name: badge.name,
          primary: badge.primary,
          secondary: badge.secondary,
          icon: badge.icon,
        },
      });
    }),
  );
  console.log('Seeding badges finished.');
}

async function seedInvestmentCategories() {
  await Promise.all(
    investmentCategories.map(async (category) => {
      await prisma.investmentCategory.create({
        data: {
          name: category.name,
          icon: category.icon,
        },
      });
    }),
  );

  console.log('Seeding investment categories finished.');
}

async function seedAnnouncementCategories() {
  await Promise.all(
    announcementCategories.map(async (category) => {
      await prisma.announcementCategory.create({
        data: {
          name: category.name,
          icon: category.icon,
        },
      });
    }),
  );
  console.log('Seeding announcement categories finished.');
}

async function seedBlankNewsletters() {
  await prisma.newsletter.createMany({
    data: [
      {
        name: 'Newsletter 1 name',
        subject: 'Newsletter 1 subject',
      },
      {
        name: 'Newsletter 2 name',
        subject: 'Newsletter 2 subject',
      },
      {
        name: 'Newsletter 3 name',
        subject: 'Newsletter 3 subject',
      },
      {
        name: 'Newsletter 4 name',
        subject: 'Newsletter 4 subject',
      },
      {
        name: 'Newsletter 5 name',
        subject: 'Newsletter 5 subject',
      },
    ],
  });
  console.log('Seeding blank newsletters finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
