import {
  IMAGE_EXT_LIST,
  TD_EXT_LIST,
  TD_SIZE_LIMIT,
  DOC_EXT_LIST,
  IMAGE_INVESTMENT_QUANTITY_LIMIT,
  DOC_INVESTMENT_QUANTITY_LIMIT,
  IMAGE_SIZE_LIMIT,
  IMAGE_ANNOUNCEMENT_QUANTITY_LIMIT,
  DOC_ANNOUNCEMENT_QUANTITY_LIMIT,
  IMAGE_LISTING_QUANTITY_LIMIT,
  DOC_LISTING_QUANTITY_LIMIT,
} from './constants';

export const ATTACHMENTS_LABEL = 'Załączniki';
export const BADGES_LABEL = 'Odznaki';

export const DOUBLE_WHITESPACE = '  ';

export const ONE_COMMENT_NAME = 'komentarz';
export const MORE_COMMENT_NAME = 'komentarze';
export const MOST_COMMENT_NAME = 'komentarzy';

export const FILTER_BUTTON_LABEL = 'Filtruj';

export const INVESTMENT_SORTING_OPTION_NEWEST_LABEL = 'Najnowsze';
export const INVESTMENT_SORTING_OPTION_OLDEST_LABEL = 'Najstarsze';
export const INVESTMENT_SORTING_OPTION_BEST_LABEL = 'Najlepsze';
export const INVESTMENT_SORTING_OPTION_WORST_LABEL = 'Najgorsze';

export const ANNOUNCEMENT_SORTING_OPTION_NEWEST_LABEL = 'Najnowsze';
export const ANNOUNCEMENT_SORTING_OPTION_OLDEST_LABEL = 'Najstarsze';
export const ANNOUNCEMENT_SORTING_OPTION_BEST_LABEL = 'Najlepsze';
export const ANNOUNCEMENT_SORTING_OPTION_WORST_LABEL = 'Najgorsze';

export const INVESTMENT_STATUS_NAME_PENDING = 'PENDING';
export const INVESTMENT_STATUS_NAME_IN_PROGRESS = 'IN_PROGRESS';
export const INVESTMENT_STATUS_NAME_COMPLETED = 'COMPLETED';
export const INVESTMENT_STATUS_NAME_APPROVED = 'APPROVED';
export const INVESTMENT_STATUS_NAME_REJECTED = 'REJECTED';

export const INVESTMENT_FILTERS_SECTION_STATUS_LABEL = 'Status inwestycji';
export const INVESTMENT_STATUS_LABEL_PENDING = 'Oczekujące';
export const INVESTMENT_STATUS_LABEL_IN_PROGRESS = 'W trakcie';
export const INVESTMENT_STATUS_LABEL_COMPLETED = 'Zakończone';
export const INVESTMENT_STATUS_LABEL_APPROVED = 'Zaakceptowane';
export const INVESTMENT_STATUS_LABEL_REJECTED = 'Odrzucone';

export const LISTING_SORTING_OPTION_NEWEST_LABEL = 'Najnowsze';
export const LISTING_SORTING_OPTION_OLDEST_LABEL = 'Najstarsze';

export const MLN_SHORTENING = 'mln';
export const THOUSAND_SHORTENING = 'tys';

export const USER_ROLE_NAME_ADMIN = 'ADMIN';
export const USER_ROLE_NAME_USER = 'USER';
export const USER_ROLE_NAME_OFFICIAL = 'OFFICIAL';

export const USER_ROLE_LABEL_ADMIN = 'Administrator';
export const USER_ROLE_LABEL_USER = 'Użytkownik';
export const USER_ROLE_LABEL_OFFICIAL = 'Urzędnik';

export const FILE_IMAGE_LABEL = 'Obraz';
export const FILE_DOC_LABEL = 'Dokument';
export const FILE_TD_LABEL = 'Model 3D';
export const FILE_OTHER_LABEL = 'Inny';

export const ADMIN_CREATE_STAGE = 'create';
export const ADMIN_DETAILS_STAGE = 'details';
export const ADMIN_NONE_STAGE = 'none';

// INVESTMENT CREATOR
export const INVESTMENT_CREATOR_TITLE_PLACEHOLDER = 'Tytuł inwestycji';
export const INVESTMENT_CREATOR_DESCRIPTION_PLACEHOLDER = 'Opis inwestycji';
export const INVESTMENT_RESPONSIBLE_TITLE_PLACEHOLDER =
  'Odpowiedzialny za inwestycję';
