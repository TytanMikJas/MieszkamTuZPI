export const ERROR_INTERNAL_SERVER_ERROR = 'Błąd serwera';
export const ERROR_UNAUTHORIZED = 'Nieupoważniony dostęp';
export const ERROR_FORBIDDEN = 'Wstęp wzbroniony';

//FILE UPLOAD
export const ERROR_INVALID_FILE_TYPE = 'Niepoprawny typ pliku';
export const ERROR_INVALID_FILE_SIZE = 'Niepoprawny rozmiar pliku';
export const ERROR_TOO_MANY_IMAGE_FILES = 'Za dużo plików graficznych';
export const ERROR_TOO_MANY_TD_FILES = 'Za dużo plików 3D';
export const ERROR_TOO_MANY_DOC_FILES = 'Za dużo dokumentów';
export const ERROR_FILE_TOO_LARGE = 'Plik jest zbyt duży';

export const FILE_PATHS_IMAGE = 'IMAGE';
export const FILE_PATHS_DOC = 'DOC';
export const FILE_PATHS_TD = 'TD';

//FILE HANDLER
export const ERROR_INVALID_EXCLUDE_STRING = 'Niepoprawny ciąg wykluczeń';
export const ERROR_INVALID_POST_TYPE = 'Niepoprawny typ postu';

//POSTS
export const ERROR_POST_NOT_FOUND = 'Nie znaleziono postu';
export const ERROR_POST_CONTENT_TOO_LONG = 'Treść zbyt długa';

//COMMENTS
export const ERROR_POST_COMMENT = 'Niepoprawny komentarz';
export const SUCCESS_POST_COMMENT = 'Pomyślnie dodano komentarz';
export const SUCCESS_PATCH_STATUS_COMMENT =
  'Pomyślnie zedytowano status komentarza';
export const SUCCESS_PATCH_CONTENT_COMMENT =
  'Pomyślnie zedytowano treść komentarza';
export const SUCCESS_PATCH_FILES_COMMENT =
  'Pomyślnie zedytowano pliki komentarza';
export const ERROR_PATCH_STATUS_COMMENT = 'Niepoprawny status komentarza';
export const ERROR_COMMENT_NOT_FOUND = 'Nie znaleziono komentarza';
export const ERROR_PATCH_CONTENT_COMMENT_EMPTY = 'Treść nie może być pusta';
export const ERROR_PATCH_CONTENT_COMMENT_TOO_LONG =
  'Treść komentarza jest zbyt długa';
export const ERROR_PATCH_CONTENT_COMMENT_TOO_SHORT =
  'Treść komentarza jest zbyt krótka';
export const SUCCESS_HIDE_COMMENT = 'Pomyślnie usunięto komentarz';

//INVESTMENTS
export const SUCCESS_POST_INVESTMENT = 'Pomyślnie stworzono inwestycję';
export const SUCCESS_PATCH_INVESTMENT = 'Pomyślnie zedytowano inwestycję';
export const ERROR_POST_INVESTMENT = 'Niepoprawne dane inwestycji';

export const ERROR_INVESTMENT_NOT_FOUND = 'Nie znaleziono inwestycji';
export const ERROR_INVESTMENT_CONTENT_TOO_LONG =
  'Opis inwestycji jest zbyt długa';
export const ERROR_INVESTMENT_CONTENT_TOO_SHORT =
  'Opis inwestycji jest zbyt krótka';
export const ERROR_INVESTMENT_TITLE_TOO_LONG =
  'Tytuł inwestycji jest zbyt długi';
export const ERROR_INVESTMENT_TITLE_TOO_SHORT =
  'Tytuł inwestycji jest zbyt długi';
export const ERROR_INVESTMENT_RESPONSIBLE_TOO_LONG =
  'Definicja podmiotu odpowiedzialnego jest zbyt długa';
export const ERROR_INVESTMENT_RESPONSIBLE_TOO_SHORT =
  'Definicja podmiotu odpowiedzialnego jest zbyt krótka';
export const SUCCESS_DELETE_INVESTMENT = 'Pomyślnie usunięto inwestycję';

export const ERROR_BADGE_NOT_FOUND = 'Nie znaleziono odznaki';
export const ERROR_CATEGORY_NOT_FOUND = 'Nie znaleziono kategorii';

//ANNOUNCEMENTS
export const SUCCESS_POST_ANNOUNCEMENT = 'Pomyślnie stworzono ogłoszenie';
export const SUCCESS_PATCH_ANNOUNCEMENT = 'Pomyślnie zaktualizowano ogłoszenie';
export const ERROR_POST_ANNOUNCEMENT = 'Niepoprawne dane ogłoszenia';
export const ERROR_ANNOUNCEMENT_NOT_FOUND = 'Nie znaleziono ogłoszenia';
export const ERROR_ANNOUNCEMENT_CONTENT_TOO_LONG =
  'Treść ogłoszenia jest zbyt długa';
export const ERROR_ANNOUNCEMENT_CONTENT_TOO_SHORT =
  'Treść ogłoszenia jest zbyt krótka';
export const ERROR_ANNOUNCEMENT_TITLE_TOO_LONG =
  'Tytuł ogłoszenia jest zbyt długi';
export const ERROR_ANNOUNCEMENT_TITLE_TOO_SHORT =
  'Tytuł ogłoszenia jest zbyt krótki';
