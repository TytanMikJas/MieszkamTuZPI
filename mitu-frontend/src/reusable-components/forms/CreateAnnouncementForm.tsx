import { ChangeEvent, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/shadcn/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shadcn/form';
import { Input } from '@/shadcn/input';
import { MaterialSymbol } from 'react-material-symbols';
import { Divider } from '../authentication/Divider';
import { Textarea } from '@/shadcn/textarea';
import IconButton from '@/reusable-components/IconButton';
import { Preview, PreviewImage, PreviewFallback } from '@/shadcn/preview';
import {
  FILE_IMAGE_NAME,
  FILE_TD_NAME,
  ANNOUNCEMENT_CREATOR_DESCRIPTION_PLACEHOLDER,
  ANNOUNCEMENT_CREATOR_ATTACHMENTS_LABEL_PLACEHOLDER,
  ANNOUNCEMENT_CREATOR_THUMBNAIL_ACTION_PLACEHOLDER,
  ANNOUNCEMENT_CREATOR_THUMBNAIL_LABEL_PLACEHOLDER,
  ANNOUNCEMENT_CREATOR_TITLE_PLACEHOLDER,
  ANNOUNCEMENT_NAME,
  RIGHTBAR_STAGE_AREA,
  RIGHTBAR_STAGE_MAP,
  FORM_IS_COMMENTABLE_TRUE,
  FORM_IS_COMMENTABLE_FALSE,
  ANNOUNCEMENT_RESPONSIBLE_TITLE_PLACEHOLDER,
} from '@/strings';
import { extractUniqueFiles, validateFile, validateFiles } from '@/utils';
import {
  IMAGE_MIME_TYPES,
  DOC_MIME_TYPES,
  IMAGE_EXT_LIST,
  IMAGE_ANNOUNCEMENT_QUANTITY_LIMIT,
  TD_ANNOUNCEMENT_QUANTITY_LIMIT,
  DOC_ANNOUNCEMENT_QUANTITY_LIMIT,
} from '@/constants';
import { FileBadge } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/routing/Router';
import { emitError } from '@/toast-actions';
import AttachmentDto from '@/core/api/common/attachment/AttachmentDto';
import PanelLoader from '../loaders/PanelLoader';
import { useUiStore } from '@/core/stores/ui-store';
import { useAnnouncementStore } from '@/core/stores/announcement-store';
import AnnouncementInputDto from '@/core/api/announcement/dto/announcement.input';
import AnnouncementInputPatchDto from '@/core/api/announcement/dto/announcement-patch.input';
import AnnouncementDto from '@/core/api/announcement/dto/announcement';
import MultipleFilesUploader from './MultipleFilesUploader';
import AttachmentBadge from './AttachmentBadge';
import { AnnouncementFormData, announcementFormSchema } from './form-schemas';
import { useMapEditStore } from '@/core/stores/map/map-edit-store';
import { LatLng } from 'leaflet';
import { FullScreenLoader } from '../loaders/FullScreenLoader';

export default function CreateAnnouncementForm({ edit }: { edit?: boolean }) {
  const {
    postAnnouncement,
    setSingleAnnouncement,
    singleAnnouncementLoading,
    singleAnnouncement,
    clearSingleAnnouncement,
    patchAnnouncement,
    categories,
    fetchAvailableCategories,
    setResetList,
    formAnnouncementLoading,
  } = useAnnouncementStore();
  const {
    getParsedLocation,
    getParsedArea,
    setArea,
    setLocation,
    resetEditStoreState,
  } = useMapEditStore();
  const { setRightbarStage } = useUiStore();

  const [preview, setPreview] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedThumbnail, setUploadedThumbnail] = useState<FileBadge[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<FileBadge[]>(
    [],
  );
  const [initialSingleAnnouncement, setInitialSingleAnnouncement] =
    useState<AnnouncementDto>();
  const [initialUploadedThumbnail, setInitialUploadedThumbnail] = useState<
    FileBadge[]
  >([]);
  const [initialUploadedAttachments, setInitialUploadedAttachments] = useState<
    FileBadge[]
  >([]);

  const form = useForm<AnnouncementFormData>({
    resolver: zodResolver(announcementFormSchema),
    mode: 'onChange',
  });

  const navigate = useNavigate();
  const watchStreet = form.watch('street');
  const watchBuildingNr = form.watch('buildingNr');

  useEffect(() => {
    fetchAvailableCategories();
    setRightbarStage(RIGHTBAR_STAGE_AREA);

    return () => {
      setRightbarStage(RIGHTBAR_STAGE_MAP, resetEditStoreState);
      clearSingleAnnouncement();
    };
  }, []);

  useEffect(() => {
    const slugFromUrl = window.location.pathname.split('/').pop();
    if (edit && slugFromUrl) {
      setSingleAnnouncement(slugFromUrl, () => {});
    }
    if (!edit) {
      form.reset();
      setUploadedFiles([]);
      setUploadedThumbnail([]);
      clearSingleAnnouncement();
    }
  }, [edit]);

  useEffect(() => {
    if ((watchStreet ?? '').length < 3) {
      form.setValue('buildingNr', '');
      form.setValue('apartmentNr', '');
    }
  }, [watchStreet, form]);

  useEffect(() => {
    if ((watchBuildingNr ?? '').length < 3) {
      form.setValue('apartmentNr', '');
    }
  }, [watchBuildingNr, form]);

  useEffect(() => {
    if (singleAnnouncement && edit) {
      setInitialSingleAnnouncement(singleAnnouncement);
      form.setValue('title', singleAnnouncement.title);
      form.setValue('description', singleAnnouncement.content);
      form.setValue('category', singleAnnouncement.category.name);
      form.setValue('responsible', singleAnnouncement.responsible);
      form.setValue(
        'isCommentable',
        singleAnnouncement.isCommentable
          ? FORM_IS_COMMENTABLE_TRUE
          : FORM_IS_COMMENTABLE_FALSE,
      );

      if (singleAnnouncement.area) {
        setArea(singleAnnouncement.area);
      }
      setLocation(
        new LatLng(singleAnnouncement.locationX, singleAnnouncement.locationY),
      );

      if (singleAnnouncement.street) {
        form.setValue('street', singleAnnouncement.street);
      }

      if (singleAnnouncement.buildingNr) {
        form.setValue('buildingNr', singleAnnouncement.buildingNr);
      }

      if (singleAnnouncement.apartmentNr) {
        form.setValue('apartmentNr', singleAnnouncement.apartmentNr);
      }

      const attachment_thumbnail = singleAnnouncement.attachments.find(
        (attachment: AttachmentDto) =>
          attachment.fileType === FILE_IMAGE_NAME &&
          attachment.fileName === singleAnnouncement.thumbnail,
      );

      const rest_attachments = singleAnnouncement.attachments.filter(
        (attachment: AttachmentDto) =>
          attachment.fileName !== singleAnnouncement.thumbnail &&
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
      clearSingleAnnouncement();
    };
  }, [singleAnnouncement]);

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

  const onSubmit: SubmitHandler<AnnouncementFormData> = (data) => {
    if (!data.thumbnail) {
      emitError('Miniatura jest wymagana');
      return;
    }

    const location = getParsedLocation();

    if (!location) {
      emitError('Lokalizacja jest wymagana');
      return;
    }

    const area = getParsedArea(false);

    const dto: AnnouncementInputDto = {
      title: data.title,
      content: data.description,
      categoryName: data.category,
      street: data.street,
      buildingNr: data.buildingNr,
      apartmentNr: data.apartmentNr,
      responsible: data.responsible,
      isCommentable:
        data.isCommentable === FORM_IS_COMMENTABLE_TRUE ? true : false,
      locationX: location[0],
      locationY: location[1],
      thumbnail: data.thumbnail[0].name,
    };

    if (area) {
      dto.area = area;
    }

    const files: File[] = [
      ...extractUniqueFiles([...uploadedFiles, data.thumbnail[0]], []),
    ];
    const error = validateFiles(files, ANNOUNCEMENT_NAME);

    if (error) {
      emitError(error);
      return;
    }

    postAnnouncement(dto, files, () => {
      setResetList(true);
      navigate(ROUTES.MAP.ANNOUNCEMENTS.path());
    });
  };

  const onEdit: SubmitHandler<AnnouncementFormData> = (data) => {
    const location = getParsedLocation();
    const area = getParsedArea(false);

    const dto: AnnouncementInputPatchDto = {
      title: data.title,
      content: data.description,
      categoryName: data.category,
      street: data.street,
      buildingNr: data.buildingNr,
      apartmentNr: data.apartmentNr,
      isCommentable:
        data.isCommentable === FORM_IS_COMMENTABLE_TRUE ? true : false,

      responsible: data.responsible,
    };

    if (area) {
      dto.area = area;
    }

    if (location) {
      dto.locationX = location[0];
      dto.locationY = location[1];
    }

    if (!initialSingleAnnouncement) return;

    if (initialSingleAnnouncement.title === dto.title) {
      delete dto.title;
    }

    if (initialSingleAnnouncement.content === dto.content) {
      delete dto.content;
    }

    if (initialSingleAnnouncement.category.name === dto.categoryName) {
      delete dto.categoryName;
    }

    if (initialSingleAnnouncement.street === dto.street) {
      delete dto.street;
    }

    if (initialSingleAnnouncement.buildingNr === dto.buildingNr) {
      delete dto.buildingNr;
    }

    if (initialSingleAnnouncement.apartmentNr === dto.apartmentNr) {
      delete dto.apartmentNr;
    }

    if (initialSingleAnnouncement.isCommentable === dto.isCommentable) {
      delete dto.isCommentable;
    }

    if (initialSingleAnnouncement.locationX === dto.locationX) {
      delete dto.locationX;
    }

    if (initialSingleAnnouncement.locationY === dto.locationY) {
      delete dto.locationY;
    }

    if (initialSingleAnnouncement.area === dto.area) {
      delete dto.area;
    }

    if (initialSingleAnnouncement.responsible === dto.responsible) {
      delete dto.responsible;
    }

    const toBeExcluded = [];

    //compare

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
    const error = validateFiles(files, ANNOUNCEMENT_NAME);

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
    patchAnnouncement(`${initialSingleAnnouncement.id}`, dto, files, (slug) => {
      setResetList(true);
      navigate(ROUTES.MAP.ANNOUNCEMENT.BY_NAME.path(slug));
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
      {edit && singleAnnouncementLoading && (
        <div className="absolute top-0 left-0 z-[100] w-full h-full bg-black bg-opacity-5">
          <PanelLoader />
        </div>
      )}

      {formAnnouncementLoading && <FullScreenLoader />}

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
                  <FormLabel>Tytuł *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={ANNOUNCEMENT_CREATOR_TITLE_PLACEHOLDER}
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
                  <FormLabel>Opis *</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      placeholder={ANNOUNCEMENT_CREATOR_DESCRIPTION_PLACEHOLDER}
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategoria *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz kategorię" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category, i) => (
                        <SelectItem key={i} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    {ANNOUNCEMENT_RESPONSIBLE_TITLE_PLACEHOLDER}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={ANNOUNCEMENT_RESPONSIBLE_TITLE_PLACEHOLDER}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isCommentable"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Możliwość komentowania *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz opcję komentarzy" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      <SelectItem value={FORM_IS_COMMENTABLE_TRUE}>
                        Włączone
                      </SelectItem>
                      <SelectItem value={FORM_IS_COMMENTABLE_FALSE}>
                        Wyłączone
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                    <FormLabel>Numer budynku</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={(watchStreet ?? '').length < 3}
                      />
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
                      <Input
                        {...field}
                        disabled={(watchBuildingNr ?? '').length < 1}
                      />
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
                  IMAGE_ANNOUNCEMENT_QUANTITY_LIMIT +
                  TD_ANNOUNCEMENT_QUANTITY_LIMIT +
                  DOC_ANNOUNCEMENT_QUANTITY_LIMIT
                }
              />
              <FormDescription>
                {ANNOUNCEMENT_CREATOR_ATTACHMENTS_LABEL_PLACEHOLDER}
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
                        {ANNOUNCEMENT_CREATOR_THUMBNAIL_LABEL_PLACEHOLDER}
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
                        {ANNOUNCEMENT_CREATOR_THUMBNAIL_ACTION_PLACEHOLDER}
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
              text={edit ? 'Edytuj ogłoszenie' : 'Dodaj ogłoszenie'}
              hint={
                edit
                  ? 'Ogłoszenie zostanie zaktualizowane.'
                  : 'Ogłoszenie zostanie dodana do listy ogłoszeń dla wszystkich użytkowników.'
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