export const INVESTMENT_CREATOR_STATUS_PLACEHOLDER = 'Wybierz status projektu';
export const INVESTMENT_CREATOR_THUMBNAIL_LABEL_PLACEHOLDER = 'Miniaturka';
export const INVESTMENT_CREATOR_THUMBNAIL_ACTION_PLACEHOLDER = `Prześlij plik typu ${FILE_IMAGE_LABEL}. Będzie on wyświetlany jako miniaturka inwestycji. Wspierane formaty: ${IMAGE_EXT_LIST.join(
  ', ',
)}. Maksymalny rozmiar pliku: ${IMAGE_SIZE_LIMIT / 1000000}MB.`;

export const INVESTMENT_CREATOR_MODEL_LABEL_PLACEHOLDER = 'Model 3D';
export const INVESTMENT_CREATOR_MODEL_ACTION_PLACEHOLDER = `Prześlij model 3D. Będzie on możliwy do podglądu przez użytkowników, po wejściu na ekran detali inwestycji. Wspierane formaty: ${TD_EXT_LIST.join(
  ', ',
)}. Maksymalny rozmiar pliku: ${TD_SIZE_LIMIT / 1000000}MB.`;
export const INVESTMENT_CREATOR_ATTACHMENTS_LABEL_PLACEHOLDER = `W tym miejscu prześlij załączniki. Będą one wyświetlone w sekcji załączniki w szczegółach inwestycji. Wspierane formaty: ${[
  ...IMAGE_EXT_LIST,
  ...DOC_EXT_LIST,
].join(
  ', ',
)}. Możesz przesłać maksymalnie ${IMAGE_INVESTMENT_QUANTITY_LIMIT} plików typu ${FILE_IMAGE_LABEL} oraz maksymalnie ${DOC_INVESTMENT_QUANTITY_LIMIT} plików typu ${FILE_DOC_LABEL}.`;

export const LISTING_CREATOR_TITLE_PLACEHOLDER = 'Tytuł Nieruchomości';
export const LISTING_CREATOR_DESCRIPTION_PLACEHOLDER = 'Opis Nieruchomości';
export const LISTING_CREATOR_RESPONSIBLE_PLACEHOLDER =
  'Odpowiedzialny za nieruchomość';
export const LISTING_CREATOR_PRICE_PLACEHOLDER = 'Cena za wynajem/sprzedaż';
export const LISTING_CREATOR_SURFACE_PLACEHOLDER = 'Powierzchnia nieruchomości';
export const LISTING_CREATOR_ATTACHMENTS_LABEL_PLACEHOLDER = `W tym miejscu prześlij załączniki. Będą one wyświetlone w sekcji załączniki w szczegółach nieruchomości. Wspierane formaty: ${[
  ...IMAGE_EXT_LIST,
  ...DOC_EXT_LIST,
].join(
  ', ',
)}. Możesz przesłać maksymalnie ${IMAGE_LISTING_QUANTITY_LIMIT} plików typu ${FILE_IMAGE_LABEL} oraz maksymalnie ${DOC_LISTING_QUANTITY_LIMIT} plików typu ${FILE_DOC_LABEL}.`;
export const LISTING_CREATOR_THUMBNAIL_LABEL_PLACEHOLDER = 'Miniaturka *';
export const LISTING_CREATOR_THUMBNAIL_ACTION_PLACEHOLDER = `Prześlij plik typu ${FILE_IMAGE_LABEL}. Będzie on wyświetlany jako miniaturka nieruchomości. Wspierane formaty: ${IMAGE_EXT_LIST.join(
  ', ',
)}. Maksymalny rozmiar pliku: ${IMAGE_SIZE_LIMIT / 1000000}MB.`;

//ANNOUNCEMENT CREATOR
export const ANNOUNCEMENT_CREATOR_TITLE_PLACEHOLDER = 'Tytuł ogłoszenia';
export const ANNOUNCEMENT_CREATOR_DESCRIPTION_PLACEHOLDER = 'Opis ogłoszenia';
export const ANNOUNCEMENT_CREATOR_THUMBNAIL_LABEL_PLACEHOLDER = 'Miniaturka *';
export const ANNOUNCEMENT_CREATOR_THUMBNAIL_ACTION_PLACEHOLDER = `Prześlij plik typu ${FILE_IMAGE_LABEL}. Będzie on wyświetlany jako miniaturka ogłoszenia. Wspierane formaty: ${IMAGE_EXT_LIST.join(
  ', ',
)}. Maksymalny rozmiar pliku: ${IMAGE_SIZE_LIMIT / 1000000}MB.`;
export const ANNOUNCEMENT_RESPONSIBLE_TITLE_PLACEHOLDER =
  'Odpowiedzialny za ogłoszenie *';
