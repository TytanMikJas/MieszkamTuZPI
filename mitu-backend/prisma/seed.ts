import {
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

const prisma = new PrismaClient();
const NUMBER_OF_DUMMY_POSTS = 15;
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

  // Here we seed DUMMY posts and investments, announcements, listings - random data - not working now

  // await seedPostsForDummyInvestments();
  // await seedDummyInvestments();

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
        email: 'officialwroclawmp@gmail.com',
        password: hashedPassword,
        role: UserRole.OFFICIAL,
        status: UserStatus.ACTIVE,
      },
      {
        id: 10 + ID_OFFSET,
        firstName: 'Bartłomiej',
        lastName: 'Pięta',
        email: 'officialwroclawbp@gmail.com',
        password: hashedPassword,
        role: UserRole.OFFICIAL,
        status: UserStatus.ACTIVE,
      },
      {
        id: 11 + ID_OFFSET,
        firstName: 'Kornelia',
        lastName: 'Wojciechowska',
        email: 'officialwroclawkw@gmail.com',
        password: hashedPassword,
        role: UserRole.OFFICIAL,
        status: UserStatus.DELETED,
      },
      {
        id: 12 + ID_OFFSET,
        firstName: 'Mateusz',
        lastName: 'Gondek',
        email: 'officialwroclawmg@gmail.com',
        password: hashedPassword,
        role: UserRole.OFFICIAL,
        status: UserStatus.EMAIL_NOT_CONFIRMED,
      },
    ],
  });
  console.log('Seeding Users finished.');
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

