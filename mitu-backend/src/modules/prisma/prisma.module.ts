// prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { $Enums, PrismaClient } from '@prisma/client';

@Global()
@Module({
  providers: [
    {
      provide: PrismaClient,
      useFactory: () => {
        const c = new PrismaClient().$extends({
          result: {
            user: {
              fullName: {
                needs: {
                  lastName: true,
                  firstName: true,
                },
                compute(data): any {
                  return `${data.firstName} ${data.lastName}`;
                },
              },
            },
            post: {
              filePaths: {
                needs: {
                  id: true,
                  postType: true,
                },
                compute(data): any {
                  const paths = {};
                  paths[$Enums.FileType.IMAGE] =
                    `${data.postType}/${data.id}/${$Enums.FileType.IMAGE}/`;
                  paths[$Enums.FileType.DOC] =
                    `${data.postType}/${data.id}/${$Enums.FileType.DOC}/`;
                  paths[$Enums.FileType.TD] =
                    `${data.postType}/${data.id}/${$Enums.FileType.TD}/`;
                  return paths;
                },
              },
            },
          },
        });

        return c;
      },
      inject: [],
    },
  ],
  exports: [PrismaClient],
})
export class PrismaModule {}