export const ANNOUNCEMENT_CREATOR_ATTACHMENTS_LABEL_PLACEHOLDER = `W tym miejscu prześlij załączniki. Będą one wyświetlone w sekcji załączniki w szczegółach ogłoszenia. Wspierane formaty: ${[
  ...IMAGE_EXT_LIST,
  ...DOC_EXT_LIST,
].join(
  ', ',
)}. Możesz przesłać maksymalnie ${IMAGE_ANNOUNCEMENT_QUANTITY_LIMIT} plików typu ${FILE_IMAGE_LABEL} oraz maksymalnie ${DOC_ANNOUNCEMENT_QUANTITY_LIMIT} plików typu ${FILE_DOC_LABEL}.`;

export const INVESTMENT_NAME = 'investment';
export const INVESTMENT_NAME_UPPERCASE = 'INVESTMENT';
export const ANNOUNCEMENT_NAME = 'announcement';
export const ANNOUNCEMENT_NAME_UPPERCASE = 'ANNOUNCEMENT';
export const LISTING_NAME = 'listing';
export const LISTING_NAME_UPPERCASE = 'LISTING';
export const ALL_POSTS_NAME = 'ALL';

export const FILE_IMAGE_NAME = 'IMAGE';
export const FILE_DOC_NAME = 'DOC';
export const FILE_TD_NAME = 'TD';
export const FILE_OTHER_NAME = 'OTHER';

export const FILE_PATHS_IMAGE = 'IMAGE';
export const FILE_PATHS_DOC = 'DOC';
export const FILE_PATHS_TD = 'TD';
export const FILE_PATHS_OTHER = 'OTHER';

export const COMMENT_STATUS_PENDING = 'PENDING';
export const COMMENT_STATUS_APPROVED = 'APPROVED';
export const COMMENT_STATUS_HIDDEN = 'HIDDEN';
export const COMMENT_STATUS_REJECTED = 'REJECTED';

export const ERROR_DISPLAY_ALERT = 'alert';
export const ERROR_DISPLAY_FORM = 'form';
export const ERROR_SERVER_ERROR = 'Wystąpił nieznany błąd';
export const COMMENT_NOT_APPROVED_MESSAGE =
  'Komentarz oczekuje na zatwierdzenie.';

export const RIGHTBAR_STAGE_MAP = 'MAP';
export const RIGHTBAR_STAGE_AREA = 'AREA';
export const RIGHTBAR_STAGE_MODEL = 'MODEL';

export const MAP_CMD_EDIT_AREA = 'EDIT_AREA';
export const MAP_CMD_EDIT_LOCATION = 'EDIT_LOCATION';
export const MAP_CMD_EDIT_OFF = 'EDIT_OFF';

export const FORM_IS_COMMENTABLE_TRUE = 'Włączone';
export const FORM_IS_COMMENTABLE_FALSE = 'Wyłączone';

export const FORM_IS_SELLABLE_TRUE = 'Sprzedaż';
export const FORM_IS_SELLABLE_FALSE = 'Wynajem';

export const MAP_DESCRIPTION_EDIT_LOCATION =
  'Tryb edycji lokalizacji: przeciągnij znacznik w miejsce, które będzie reprezentowało lokalizację aktualnie tworzonego typu postu. Zadbaj, aby był on zgodny z rzeczywistością.';
export const MAP_DESCRIPTION_EDIT_AREA =
  'Tryb edycji obszaru: dodaj punkty na mapie używając lewego przycisku myszy. Możesz dowolnie modyfikować wybrany kształt poprzez przeciąganie znaczników. Obszar ten będzie przypisany do tworzonego akutalnie postu. Zadbaj, aby był on zgodny z rzeczywistością.';
export const MAP_DESCRIPTION_EDIT_OFF =
  'Edytor jest wyłączony. Wybierz odpowiedni tryb edycji korzystając z przycisków obok.';

export const PostTypeColor = {
  [INVESTMENT_NAME_UPPERCASE]: '#f59e0b',
  [LISTING_NAME_UPPERCASE]: '#3b82f6',
  [ANNOUNCEMENT_NAME_UPPERCASE]: '#10b981',
};

export const SELL_TRUE = 'Sprzedaż';
export const SELL_FALSE = 'Wynajem';

export const HECTARE_SHORTENING = 'ha';
export const SQUARE_METERS_SHORTENING = 'm²';

export const LOCATION_NOT_SPECIFIED = 'Lokalizacja nieokreślona';
