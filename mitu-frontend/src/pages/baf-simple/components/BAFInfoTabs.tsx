import { Card, CardTitle, CardHeader, CardContent } from '@/shadcn/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/shadcn/tabs';
import IconLoopStandard from '@/reusable-components/lordicon/IconLoopStandard';
import leafIcon from '@/lordicon/leafIcon.json';
import globeGreenIcon from '@/lordicon/globeGreenIcon.json';
import bafBenefitsIcon from '@/lordicon/bafBenefitsIcon.json';

export function BAFInfoTabs() {
  return (
    <Tabs defaultValue="baf">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="baf">Czym jest?</TabsTrigger>
        <TabsTrigger value="benefits">Zastosowanie</TabsTrigger>
        <TabsTrigger value="audience">Korzyści</TabsTrigger>
      </TabsList>

      <TabsContent value="baf">
        <Card className="min-h-52">
          <CardHeader>
            <CardTitle>
              Wskaźnik ekologiczny poprawiający bioróżnorodność
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-md">
              <div className="flex pe-3">
                <IconLoopStandard
                  icon={leafIcon}
                  sizes={{ sm: 50, md: 75, lg: 100 }}
                />
              </div>
              <p>
                BAF (Biotope Area Factor) to wskaźnik ekologiczny używany do
                oceny zieloności działek i obszarów urbanistycznych. Definiuje
                on stosunek powierzchni zielonych, przepuszczalnych i
                naturalnych na danym terenie do jego całkowitej powierzchni. BAF
                jest narzędziem planowania przestrzennego, które pomaga w
                integracji przestrzeni zielonych w środowisku miejskim,
                poprawiając tym samym bioróżnorodność i jakość życia
                mieszkańców.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="benefits">
        <Card>
          <CardHeader>
            <CardTitle>W wielu europejskich miastach</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex pe-3">
                <IconLoopStandard
                  icon={globeGreenIcon}
                  sizes={{ sm: 50, md: 75, lg: 100 }}
                />
              </div>
              <p>
                BAF jest stosowany głównie w kontekście miejskim do planowania
                nowych inwestycji budowlanych. W Berlinie każdy nowy projekt
                musi spełniać określone wartości BAF, co skutkuje większą
                ilością terenów zielonych i lepszą efektywnością ekologiczną
                obszarów miejskich. BAF jest tam stosowany od 1994 roku i
                skutiem tego jest znaczna poprawa jakości przestrzeni miejskich.
                Wskaźnik ten jest także wykorzystywany w innych miastach
                europejskich, takich jak Malmö czy Sztokholm, gdzie stosuje się
                odpowiednio GSP (Green Space Factor) i Grönytefaktor.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="audience">
        <Card>
          <CardHeader>
            <CardTitle>Ekologiczne i ekonomiczne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center h-min ">
              <div className="flex pe-3">
                <IconLoopStandard
                  icon={bafBenefitsIcon}
                  sizes={{ sm: 50, md: 75, lg: 100 }}
                />
              </div>
              <p>
                Wykorzystanie BAF w planowaniu przestrzennym pozwala na
                tworzenie zrównoważonych ekosystemów, które przynoszą korzyści
                miastu i przede wszystkim jego mieszkańcom. Wyliczenie BAF dla
                działki czy projektu budowlanego ma znaczenie praktyczne i
                środowiskowe. Przyczynia się do zwiększenia obszarów zielonych i
                naturalnych, co jest kluczowe w miejskich ekosystemach, często
                przesyconych betonem i asfaltem. Z punktu widzenia właściciela
                działki, inwestora, czy dewelopera, zastosowanie się do zaleceń
                wynikających z BAF może przynieść korzyści zarówno ekologiczne,
                jak i ekonomiczne, a także podnieść wartość i atrakcyjność
                nieruchomości.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
