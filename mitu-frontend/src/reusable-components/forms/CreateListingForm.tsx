import { ChangeEvent, useEffect, useState } from 'react';
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '../../shadcn/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../shadcn/form';
import { Input } from '../../shadcn/input';
import { MaterialSymbol } from 'react-material-symbols';
import { Divider } from './../authentication/Divider';
import MultipleFilesUploader from './MultipleFilesUploader';
import { Textarea } from '../../shadcn/textarea';
import IconButton from '../IconButton';
import { Preview, PreviewImage, PreviewFallback } from '../../shadcn/preview';
import {
  MAX_LENGTH_LISTING_CONTENT,
  MAX_LENGTH_LISTING_TITLE,
  MIN_LENGTH_LISTING_CONTENT,
  MIN_LENGTH_LISTING_TITLE,
} from '@/max-lengths';
import {
  DOUBLE_WHITESPACE,
  FILE_IMAGE_NAME,
  FILE_TD_NAME,
  RIGHTBAR_STAGE_AREA,
  RIGHTBAR_STAGE_MAP,
  FORM_IS_SELLABLE_TRUE,
  FORM_IS_SELLABLE_FALSE,
  LISTING_NAME,
  LISTING_CREATOR_DESCRIPTION_PLACEHOLDER,
  LISTING_CREATOR_RESPONSIBLE_PLACEHOLDER,
  LISTING_CREATOR_TITLE_PLACEHOLDER,
  LISTING_CREATOR_PRICE_PLACEHOLDER,
  LISTING_CREATOR_SURFACE_PLACEHOLDER,
  LISTING_CREATOR_ATTACHMENTS_LABEL_PLACEHOLDER,
  LISTING_CREATOR_THUMBNAIL_LABEL_PLACEHOLDER,
  LISTING_CREATOR_THUMBNAIL_ACTION_PLACEHOLDER,
} from '@/strings';
import { extractUniqueFiles, validateFile, validateFiles } from '@/utils';
import {
  IMAGE_MIME_TYPES,
  DOC_MIME_TYPES,
  IMAGE_EXT_LIST,
  IMAGE_LISTING_QUANTITY_LIMIT,
  TD_LISTING_QUANTITY_LIMIT,
  DOC_LISTING_QUANTITY_LIMIT,
} from '@/constants';
import { FileBadge } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/routing/Router';
import { emitError } from '@/toast-actions';

import AttachmentDto from '@/core/api/common/attachment/AttachmentDto';
import AttachmentBadge from './AttachmentBadge';
import { LatLng } from 'leaflet';
import PanelLoader from '../loaders/PanelLoader';
import { useUiStore } from '@/core/stores/ui-store';
import { useListingStore } from '@/core/stores/listing-store';
import ListingDto from '@/core/api/listing/dto/listing';
import ListingInputDto from '@/core/api/listing/dto/listing.input';
import ListingInputPatchDto from '@/core/api/listing/dto/listing-patch.input';

const listingFormSchema = z.object({
  title: z
    .string()
    .min(MIN_LENGTH_LISTING_TITLE, { message: 'Tytuł jest wymagany' })
    .max(MAX_LENGTH_LISTING_TITLE, {
      message: 'Tytuł nie może być dłuższy niż 100 znaków.',
    }),
  description: z
    .string()
    .min(MIN_LENGTH_LISTING_CONTENT, { message: 'Opis jest wymagany' })
    .max(MAX_LENGTH_LISTING_CONTENT, {
      message: 'Opis nie może być dłuższy niż 1000 znaków.',
    }),
  responsible: z
    .string()
    .min(3, { message: 'Odpowiedzialny jest wymagany' })
    .max(50, { message: 'Odpowiedzialny nie może być dłuższy niż 50 znaków.' }),
  street: z
    .string()
    .min(3, { message: 'Ulica jest wymagana' })
    .max(100, { message: 'Nie może być dłuższa niż 100 znaków.' }),
  buildingNr: z
    .string()
    .min(1, { message: 'Numer domu jest wymagany' })
    .max(10, { message: 'Nie może być dłuższy niż 10 znaków.' }),
  apartmentNr: z
    .string()
    .max(10, {
      message: 'Nie może być dłuższy niż 10 znaków.',
    })
    .optional(),
  thumbnail: z.any(),
  price: z.string(),
  surface: z.string(),
  sell: z.string(),
});

type ListingFormData = z.infer<typeof listingFormSchema>;