async function seedPostsForInvestments() {
  const postContents = [
    'Projekt dotyczący instalacji nowoczesnego zegara słonecznego w centrum miasta, mającego na celu połączenie tradycji z nowoczesną technologią oraz stworzenie przestrzeni edukacyjnej dla mieszkańców i turystów.',
    'Inicjatywa wprowadzenia nowych, bardziej pojemnych i estetycznych śmietników w parkach miejskich, by poprawić zarządzanie odpadami i zachęcić do dbania o czystość przestrzeni publicznych.',
    'Zamierzenie wymiany ogrodzenia wokół lokalnego parku na bardziej trwałe i estetycznie dopasowane do otoczenia, co ma na celu zwiększenie bezpieczeństwa i poprawę wizerunku miejsca.',
    'Projekt montażu nowych, bezpiecznych ławek na placach zabaw oraz stworzenie dodatkowych miejsc odpoczynku dla rodziców i opiekunów, co ma na celu podniesienie komfortu oraz zachęcenie do spędzania wolnego czasu na świeżym powietrzu.',
    'Inicjatywa sadzenia nowych drzew wzdłuż ulic miejskich i w parkach, mająca na celu poprawę jakości powietrza, estetyki miasta oraz stworzenie lepszych warunków życia dla mieszkańców i małej fauny.',
    'Projekt modernizacji Parku Szczytnickiego, obejmujący odnowienie alejek, budowę nowych miejsc odpoczynku oraz poprawę infrastruktury rekreacyjnej, mający na celu uczynienie parku bardziej przyjaznym dla mieszkańców i turystów.',
    'Budowa nowej ścieżki rowerowej na Oporowie, mająca na celu poprawę bezpieczeństwa i komfortu rowerzystów, a także zwiększenie dostępności tej dzielnicy dla miłośników aktywnego wypoczynku.',
    'Inicjatywa budowy fontanny w Parku Zachodnim, mająca na celu stworzenie nowej atrakcji wodnej, która przyciągnie mieszkańców i turystów, jednocześnie upiększając przestrzeń zieloną w tej części miasta.',
    'Projekt odnowienia placu zabaw na Biskupinie, obejmujący modernizację istniejących urządzeń, dodanie nowych elementów zabawowych oraz poprawę bezpieczeństwa, co ma na celu zwiększenie atrakcyjności tego miejsca dla rodzin z dziećmi.',
    'Renowacja Mostu Zwierzynieckiego, mająca na celu przywrócenie jego dawnej świetności oraz zwiększenie bezpieczeństwa pieszych i rowerzystów, a także wzmocnienie struktury mostu na potrzeby przyszłego ruchu.',
    'Budowa boiska wielofunkcyjnego na Krzykach, mająca na celu zapewnienie mieszkańcom dostępu do nowoczesnej infrastruktury sportowej, sprzyjającej aktywności fizycznej oraz organizacji wydarzeń sportowych w tej części miasta.',
    'Rozbudowa infrastruktury rekreacyjnej na Gaju, obejmująca budowę nowych ścieżek spacerowych, siłowni plenerowej oraz miejsc piknikowych, co ma na celu zwiększenie możliwości spędzania czasu na świeżym powietrzu i promowanie zdrowego stylu życia.',
    'Modernizacja skweru przy Placu Grunwaldzkim, mająca na celu poprawę estetyki oraz funkcjonalności tej przestrzeni publicznej, poprzez dodanie nowych ławek, oświetlenia i zieleni, co przyczyni się do zwiększenia komfortu użytkowników.',
    'Budowa tężni solankowej na Sępolnie, mająca na celu stworzenie miejsca sprzyjającego zdrowiu i wypoczynkowi, które będzie dostępne dla mieszkańców i odwiedzających, oferując naturalną inhalację solankową w miejskim otoczeniu.',
    'Projekt budowy nowej sceny plenerowej w Parku Południowym, mający na celu stworzenie miejsca do organizacji koncertów, spektakli i innych wydarzeń kulturalnych, które wzbogacą ofertę kulturalną miasta oraz urozmaicą życie lokalnej społeczności.',
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
    {
      title: 'Modernizacja Parku Szczytnickiego',
      locationX: 51.110694,
      locationY: 17.077389,
      area: '51.110194,17.076889;51.110194,17.077989;51.109594,17.076889;51.109594,17.077989',
      address: 'Szczytnicka 10, Wrocław',
      street: 'Szczytnicka',
      buildingNr: '10',
      apartmentNr: null,
      status: InvestmentStatus.APPROVED,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Nowa ścieżka rowerowa na Oporowie',
      locationX: 51.095194,
      locationY: 16.991389,
      area: '51.095500,16.990500;51.095500,16.992500;51.094800,16.990500;51.094800,16.992500',
      address: 'Grabiszyńska 400, Wrocław',
      street: 'Grabiszyńska',
      buildingNr: '400',
      apartmentNr: null,
      status: InvestmentStatus.IN_PROGRESS,
      responsible: 'Miasto Wrocław',
      isCommentable: true,
    },
    {
      title: 'Budowa fontanny w Parku Zachodnim',
      locationX: 51.126194,
      locationY: 16.986389,
      area: '51.125600,16.985900;51.125600,16.986800;51.124900,16.985900;51.124900,16.986800',
      address: 'Na Ostatnim Groszu 60, Wrocław',
      street: 'Na Ostatnim Groszu',
      buildingNr: '60',
      apartmentNr: null,
      status: InvestmentStatus.COMPLETED,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Odnowienie placu zabaw na Biskupinie',
      locationX: 51.104294,
      locationY: 17.095789,
      area: '51.104600,17.095300;51.104600,17.096200;51.103900,17.095300;51.103900,17.096200',
      address: 'Dembowskiego 25, Wrocław',
      street: 'Dembowskiego',
      buildingNr: '25',
      apartmentNr: null,
      status: InvestmentStatus.IN_PROGRESS,
      responsible: 'Urząd Wrocław',
      isCommentable: true,
    },
    {
      title: 'Renowacja Mostu Zwierzynieckiego',
      locationX: 51.108894,
      locationY: 17.068789,
      area: '51.109200,17.068300;51.109200,17.069300;51.108500,17.068300;51.108500,17.069300',
      address: 'Zwierzyniecka 1, Wrocław',
      street: 'Zwierzyniecka',
      buildingNr: '1',
      apartmentNr: null,
      status: InvestmentStatus.APPROVED,
      responsible: 'UM Wrocław',
      isCommentable: false,
    },
    {
      title: 'Budowa boiska wielofunkcyjnego na Krzykach',
      locationX: 51.085294,
      locationY: 17.024489,
      area: '51.085600,17.024000;51.085600,17.025000;51.084900,17.024000;51.084900,17.025000',
      address: 'Powstańców Śląskich 140, Wrocław',
      street: 'Powstańców Śląskich',
      buildingNr: '140',
      apartmentNr: null,
      status: InvestmentStatus.IN_PROGRESS,
      responsible: 'Miasto Wrocław',
      isCommentable: true,
    },
    {
      title: 'Rozbudowa infrastruktury rekreacyjnej na Gaju',
      locationX: 51.075394,
      locationY: 17.048989,
      area: '51.075800,17.048500;51.075800,17.049500;51.075100,17.048500;51.075100,17.049500',
      address: 'Armii Krajowej 90, Wrocław',
      street: 'Armii Krajowej',
      buildingNr: '90',
      apartmentNr: null,
      status: InvestmentStatus.COMPLETED,
      responsible: 'Urząd Wrocław',
      isCommentable: false,
    },
    {
      title: 'Modernizacja skweru przy Placu Grunwaldzkim',
      locationX: 51.108094,
      locationY: 17.066789,
      area: '51.108400,17.066300;51.108400,17.067300;51.107700,17.066300;51.107700,17.067300',
      address: 'Plac Grunwaldzki 2, Wrocław',
      street: 'Plac Grunwaldzki',
      buildingNr: '2',
      apartmentNr: null,
      status: InvestmentStatus.APPROVED,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Budowa tężni solankowej na Sępolnie',
      locationX: 51.098794,
      locationY: 17.095589,
      area: '51.099200,17.095100;51.099200,17.096000;51.098500,17.095100;51.098500,17.096000',
      address: 'Bacciarellego 45, Wrocław',
      street: 'Bacciarellego',
      buildingNr: '45',
      apartmentNr: null,
      status: InvestmentStatus.IN_PROGRESS,
      responsible: 'Miasto Wrocław',
      isCommentable: true,
    },
    {
      title: 'Nowa scena plenerowa w Parku Południowym',
      locationX: 51.084694,
      locationY: 17.022189,
      area: '51.085000,17.021700;51.085000,17.022700;51.084300,17.021700;51.084300,17.022700',
      address: 'Parkowa 8, Wrocław',
      street: 'Parkowa',
      buildingNr: '8',
      apartmentNr: null,
      status: InvestmentStatus.APPROVED,
      responsible: 'UM Wrocław',
      isCommentable: false,
    },
  ];

  for (let i = 0; i < investments.length; i++) {
    const pOI = await prisma.pOI.create({
      data: {
        id: counter,
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

    // Tworzenie rekordu Investment
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
    'Zapraszamy na Festiwal Światła, który odbędzie się w sercu naszego miasta. To wyjątkowe wydarzenie pełne instalacji świetlnych, projekcji oraz pokazów laserowych, które ożywią nocne niebo i miejską przestrzeń. Nie przegap tej niezwykłej okazji, by doświadczyć magii światła na żywo!',
    'Wrocławskie Dni Książki zapraszają wszystkich miłośników literatury na spotkania autorskie, warsztaty pisarskie oraz targi książki, które odbędą się w miejskiej bibliotece. To doskonała okazja, by wzbogacić swoją domową bibliotekę oraz poznać ciekawych twórców literatury.',
    'Ogłaszamy otwarte warsztaty malarskie w Parku Szczytnickim. Przyjdź i rozwijaj swoje umiejętności artystyczne pod okiem doświadczonych instruktorów. Wszystkie niezbędne materiały będą dostępne na miejscu, a udział w warsztatach jest bezpłatny!',
    'Zapraszamy na wystawę plenerową „Historia Wrocławia w Fotografii”. Przenieś się w czasie i zobacz, jak zmieniało się nasze miasto na przestrzeni lat. Wystawa będzie dostępna na Placu Wolności przez cały tydzień, wstęp wolny.',
    'Zapraszamy wszystkich mieszkańców na Maraton Fitness, który odbędzie się w Hali Stulecia. Przyjdź i wypróbuj różne formy aktywności fizycznej, od jogi po intensywne treningi kardio. Wydarzenie jest otwarte dla wszystkich, niezależnie od poziomu zaawansowania.',
    'Wrocławskie Dni Teatru! Czekają na Was spektakle plenerowe, warsztaty aktorskie oraz spotkania z twórcami sceny teatralnej. Wydarzenie odbędzie się na Wyspie Słodowej, zapewniając niesamowitą atmosferę i kontakt ze sztuką na świeżym powietrzu.',
    'Zachęcamy do udziału w miejskim biegu na orientację „Poznaj Wrocław”. Sprawdź swoje umiejętności nawigacyjne, odkrywając przy tym mniej znane zakątki miasta. Bieg rozpocznie się na Placu Grunwaldzkim i będzie podzielony na kilka kategorii wiekowych.',
    'Przyjdź na wielki jarmark świąteczny na Placu Solnym! Znajdziesz tu rękodzieło, przysmaki lokalnych wytwórców, a także atrakcje dla dzieci, takie jak karuzela i świąteczna kolejka. Rozpocznij przygotowania do świąt w wyjątkowej atmosferze.',
    'Ogłaszamy wielką akcję sprzątania Wrocławia. Dołącz do nas, aby wspólnie zadbać o czystość naszych ulic, parków i skwerów. Każdy uczestnik otrzyma worki na śmieci oraz rękawice, a dla najbardziej zaangażowanych przewidziano nagrody.',
    'Zapraszamy na plenerowy pokaz filmowy „Kino pod chmurką”, który odbędzie się w Parku Południowym. Przygotowaliśmy wygodne leżaki oraz zestaw klasycznych filmów, które umilą Wam letnie wieczory. Seanse będą odbywać się co weekend aż do końca sierpnia.',
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
    {
      title: 'Festiwal Światła',
      locationX: 51.1081,
      locationY: 17.0332,
      address: 'Plac Dominikański, Wrocław',
      street: 'Plac Dominikański',
      buildingNr: null,
      apartmentNr: null,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Wrocławskie Dni Książki',
      locationX: 51.1094,
      locationY: 17.0408,
      address: 'Biblioteka Miejska, Rynek 58, Wrocław',
      street: 'Rynek',
      buildingNr: '58',
      apartmentNr: null,
      responsible: 'Biblioteka Miejska Wrocław',
      isCommentable: true,
    },
    {
      title: 'Warsztaty malarskie',
      locationX: 51.1105,
      locationY: 17.0753,
      address: 'Park Szczytnicki, Wrocław',
      street: 'Park Szczytnicki',
      buildingNr: null,
      apartmentNr: null,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Wystawa fotografii',
      locationX: 51.1076,
      locationY: 17.0272,
      address: 'Plac Wolności, Wrocław',
      street: 'Plac Wolności',
      buildingNr: null,
      apartmentNr: null,
      responsible: 'Centrum Historii Zajezdnia',
      isCommentable: true,
    },
    {
      title: 'Maraton Fitness',
      locationX: 51.1049,
      locationY: 17.0787,
      address: 'Hala Stulecia, Wrocław',
      street: 'Hala Stulecia',
      buildingNr: null,
      apartmentNr: null,
      responsible: 'Akademia Fitness Wrocław',
      isCommentable: true,
    },
    {
      title: 'Wrocławskie Dni Teatru',
      locationX: 51.1152,
      locationY: 17.0329,
      address: 'Wyspa Słodowa, Wrocław',
      street: 'Wyspa Słodowa',
      buildingNr: null,
      apartmentNr: null,
      responsible: 'Teatr Współczesny Wrocław',
      isCommentable: true,
    },
    {
      title: 'Bieg na orientację',
      locationX: 51.1053,
      locationY: 17.0617,
      address: 'Plac Grunwaldzki, Wrocław',
      street: 'Plac Grunwaldzki',
      buildingNr: null,
      apartmentNr: null,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Jarmark Świąteczny',
      locationX: 51.1104,
      locationY: 17.0325,
      address: 'Plac Solny, Wrocław',
      street: 'Plac Solny',
      buildingNr: null,
      apartmentNr: null,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Akcja sprzątania miasta',
      locationX: 51.1077,
      locationY: 17.0303,
      address: 'Wrocław - różne lokalizacje',
      street: null,
      buildingNr: null,
      apartmentNr: null,
      responsible: 'Fundacja Ekologiczna Wrocław',
      isCommentable: true,
    },
    {
      title: 'Kino pod chmurką',
      locationX: 51.0951,
      locationY: 17.0297,
      address: 'Park Południowy, Wrocław',
      street: 'Park Południowy',
      buildingNr: null,
      apartmentNr: null,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
  ];

  for (let i = 0; i < announcements.length; i++) {
    const pOI = await prisma.pOI.create({
      data: {
        id: counter,
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
    'Szukasz swojego wymarzonego domu we Wrocławiu? Oferujemy na sprzedaż przestronny, nowoczesny dom położony w malowniczej okolicy, idealny dla rodziny szukającej spokoju i komfortu. Nieruchomość oferuje duży ogród, garaż na dwa samochody i jest wykończona w wysokim standardzie.',
    'Pilnie potrzebujesz mieszkania we Wrocławiu? Mamy dla Ciebie świetną ofertę! Wynajem: komfortowe, w pełni wyposażone mieszkanie na ulicy Krakowskiej 5 dostępne od zaraz. Doskonała lokalizacja, blisko do centrum miasta oraz licznych punktów usługowych i handlowych.',
    'Posiadasz firmę i potrzebujesz miejsca na przechowywanie sprzętu? Mamy dla Ciebie rozwiązanie! Do wynajęcia przestronny hangar na sprzęt, idealny dla firm. Hangar zlokalizowany jest w dogodnej lokalizacji, zapewniając łatwy dostęp i wysoki poziom bezpieczeństwa.',
    'Marzysz o domu z ogrodem, ale nie jesteś gotowy na zakup? Oferujemy na wynajem urokliwy dom z przestronnym ogrodem, idealny dla rodziny. Dom znajduje się w cichej, bezpiecznej okolicy, oferując komfort i prywatność, a jednocześnie bliskość do centrum miasta i infrastruktury.',
    'Rozwijasz startup i szukasz miejsca na swoje biuro? Mamy coś specjalnie dla Ciebie! Przestrzeń biurowa w centrum Wrocławia, idealna dla młodych firm i startupów. Nowoczesne biuro w prestiżowej lokalizacji zapewni odpowiednie warunki do pracy i rozwoju Twojego biznesu.',
    'Szukasz przestronnego mieszkania w sercu Wrocławia? Oferujemy na sprzedaż nowoczesne mieszkanie z balkonem i widokiem na Odrę, idealne dla osób ceniących sobie bliskość centrum miasta oraz wygodę codziennego życia. Nieruchomość wyposażona jest w wysokiej jakości materiały i dostępna od zaraz.',
    'Znalazłeś wymarzone miejsce dla swojej rodziny! Na sprzedaż oferujemy nowy, energooszczędny dom w przyjaznej okolicy, z dużym ogrodem oraz placem zabaw dla dzieci. Idealne dla osób szukających spokoju oraz rodzinnej atmosfery, a jednocześnie blisko do miejskich udogodnień.',
    'Chcesz zainwestować w nieruchomość? Mamy dla Ciebie doskonałą ofertę! Przestronny lokal użytkowy w ruchliwej części Wrocławia, z dużymi witrynami i możliwością adaptacji na różne cele. To idealne miejsce na rozwój Twojego biznesu, dostępne od zaraz.',
    'Szukasz przytulnego mieszkania na wynajem? Oferujemy na sprzedaż piękne, dwupokojowe mieszkanie na Osiedlu Biskupa Jordana, z balkonem i miejscem parkingowym. Cicha okolica, blisko do komunikacji miejskiej oraz punktów usługowych. To doskonała oferta dla pary lub singla!',
    'Planujesz otworzyć swój sklep? Mamy dla Ciebie idealną lokalizację! Na sprzedaż lokal handlowy w nowo powstałym kompleksie w centrum Wrocławia, z dużym natężeniem ruchu pieszych. To świetna okazja do rozwoju Twojego biznesu w dynamicznie rozwijającej się okolicy.',
    'Marzysz o działce budowlanej? Oferujemy na sprzedaż atrakcyjną działkę o powierzchni 1000 m² w spokojnej okolicy, idealną na budowę wymarzonego domu. Działka posiada dostęp do wszystkich mediów i jest położona w otoczeniu zieleni, co zapewnia komfortowe warunki do życia.',
    'Rozwijasz firmę i potrzebujesz nowej siedziby? Na sprzedaż oferujemy nowoczesny biurowiec w strategicznej lokalizacji Wrocławia. Budynek spełnia najwyższe standardy ekologiczne, z przestronnymi pomieszczeniami i dużym parkingiem. Idealne miejsce dla Twojego biznesu!',
    'Chcesz mieszkać w malowniczej okolicy? Mamy dla Ciebie na sprzedaż dom w pobliżu Wrocławia, otoczony lasami i rzekami. Nieruchomość z dużym ogrodem, idealna dla osób ceniących spokój i bliskość natury. To doskonałe miejsce na relaks po pracy.',
    'Szukasz nowoczesnej kawalerki w Wrocławiu? Oferujemy na sprzedaż stylową kawalerkę w nowym budownictwie, z aneksem kuchennym i miejscem postojowym. Świetna lokalizacja blisko centrum oraz komunikacji miejskiej sprawia, że to idealna propozycja dla singli lub par.',
    'Inwestujesz w nieruchomości? Na sprzedaż oferujemy lokal gastronomiczny w popularnej części Wrocławia, z dużym potencjałem rozwoju. Lokal spełnia wszystkie wymogi sanitarno-epidemiologiczne, gotowy do natychmiastowego prowadzenia działalności. Świetna okazja na rozwój swojego biznesu!',
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
    {
      title: 'Mieszkanie z widokiem na Odrę',
      locationX: 51.109594,
      locationY: 17.033589,
      address: 'Odrzańska 15, Wrocław',
      street: 'Odrzańska',
      buildingNr: '15',
      apartmentNr: null,
      sell: true,
      price: 550000,
      surface: 65,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Energooszczędny dom z ogrodem',
      locationX: 51.097594,
      locationY: 17.045589,
      address: 'Lechitów 1, Wrocław',
      street: 'Lechitów',
      buildingNr: '1',
      apartmentNr: null,
      sell: true,
      price: 750000,
      surface: 120,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Lokal użytkowy w centrum',
      locationX: 51.100994,
      locationY: 17.034989,
      address: 'Główna 2, Wrocław',
      street: 'Główna',
      buildingNr: '2',
      apartmentNr: null,
      sell: true,
      price: 300000,
      surface: 80,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Dwupokojowe mieszkanie na Osiedlu Biskupa Jordana',
      locationX: 51.102194,
      locationY: 17.036389,
      address: 'Biskupa Jordana 3, Wrocław',
      street: 'Biskupa Jordana',
      buildingNr: '3',
      apartmentNr: null,
      sell: true,
      price: 400000,
      surface: 50,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Lokal handlowy w kompleksie',
      locationX: 51.099194,
      locationY: 17.040389,
      address: 'Nowa 1, Wrocław',
      street: 'Nowa',
      buildingNr: '1',
      apartmentNr: null,
      sell: true,
      price: 600000,
      surface: 100,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Działka budowlana',
      locationX: 51.093194,
      locationY: 17.026589,
      address: 'Polna 1, Wrocław',
      street: 'Polna',
      buildingNr: '1',
      apartmentNr: null,
      sell: true,
      price: 200000,
      surface: 1000,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Nowoczesny biurowiec',
      locationX: 51.090194,
      locationY: 17.020389,
      address: 'Biura 1, Wrocław',
      street: 'Biura',
      buildingNr: '1',
      apartmentNr: null,
      sell: true,
      price: 2500000,
      surface: 800,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Dom w malowniczej okolicy',
      locationX: 51.086194,
      locationY: 17.010389,
      address: 'Leśna 10, Wrocław',
      street: 'Leśna',
      buildingNr: '10',
      apartmentNr: null,
      sell: true,
      price: 900000,
      surface: 150,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Stylowa kawalerka w nowym budownictwie',
      locationX: 51.109194,
      locationY: 17.041389,
      address: 'Kawalerska 1, Wrocław',
      street: 'Kawalerska',
      buildingNr: '1',
      apartmentNr: null,
      sell: true,
      price: 350000,
      surface: 38,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
    {
      title: 'Lokal gastronomiczny w popularnej części miasta',
      locationX: 51.092194,
      locationY: 17.038389,
      address: 'Gastronomiczna 5, Wrocław',
      street: 'Gastronomiczna',
      buildingNr: '5',
      apartmentNr: null,
      sell: true,
      price: 450000,
      surface: 120,
      responsible: 'UM Wrocław',
      isCommentable: true,
    },
  ];

  for (let i = 0; i < listings.length; i++) {
    const pOI = await prisma.pOI.create({
      data: {
        id: counter,
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

    // Tworzenie rekordu Listing
    await prisma.listing.create({
      data: {
        post: {
          connect: {
            id: counter++,
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
    'To świetnie, że coś takiego powstaje we Wrocławiu. Zegar słoneczny na pewno przyciągnie więcej turystów do naszego miasta.',
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
    'Początek DUMMY inwestycji',
    'Rewitalizacja żłobka',
    'Budowa Portu Lotniczego',
    'Modernizacja drogi na Ulicy 1 Maja',
    'Czyszczenie rzeki',
    'Modernizacja oświetlenia ulicznego',
    'Budowa nowej ścieżki rowerowej wokół jeziora',
    'Rewitalizacja parku miejskiego i instalacja siłowni plenerowej',
    'Rozbudowa biblioteki miejskiej i wprowadzenie czytelni',
    'Projekt zielonych dachów na budynkach użyteczności publicznej',
    'Instalacja stacji ładowania pojazdów elektrycznych',
    'Uruchomienie miejskiego programu recyklingu',
    'Rozwój lokalnych ogrodów społecznych',
    'Modernizacja miejskiego targowiska',
    'Budowa placów zabaw dostosowanych dla dzieci z niepełnosprawnościami',
    'Wprowadzenie systemu zarządzania odpadami komunalnymi',
    'Inwestycja w system monitoringu wizyjnego dla zwiększenia bezpieczeństwa',
    'Rozbudowa infrastruktury dla psów: wybiegi i punkty z wodą',
    'Modernizacja systemu kanalizacyjnego i przeciwdziałanie podtopieniom',
    'Budowa kąpieliska miejskiego nad rzeką',
    'Projekt oczyszczalni ścieków wykorzystującej nowoczesne technologie',
    'Inwestycja w miejskie centrum kultury z nowymi pracowniami',
    'Rozwój systemu miejskiego car-sharingu',
    'Budowa mieszkań komunalnych dla młodych rodzin',
    'Projekt termomodernizacji budynków komunalnych dla oszczędności energii',
  ];

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
    'Kocham Wrocław',
    'HydroKanal',
    'AquaPark Wrocław',
    'Oczyszczalnia Nowoczesna',
    'Centrum Kultury Innowacje',
    'AutoNaWspółkę',
    'Mieszkania dla Rodzin',
    'EkoEnergia Miejska',
    'TermoModernizacja',
  ];

  const investmentTypes = [
    InvestmentStatus.APPROVED,
    InvestmentStatus.REJECTED,
    InvestmentStatus.PENDING,
    InvestmentStatus.IN_PROGRESS,
    InvestmentStatus.COMPLETED,
  ];

  const allBadges = await prisma.badge.findMany();
  const allBadgeNames = allBadges.map((badge) => ({ name: badge.name }));

  const getRandomBadgeNames = () => {
    const shuffled = [...allBadgeNames].sort(() => 0.5 - Math.random());
    return shuffled
      .slice(0, Math.floor(Math.random() * 4) + 1)
      .map((badge) => ({ name: badge.name }));
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

      const pOI = await prisma.pOI.create({
        data: {
          id: counter,
          title: title,
          slug: slugify(title),
          locationX: centerLatitude,
          locationY: centerLongitude,
          responsible: responsibleNames[i % responsibleNames.length],
          street: 'Rynek',
          buildingNr: '11',
          apartmentNr: null,
        },
      });

      await prisma.investment.create({
        data: {
          area: area,
          isCommentable: Math.random() >= 0.5,
          status:
            investmentTypes[Math.floor(Math.random() * investmentTypes.length)],
          badges: {
            connect: getRandomBadgeNames(),
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

async function seedDummyAnnouncements() {
  const MIN_LATITUDE = 51.09;
  const MAX_LATITUDE = 51.13;
  const MIN_LONGITUDE = 16.98;
  const MAX_LONGITUDE = 17.04;
  const OFFSET = 0.00045;

  const announcementTitles = [
    'Otwarcie nowego żłobka na Krzykach',
    'Modernizacja mostu Grunwaldzkiego',
    'Rozbudowa kampusu Politechniki Wrocławskiej',
    'Utworzenie nowych ścieżek rowerowych na Nadodrzu',
    'Rewitalizacja parku Szczytnickiego',
    'Nowe ławki i oświetlenie na Wyspie Słodowej',
    'Modernizacja hali stulecia',
    'Otwarcie centrum naukowego na Placu Solnym',
    'Remont drogi na ulicy Świdnickiej',
    'Budowa nowego skateparku na Gaju',
    'Zakończenie renowacji Teatru Muzycznego Capitol',
    'Nowa galeria sztuki w centrum miasta',
    'Poszerzenie strefy czystego transportu',
    'Rozbudowa sieci tramwajowej na Ołtaszynie',
    'Otwarcie centrum kultury na Księżu Małym',
    'Nowe parkingi rowerowe w okolicy rynku',
    'Zielone dachy na budynkach miejskich',
    'Nowe place zabaw dla dzieci z niepełnosprawnościami',
    'Inwestycje w ekologiczne oświetlenie uliczne',
    'Modernizacja systemu kanalizacyjnego na Oporowie',
    'Nowe tereny rekreacyjne nad Odrą',
    'Zakończenie budowy akademika na ul. Grunwaldzkiej',
    'Projekt zielonej energii w miejskich budynkach',
    'Nowe stanowiska ładowania pojazdów elektrycznych',
    'Program dofinansowania instalacji fotowoltaicznych dla mieszkańców',
  ];

  const responsibleNames = [
    'UM Wrocław',
    'Budimex',
    'Eko Energia Wrocław',
    'Miejskie Przedsiębiorstwo Wodociągów i Kanalizacji',
    'Zarząd Zieleni Miejskiej',
  ];

  const allCategories = await prisma.announcementCategory.findMany();
  const allCategoryNames = allCategories.map((category) => ({
    name: category.name,
  }));

  await Promise.all(
    announcementTitles.map(async (title, i) => {
      const centerLatitude =
        Math.random() * (MAX_LATITUDE - MIN_LATITUDE) + MIN_LATITUDE;
      const centerLongitude =
        Math.random() * (MAX_LONGITUDE - MIN_LONGITUDE) + MIN_LONGITUDE;

      // Tworzenie obszaru ogłoszenia
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

      // Tworzenie POI
      const pOI = await prisma.pOI.create({
        data: {
          id: counter,
          title: title,
          slug: slugify(title),
          locationX: centerLatitude,
          locationY: centerLongitude,
          responsible: responsibleNames[i % responsibleNames.length],
          street: 'Rynek',
          buildingNr: '11',
        },
      });

      // Pobranie losowej kategorii AnnouncementCategory
      const randomCategory =
        allCategoryNames[getRandomInt(allCategoryNames.length)];

      // Tworzenie ogłoszenia
      const announcement = await prisma.announcement.create({
        data: {
          area: area,
          isCommentable: Math.random() >= 0.5,
          category: {
            connect: {
              name: randomCategory.name,
            },
          },
          poi: {
            connect: {
              id: pOI.id,
            },
          },
          post: {
            connect: {
              id: counter,
            },
          },
        },
      });

      console.log(`Ogłoszenie ${announcement.id} zostało utworzone.`);
      counter++;
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

async function seedDummyListings() {
  const MIN_LATITUDE = 51.09;
  const MAX_LATITUDE = 51.13;
  const MIN_LONGITUDE = 16.98;
  const MAX_LONGITUDE = 17.04;

  const responsibleNames = [
    'UM Wrocław',
    'Budimex',
    'Zarząd Zieleni Miejskiej',
    'EkoEnergia Wrocław',
    'Wrocławskie Oświetlenie Miejskie',
    'MPWiK Wrocław',
    'Tramwaje Wrocławskie',
    'EkoInwestycje Dolnośląskie',
    'Modernizacje Wrocławskie',
    'ElektroMobilność Wrocław',
    'Wrocławski Recykling',
    'Zarząd Dróg i Utrzymania Miasta',
    'Targowisko Wrocław',
    'Kultura Wrocław',
    'EkoZarządzanie Wrocław',
    'Bezpieczny Wrocław',
    'HydroEnergia Wrocław',
    'Wrocławski Park Wodny',
    'Oczyszczalnia Ścieków Wrocław',
    'Centrum Nauki Wrocław',
    'Wrocław na Współkę',
    'Mieszkania Wrocław',
    'Zielona Energia Wrocław',
    'TermoModernizacja Wrocław',
    'Architektura Wrocław',
  ];

  const listingTitles = [
    'Niezwykła okazja inwestycyjna: działka pod rozwój w centrum Wrocławia',
    'Żłobek po kompleksowej modernizacji na sprzedaż - idealny dla prowadzenia działalności edukacyjnej',
    'Sprzedam teren pod inwestycję niedaleko Rynku - wysoki potencjał komercyjny',
    'Działka na sprzedaż w okolicy mostu Grunwaldzkiego - doskonała lokalizacja',
    'Zainwestuj w nieruchomość nad Odrą - działka rekreacyjna na sprzedaż',
    'Lokal handlowy w centrum z nowoczesnym oświetleniem LED - idealny na sklep lub biuro',
    'Teren pod budowę osiedla mieszkaniowego na Krzykach - dobra komunikacja',
    'Sprzedam obiekt sportowy z siłownią i basenem w okolicy hali stulecia',
    'Nowoczesne biuro na sprzedaż w odrestaurowanym budynku - blisko centrum',
    'Budynek komercyjny z zielonym dachem na sprzedaż - energooszczędne rozwiązania',
    'Parking z nowymi stacjami ładowania EV - na sprzedaż lub wynajem',
    'Współpraca: grunt pod projekt recyklingowy - poszukiwani inwestorzy',
    'Działki pod ogrody społeczne - inwestycja w rozwój miejskich terenów zielonych',
    'Targowisko miejskie do przejęcia - duży potencjał na rozwój działalności',
    'Plac zabaw dla dzieci w nowej dzielnicy - szukamy operatora',
    'Sprzedam nieruchomość z systemem zarządzania odpadami - idealna lokalizacja',
    'Budynek biurowy z nowoczesnym systemem monitoringu na wynajem',
    'Teren na sprzedaż z infrastrukturą dla psów - wybieg i punkty z wodą',
    'Grunt do modernizacji systemu kanalizacyjnego - zabezpiecz przyszłe inwestycje',
    'Kąpielisko miejskie nad rzeką - poszukiwany nowy operator',
    'Nowoczesna oczyszczalnia ścieków na sprzedaż - inwestycja w ekologię',
    'Lokale w centrum kultury na wynajem - przestrzeń kreatywna dla biznesu',
    'Wynajem miejsc parkingowych dla systemu miejskiego car-sharingu - inwestycja w przyszłość',
    'Mieszkania komunalne w centrum - zainwestuj w nowe pokolenia Wrocławian',
    'Projekt budynku z termomodernizacją - energooszczędne rozwiązania na sprzedaż',
  ];

  await Promise.all(
    listingTitles.map(async (title, i) => {
      const centerLatitude =
        Math.random() * (MAX_LATITUDE - MIN_LATITUDE) + MIN_LATITUDE;
      const centerLongitude =
        Math.random() * (MAX_LONGITUDE - MIN_LONGITUDE) + MIN_LONGITUDE;

      const pOI = await prisma.pOI.create({
        data: {
          id: counter,
          title: title,
          slug: slugify(title),
          locationX: centerLatitude,
          locationY: centerLongitude,
          responsible: responsibleNames[i % responsibleNames.length],
          street: 'Rynek',
          buildingNr: '15',
          apartmentNr: null,
        },
      });

      await prisma.listing.create({
        data: {
          price: Math.floor(Math.random() * 900000) + 100000,
          surface: Math.floor(Math.random() * 200) + 50,
          sell: Math.random() >= 0.5,
          poi: {
            connect: {
              id: pOI.id,
            },
          },
          post: {
            connect: {
              id: counter,
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
  // The dummy comments are added only to the well thought out posts. Meaning the first 44 posts
  // those are 15 investments, 13 announcements, 15 listings. + 1 because prisma iterates from 1
  const LOWEST_CUSTOM_POST_NUM = 1;
  const HIGHEST_CUSTOM_POST_NUM = 44;

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

  console.log('Seeding DUMMY comments finished.');
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
