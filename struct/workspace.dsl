workspace "Name" "Description" {

    !identifiers hierarchical

    model {
        u = person "Użytkownik"
        webcrawler = person "Webcrawler"

        ss = softwareSystem "MieszkamTU" {
            tags "MieszkamTu"
            mitu-frontend = container "mitu-frontend" {
                tags "dockercontainer"
            }
            mitu-backend = container "mitu-backend" {
                tags "backendserver"

                filehandler-module = component "FilehandlerModule" {
                    tags "module" "color1"
                }
                filehandler-controller = component "FilehandlerController" {
                    tags "color1"
                  }
                filehandler-service = component "FilehandlerService"{
                    tags "color1"
                  }
                filehandler-module -> filehandler-controller "Definiuje"
                filehandler-module -> filehandler-service "Definiuje"
                filehandler-module -> filehandler-service "Eksportuje"

                post-module = component "PostModule" {
                    tags "module" "color2"
                }
                post-service = component "PostService" {
                    tags "color2"
                  }
                post-repository = component "PostRepository" {
                    tags "color2"
                  }
                post-module -> post-service "Definiuje"
                post-module -> post-repository "Definiuje"
                post-module -> post-service "Eksportuje"

                investment-module = component "InvestmentModule" {
                    tags "module" "color3"
                }
                investment-controller = component "InvestmentController" {
                    tags "color3"
                }
                investment-service = component "InvestmentService" {
                    tags "color3"
                }
                investment-repository = component "InvestmentRepository" {
                    tags "color3"
                }
                investment-module -> investment-controller "Definiuje"
                investment-module -> investment-service "Definiuje"
                investment-module -> investment-repository "Definiuje"
                investment-module -> investment-service "Eksportuje"
                investment-module -> filehandler-module "Importuje"
                investment-module -> post-module "Importuje"


                sentiment-module = component "SentimentModule" {
                    tags "module" "color4"
                }
                sentiment-service = component "SentimentService" {
                    tags "color4"
                }
                sentiment-controller = component "SentimentController" {
                    tags "color4"
                }
                sentiment-module -> sentiment-service "Definiuje"
                sentiment-module -> sentiment-controller "Definiuje"
                sentiment-module -> sentiment-service "Eksportuje"
                sentiment-module -> post-module "Importuje"
                
            }
            mitu-postgres = container "mitu-postgres" {
                tags "database"
            }
            mitu-redis = container "mitu-redis" {
                tags "database"
            }
            mitu-cron = container "mitu-cron" {
                tags "backendserver"
            }
            mitu-smtp4dev = container "mitu-smtp4dev"
            mitu-prerender = container "mitu-prerender"
        }
        smtp = softwareSystem "Serwer SMTP" {

        }

        azure_language = softwareSystem "Azure AI Language"
        azure_content_safety = softwareSystem "Azure AI Content Safety"
        geoportal = softwareSystem "Geoportal"
        openaq = softwareSystem "OpenAQ"

        u -> ss.mitu-frontend "Używa aplikacji na przeglądarce"
        webcrawler -> ss.mitu-frontend "Wysyła żądania HTTP"
        

        ss.mitu-frontend -> ss.mitu-backend "Przekazuje dalej zapytania HTTP"
        ss.mitu-backend -> ss.mitu-postgres "Zapisuje i odczytuje dane"
        ss.mitu-backend -> ss.mitu-redis "Zapisuje odpowiedzi HTTP w pamięci podręcznej"
        ss.mitu-cron -> ss.mitu-postgres "Zapisuje i odczytuje dane"
        ss.mitu-backend -> ss.mitu-smtp4dev "Wysyła maile (tylko w trybie deweloperskim)"
        ss.mitu-backend -> smtp "Wysyła maile (tylko w trybie produkcyjnym)"
        ss.mitu-backend -> azure_language "Wysyła zapytania o analizę sentymentu tekstu"
        ss.mitu-backend -> azure_content_safety "Wysyła zapytania o analizę bezpieczeństwa treści"
        ss.mitu-backend -> geoportal "Pobiera dane o lokalizacji"
        ss.mitu-backend -> openaq "Pobiera dane o jakości powietrza"


    }

    views {
        styles {
            element "database" {
                shape "cylinder"
            }

            element "backendserver" {
                shape "hexagon"
            }

            element  "MieszkamTu" {
                shape "hexagon"
                color "#f0f0f0"
            }

            element "module" {
                shape "folder"
            }

            element "color1" {
                background "#4CAF50"
            }

            element "color2" {
                background "#2196F3"
            }

            element "color3" {
                background "#FF9800"
            }

            element "color4" {
                background "#F44336"
            }

        }

        systemContext ss "MieszkamTU" {
            include *
        }


        component ss.mitu-backend "mitu-backend" {
            include *
        }
       	theme default
    }

        

}