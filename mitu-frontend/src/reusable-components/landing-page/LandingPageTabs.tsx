import { Card, CardTitle, CardHeader, CardContent } from '../../shadcn/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../shadcn/tabs';
import IconLoopStandard from '../lordicon/IconLoopStandard';
import parkBench from '../../lordicon/park-bench.json';
import home from '../../lordicon/home.json';
import announcementIcon from '../../lordicon/announcement.json';

export function LandingPageTabs() {
  return (
    <Tabs defaultValue="inwestycje">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="inwestycje">Inwestycje</TabsTrigger>
        <TabsTrigger value="nieruchomosci">Nieruchomości</TabsTrigger>
        <TabsTrigger value="ogloszenia">Ogłoszenia</TabsTrigger>
      </TabsList>

      <TabsContent value="inwestycje">
        <Card>
          <CardHeader>
            <CardTitle>Inwestycje</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex pe-3">
                <IconLoopStandard
                  icon={parkBench}
                  sizes={{ sm: 50, md: 75, lg: 100 }}
                />
              </div>
              <p>
                Witryna Inwestycje oferuje mieszkańcom i inwestorom wyjątkowy
                wgląd w rozwój ich miasta, prezentując nadchodzące projekty.ㅤ
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="nieruchomosci">
        <Card>
          <CardHeader>
            <CardTitle>Nieruchomości</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex pe-3">
                <IconLoopStandard
                  icon={home}
                  sizes={{ sm: 50, md: 75, lg: 100 }}
                />
              </div>
              <p>
                Witryna Nieruchomości to dynamiczna przestrzeń, która umożliwia
                użytkownikom odkrywanie, oferowanie i negocjowanie
                nieruchomości.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="ogloszenia">
        <Card>
          <CardHeader>
            <CardTitle>Ogłoszenia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="flex pe-3">
                <IconLoopStandard
                  icon={announcementIcon}
                  sizes={{ sm: 50, md: 75, lg: 100 }}
                />
              </div>
              <p>
                Witryna Ogłoszenia to oferuje ogłoszenia miejskie, zapewniając
                mieszkańcom aktualne informacje o wydarzeniach, konsultacjach i
                inicjatywach.
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