export default function CreateListingForm({ edit }: { edit?: boolean }) {
  const {
    postListing,
    setSingleListing,
    singleListingLoading,
    singleListing,
    clearSingleListing,
    patchListing,
    setResetList,
  } = useListingStore();
  // const { getParsedLocation, setLocation, resetEditStoreState } =
  //   useMapEditStore();
  const { setRightbarStage } = useUiStore();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedThumbnail, setUploadedThumbnail] = useState<FileBadge[]>([]);
  const [slug, setSlug] = useState<string | null>(null);
  const [uploadedAttachments, setUploadedAttachments] = useState<FileBadge[]>(
    [],
  );
  const [initialSingleListing, setInitialSingleListing] =
    useState<ListingDto>();
  const [initialUploadedThumbnail, setInitialUploadedThumbnail] = useState<
    FileBadge[]
  >([]);
  const [initialUploadedAttachments, setInitialUploadedAttachments] = useState<
    FileBadge[]
  >([]);

  const handleResetEditor = () => {
    // TODO
  };

  useEffect(() => {
    setRightbarStage(RIGHTBAR_STAGE_AREA);
  }, []);

  useEffect(() => {
    return () => {
      // TODO
      clearSingleListing();
    };
  }, []);

  useEffect(() => {
    const slug = window.location.pathname.split('/').pop();
    if (edit && slug) {
      setSlug(slug);
    }
  }, []);

  useEffect(() => {
    if (edit && slug) {
      setSingleListing(slug);
    }
  }, []);

  useEffect(() => {
    if (edit && slug) {
      setSingleListing(slug);
    }
  }, [slug]);

  function validateImage(
    event: ChangeEvent<HTMLInputElement>,
    onChange: (event: any) => void,
  ) {
    const dataTransfer = new DataTransfer();
    if (event.target && event.target.files?.length == 0) return;

    let guard = false;
    Array.from(event.target.files!).forEach((image) => {
      const [error, fileType] = validateFile(image, [FILE_IMAGE_NAME]);

      if (error) {
        emitError(error);
        guard = true;
        return;
      }

      dataTransfer.items.add(image);
      if (edit) setUploadedThumbnail([]);
    });

    if (guard) return;

    const files = dataTransfer.files;
    const displayUrl = URL.createObjectURL(event.target.files![0]);
    onChange(files);
    setPreview(displayUrl);
  }

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingFormSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    if (singleListing && edit) {
      setInitialSingleListing(singleListing);
      form.setValue('title', singleListing.title);
      form.setValue('description', singleListing.content);
      form.setValue('responsible', singleListing.responsible);
      form.setValue('price', singleListing.price.toString());
      form.setValue('surface', singleListing.surface.toString());
      form.setValue(
        'sell',
        singleListing.sell ? FORM_IS_SELLABLE_TRUE : FORM_IS_SELLABLE_FALSE,
      );
      form.setValue('street', singleListing.street);
      form.setValue('buildingNr', singleListing.buildingNr);
      form.setValue('apartmentNr', singleListing.apartmentNr);

      // setLocation(new LatLng(singleListing.locationX, singleListing.locationY));

      const attachment_thumbnail = singleListing.attachments.find(
        (attachment: AttachmentDto) =>
          attachment.fileType === FILE_IMAGE_NAME &&
          attachment.fileName === singleListing.thumbnail,
      );

      const rest_attachments = singleListing.attachments.filter(
        (attachment: AttachmentDto) =>
          attachment.fileName !== singleListing.thumbnail &&
          attachment.fileType !== FILE_TD_NAME,
      );

      if (attachment_thumbnail) {
        const _t = {
          fileName: attachment_thumbnail!.fileName,
          fileType: attachment_thumbnail!.fileType,
        };
        setUploadedThumbnail([_t]);
        setInitialUploadedThumbnail([_t]);
      }

      const _as = rest_attachments.map((attachment: AttachmentDto) => ({
        fileName: attachment.fileName,
        fileType: attachment.fileType,
      }));
      setUploadedAttachments(_as);
      setInitialUploadedAttachments(_as);
    }

    return () => {
      clearSingleListing();
    };
  }, [singleListing]);

  useEffect(() => {
    if (!edit) {
      form.reset();
      setUploadedFiles([]);
      setUploadedThumbnail([]);
      clearSingleListing();
      handleResetEditor();
    }
  }, [edit]);

  const [preview, setPreview] = useState('');

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<ListingFormData> = (data) => {
    if (!data.thumbnail) {
      emitError('Miniatura jest wymagana');
      return;
    }

    // const location = getParsedLocation(); // TODO

    if (!location) {
      return;
    }

    const dto: ListingInputDto = {
      title: data.title,
      content: data.description,
      street: data.street,
      buildingNr: data.buildingNr,
      apartmentNr: data.apartmentNr,
      responsible: data.responsible,
      sell: data.sell === FORM_IS_SELLABLE_TRUE ? true : false,
      locationX: 51.110383, // TODO
      locationY: 17.033536, // TODO
      thumbnail: data.thumbnail[0].name,
      price: +data.price,
      surface: +data.surface,
    };

    const files: File[] = [
      ...extractUniqueFiles([...uploadedFiles, data.thumbnail[0]], []),
    ];
    const error = validateFiles(files, LISTING_NAME);

    if (error) {
      emitError(error);
      return;
    }

    postListing(dto, files, () => {
      setResetList(true);
      navigate(ROUTES.MAP.LISTINGS.path());
    });
  };

  const onEdit: SubmitHandler<ListingFormData> = (data) => {
    // const location = getParsedLocation(); // TODO

    // if (!location) {
    //   return;
    // }

    const dto: ListingInputPatchDto = {
      title: data.title,
      content: data.description,
      street: data.street,
      buildingNr: data.buildingNr,
      apartmentNr: data.apartmentNr,
      responsible: data.responsible,
      sell: data.sell === FORM_IS_SELLABLE_TRUE ? true : false,
      locationX: 51.110383, // TODO
      locationY: 17.033536, // TODO
      price: +data.price,
      surface: +data.surface,
    };

    if (!initialSingleListing) return;

    if (initialSingleListing.title === dto.title) {
      delete dto.title;
    }

    if (initialSingleListing.content === dto.content) {
      delete dto.content;
    }

    if (initialSingleListing.street === dto.street) {
      delete dto.street;
    }

    if (initialSingleListing.buildingNr === dto.buildingNr) {
      delete dto.buildingNr;
    }

    if (initialSingleListing.apartmentNr === dto.apartmentNr) {
      delete dto.apartmentNr;
    }

    if (initialSingleListing.responsible === dto.responsible) {
      delete dto.responsible;
    }

    if (initialSingleListing.locationX === dto.locationX) {
      delete dto.locationX;
    }

    if (initialSingleListing.locationY === dto.locationY) {
      delete dto.locationY;
    }

    if (initialSingleListing.sell === dto.sell) {
      delete dto.sell;
    }

    if (initialSingleListing.price === dto.price) {
      delete dto.price;
    }

    if (initialSingleListing.surface === dto.surface) {
      delete dto.surface;
    }

    const toBeExcluded = [];

    if (
      initialUploadedThumbnail.length > 0 &&
      initialUploadedThumbnail.length !== uploadedThumbnail.length
    ) {
      if (!data.thumbnail) {
        emitError('Miniatura jest wymagana');
        return;
      }

      dto.thumbnail = data.thumbnail[0].name;

      toBeExcluded.push(
        `${initialUploadedThumbnail[0].fileType}/${initialUploadedThumbnail[0].fileName}`,
      );
    }

    const initialAttachments = initialUploadedAttachments.map(
      (attachment) => `${attachment.fileType}/${attachment.fileName}`,
    );
    const currentAttachments = uploadedAttachments.map(
      (attachment) => `${attachment.fileType}/${attachment.fileName}`,
    );

    const attachmentsToBeExcluded = initialAttachments.filter(
      (attachment) => !currentAttachments.includes(attachment),
    );

    toBeExcluded.push(...attachmentsToBeExcluded);

    const thumbnailfile = data.thumbnail ? data.thumbnail : [];
    const filenamesToIgnore = uploadedAttachments.map((f) => f.fileName);
    const files: File[] = [
      ...extractUniqueFiles(
        [...uploadedFiles, ...thumbnailfile],
        [...filenamesToIgnore, initialUploadedThumbnail[0].fileName],
      ),
    ];
    const error = validateFiles(files, LISTING_NAME);

    if (error) {
      emitError(error);
      return;
    }

    if (
      Object.keys(dto).length === 0 &&
      files.length === 0 &&
      toBeExcluded.length === 0
    ) {
      emitError('Nie wprowadzono żadnych zmian');
      return;
    }
    dto.exclude = toBeExcluded.join(';');
    console.log('ASDASDSA');
    patchListing(`${initialSingleListing.id}`, dto, files, (slug) => {
      setResetList(true);
      navigate(ROUTES.MAP.LISTING.BY_NAME.path(slug));
    });
  };

  const handleDeselectAttachment = (fileName: string) => {
    setUploadedAttachments((prev) =>
      prev.filter((attachment) => attachment.fileName !== fileName),
    );
  };

  const handleDeselectThumbnail = (fileName: string) => {
    setUploadedThumbnail([]);
  };

  return (
    <div className="p-8 h-full scrollable-vertical relative">
      {edit && singleListingLoading && (
        <div className="absolute top-0 left-0 z-[100] w-full h-full bg-black bg-opacity-5">
          <PanelLoader />
        </div>
      )}
      <Form {...form}>
        <form
          onSubmit={
            edit ? form.handleSubmit(onEdit) : form.handleSubmit(onSubmit)
          }
        >
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LISTING_CREATOR_TITLE_PLACEHOLDER} *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={LISTING_CREATOR_TITLE_PLACEHOLDER}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {LISTING_CREATOR_DESCRIPTION_PLACEHOLDER} *
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder={LISTING_CREATOR_DESCRIPTION_PLACEHOLDER}
                      maxCharacters={2000}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="responsible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {LISTING_CREATOR_RESPONSIBLE_PLACEHOLDER}*
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={LISTING_CREATOR_RESPONSIBLE_PLACEHOLDER}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sell"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wybierz typ oferty *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz opcję sprzedaży" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      <SelectItem value={FORM_IS_SELLABLE_TRUE}>
                        Sprzedaż
                      </SelectItem>
                      <SelectItem value={FORM_IS_SELLABLE_FALSE}>
                        Wynajem
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LISTING_CREATOR_PRICE_PLACEHOLDER}*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={LISTING_CREATOR_PRICE_PLACEHOLDER}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="surface"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{LISTING_CREATOR_SURFACE_PLACEHOLDER}*</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={LISTING_CREATOR_SURFACE_PLACEHOLDER}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Divider text="Adres i lokalizacja" />
            <FormField
              control={form.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ulica</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="buildingNr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numer domu *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="apartmentNr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Numer mieszkania</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="mt-6">
            <Divider text="Pliki" />
          </div>
          <div className="flex flex-col gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="attachments"
              >
                Załączniki
              </label>
              {edit && (
                <div className="flex flex-wrap gap-2 m-2">
                  {uploadedAttachments.length > 0 &&
                    uploadedAttachments.map((file_badge: FileBadge) => (
                      <AttachmentBadge
                        fileBadge={file_badge}
                        deselect={handleDeselectAttachment}
                      />
                    ))}
                </div>
              )}
              <MultipleFilesUploader
                acceptedFileTypes={[...IMAGE_MIME_TYPES, ...DOC_MIME_TYPES]}
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                allowMultiple={true}
                maxFiles={
                  IMAGE_LISTING_QUANTITY_LIMIT +
                  TD_LISTING_QUANTITY_LIMIT +
                  DOC_LISTING_QUANTITY_LIMIT
                }
              />
              <FormDescription>
                {LISTING_CREATOR_ATTACHMENTS_LABEL_PLACEHOLDER}
              </FormDescription>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field: { onChange, value, ...rest } }) => (
                  <>
                    <FormItem className="col-span-2">
                      <FormLabel>
                        {LISTING_CREATOR_THUMBNAIL_LABEL_PLACEHOLDER}
                      </FormLabel>
                      {edit && uploadedThumbnail.length > 0 && (
                        <div className="flex flex-wrap gap-2 m-2">
                          {uploadedThumbnail.length > 0 &&
                            uploadedThumbnail.map((file_badge: FileBadge) => (
                              <AttachmentBadge
                                fileBadge={file_badge}
                                deselect={handleDeselectThumbnail}
                              />
                            ))}
                        </div>
                      )}
                      <FormControl>
                        <Input
                          type="file"
                          accept={`${[...IMAGE_MIME_TYPES, ...IMAGE_EXT_LIST].join(', ')}`}
                          {...rest}
                          onChange={(event) => {
                            validateImage(event, onChange);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {LISTING_CREATOR_THUMBNAIL_ACTION_PLACEHOLDER}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
              <Preview className="w-full h-full rounded-md">
                <PreviewImage className="aspect-square" src={preview} />
                <PreviewFallback>Podgląd</PreviewFallback>
              </Preview>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <IconButton
              icon={<MaterialSymbol size={36} icon="add" color="white" />}
              text={edit ? 'Edytuj nieruchomość' : 'Dodaj nieruchomość'}
              hint={
                edit
                  ? 'Nieruchomość zostanie zaktualizowana.'
                  : 'Nieruchomość zostanie dodana do listy inwestycji dla wszystkich użytkowników.'
              }
              buttonType={{
                variant: 'default',
                size: 'default',
              }}
              className={'mt-1'}
              type="submit"
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