export const ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_LONG =
  'Definicja podmiotu odpowiedzialnego jest zbyt długa';
export const ERROR_ANNOUNCEMENT_RESPONSIBLE_TOO_SHORT =
  'Definicja podmiotu odpowiedzialnego jest zbyt krótka';
export const SUCCESS_DELETE_ANNOUNCEMENT = 'Pomyślnie usunięto ogłoszenie';

//LISTINGS
export const SUCCESS_POST_LISTING = 'Pomyślnie stworzono nieruchomość';
export const SUCCESS_PATCH_LISTING = 'Pomyślnie zaktualizowano nieruchomość';
export const ERROR_POST_LISTING = 'Niepoprawne dane nieruchomości';

export const ERROR_LISTING_NOT_FOUND = 'Nie znaleziono nieruchomości';
export const ERROR_LISTING_CONTENT_TOO_LONG =
  'Opis nieruchomości jest zbyt długi';
export const ERROR_LISTING_CONTENT_TOO_SHORT =
  'Opis nieruchomości jest zbyt krótki';
export const ERROR_LISTING_TITLE_TOO_LONG =
  'Tytuł nieruchomości jest zbyt długi';
export const ERROR_LISTING_TITLE_TOO_SHORT =
  'Tytuł nieruchomości jest zbyt krótki';
export const ERROR_LISTING_RESPONSIBLE_TOO_LONG =
  'Definicja podmiotu odpowiedzialnego jest zbyt długa';
export const ERROR_LISTING_RESPONSIBLE_TOO_SHORT =
  'Definicja podmiotu odpowiedzialnego jest zbyt krótka';
export const SUCCESS_DELETE_LISTING = 'Pomyślnie usunięto nieruchomość';

// Rating
export const SUCCESS_POST_RATING = 'Ocena opublikowana pomyślnie';

//AUTH
export const ERROR_INVALID_PASSWORD = 'Nieprawidłowe hasło';
export const USER_LOGIN_ALREADY_EXISTS =
  'Użytkownik o takim loginie już istnieje';
export const ERROR_EMAIL_NOT_CONFIRMED =
  'Konto nie zostało zweryfikowane mailowo';
export const ERROR_USER_DELETED = 'Nieprawidłowy login lub hasło';
export const SIGN_IN_MSG = 'Pomyślnie zalogowano' as const;
export const SIGN_UP_MSG = 'Pomyślnie zarejestrowano' as const;
export const UPDATE_USER_INFO = 'Pomyślnie zaktualizowano informacje' as const;
export const UPDATE_USER_PASSWORD = 'Pomyślnie zaktualizowano hasło' as const;
export const UPDATE_USER_EMAIL = 'Pomyślnie zaktualizowano email' as const;
export const DELETE_USER_ACCOUNT = 'Pomyślnie usunięto konto' as const;
export const ME_MSG = 'Pomyślnie pobrano dane użytkownika' as const;
export const JWT_USER_NOT_FOUND_MESSAGE = (userId: string) =>
  `User of given in JWT payload with userId ${userId} doesn't exist` as const;
export const JWT_USER_NOT_ACTIVE_MESSAGE = (userId: string) =>
  `User of given in JWT payload with userId ${userId} is not active` as const;

export const SECRET_KEY = process.env.SECRET_KEY;
export const REDIS_HOST = process.env.REDIS_HOST;

export const ERROR_ID_NOT_PROVIDED = 'Nie podano numeru identyfikacyjnego';

export const ERROR_PSWD_RESET_NOT_PERMITED = 'Niedozwolone resetowanie hasła';
export const ERROR_PSWD_INVALID = 'Niepoprawne hasło';
export const SUCCESS_PSWD_RESET = 'Pomyślnie zresetowano hasło';

//ADMIN
export const ERROR_USER_NOT_FOUND = 'Nie znaleziono użytkownika';
export const ERROR_USER_PASSWORD_ADMIN =
  'Nie można zmienić hasła administratorowi';

//VALIDATION
export const ERROR_INVALID_ID = 'Niepoprawny numer identyfikacyjny';
export const ERROR_INVALID_LOCATION_TUPLE = 'Niepoprawna lokalizacja';

//CACHE
export const ROLES_KEY = 'roles';
export const CLEAR_CACHE_KEY = 'clear-cache';

//COMMENTS MODERATION
export const URL_PREFIX = '/uploads/COMMENT/';
export const URL_POSTFIX = '/IMAGE/';
export const AZURE_BLOCKLIST_NAME = 'mitu_blocklist';

export const RESEND_CONFIRMATION_EMAIL_USER_NOT_FOUND_MESSAGE =
  'Nastąpił nieoczekiwany błąd. Spróbuj zarejestrować się ponownie';

export const ERROR_STREET_TOO_LONG = 'Nazwa ulicy jest zbyt długa';
export const ERROR_STREET_TOO_SHORT = 'Nazwa ulicy jest zbyt krótka';
export const ERROR_BUILDING_NR_TOO_LONG = 'Numer budynku jest zbyt długi';
export const ERROR_BUILDING_NR_TOO_SHORT = 'Numer budynku jest zbyt krótki';
export const ERROR_APARTMENT_NR_TOO_LONG = 'Numer mieszkania jest zbyt długi';
export const ERROR_APARTMENT_NR_TOO_SHORT = 'Numer mieszkania jest zbyt krótki';
