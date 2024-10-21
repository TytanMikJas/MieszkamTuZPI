import { ChangeEvent, useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
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
  MAX_LENGHT_INVESTMENT_RESPONSIBLE,
  MAX_LENGTH_INVESTMENT_CONTENT,
  MAX_LENGTH_INVESTMENT_TITLE,
  MIN_LENGHT_INVESTMENT_RESPONSIBLE,
  MIN_LENGTH_INVESTMENT_CONTENT,
  MIN_LENGTH_INVESTMENT_TITLE,
} from '@/max-lengths';
import { useInvestmentStore } from '@/core/stores/investment-store';
import {
  FILE_IMAGE_NAME,
  FILE_TD_NAME,
  INVESTMENT_CREATOR_ATTACHMENTS_LABEL_PLACEHOLDER,
  INVESTMENT_CREATOR_MODEL_ACTION_PLACEHOLDER,
  INVESTMENT_CREATOR_MODEL_LABEL_PLACEHOLDER,
  INVESTMENT_CREATOR_THUMBNAIL_ACTION_PLACEHOLDER,
  INVESTMENT_CREATOR_THUMBNAIL_LABEL_PLACEHOLDER,
  INVESTMENT_CREATOR_TITLE_PLACEHOLDER,
  INVESTMENT_NAME,
  RIGHTBAR_STAGE_AREA,
  INVESTMENT_RESPONSIBLE_TITLE_PLACEHOLDER,
  FORM_IS_COMMENTABLE_TRUE,
  FORM_IS_COMMENTABLE_FALSE,
  INVESTMENT_CREATOR_DESCRIPTION_PLACEHOLDER,
} from '@/strings';
import {
  extractUniqueFiles,
  investmentStatusParser,
  validateFile,
  validateFiles,
} from '@/utils';
import {
  IMAGE_INVESTMENT_QUANTITY_LIMIT,
  TD_INVESTMENT_QUANTITY_LIMIT,
  DOC_INVESTMENT_QUANTITY_LIMIT,
  IMAGE_MIME_TYPES,
  DOC_MIME_TYPES,
  TD_MIME_TYPES,
  IMAGE_EXT_LIST,
  TD_EXT_LIST,
} from '@/constants';
import InvestmentInputDto from '@/core/api/investment/dto/investment.input';
import { FileBadge, InvestmentStatus } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/core/routing/Router';
import { emitError } from '@/toast-actions';
import { FancyMultiSelect } from '../FancyMultiSelect/FancyMultiSelect';
import BadgeDto, { BadgeInputDto } from '@/core/api/investment/dto/badge';
import AttachmentDto from '@/core/api/common/attachment/AttachmentDto';
import AttachmentBadge from './AttachmentBadge';
import InvestmentInputPatchDto from '@/core/api/investment/dto/investment-patch.input';
import { useUiStore } from '@/core/stores/ui-store';
import InvestmentDto from '@/core/api/investment/dto/investment';
import PanelLoader from '../loaders/PanelLoader';

const investmentFormSchema = z.object({
  title: z
    .string()
    .min(MIN_LENGTH_INVESTMENT_TITLE, { message: 'Tytuł jest wymagany' })
    .max(MAX_LENGTH_INVESTMENT_TITLE, {
      message: 'Tytuł nie może być dłuższy niż 100 znaków.',
    }),
  description: z
    .string()
    .min(MIN_LENGTH_INVESTMENT_CONTENT, { message: 'Opis jest wymagany' })
    .max(MAX_LENGTH_INVESTMENT_CONTENT, {
      message: 'Opis nie może być dłuższy niż 1000 znaków.',
    }),
  category: z.string().min(1, { message: 'Kategoria jest wymagana' }).max(50, {
    message: 'Nazwa kategorii nie może być dłuższa niż 50 znaków.',
  }),
  responsible: z
    .string()
    .min(MIN_LENGHT_INVESTMENT_RESPONSIBLE, {
      message: 'Odpowiedzialny jest wymagany',
    })
    .max(MAX_LENGHT_INVESTMENT_RESPONSIBLE, {
      message: 'Odpowiedzialny nie może być dłuższy niż 50 znaków.',
    }),
  isCommentable: z.string(),
  status: z
    .string()
    .min(1, { message: 'Status jest wymagany' })
    .max(20, { message: 'Status nie może być dłuższy niż 20 znaków.' }),
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
  badges: z
    .array(
      z.object({
        value: z.string(),
      }),
    )
    .optional(),
  model: z.any().optional(),
});

type InvestmentFormData = z.infer<typeof investmentFormSchema>;

export default function CreateInvestmentForm({ edit }: { edit?: boolean }) {
  const {
    postInvestment,
    setSingleInvestment,
    singleInvestmentLoading,
    singleInvestment,
    clearSingleInvestment,
    patchInvestment,
    setResetList,
  } = useInvestmentStore();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<BadgeInputDto[]>([]);
  const [uploadedModel, setUploadedModel] = useState<FileBadge[]>([]);
  const [uploadedThumbnail, setUploadedThumbnail] = useState<FileBadge[]>([]);
  const [uploadedAttachments, setUploadedAttachments] = useState<FileBadge[]>(
    [],
  );
  const [initialSingleInvestment, setInitialSingleInvestment] =
    useState<InvestmentDto>();

  const [initialUploadedModel, setInitialUploadedModel] = useState<FileBadge[]>(
    [],
  );
  const [initialUploadedThumbnail, setInitialUploadedThumbnail] = useState<
    FileBadge[]
  >([]);
  const [initialUploadedAttachments, setInitialUploadedAttachments] = useState<
    FileBadge[]
  >([]);

  const {
    badges,
    categories,
    statuses,
    fetchAvailableBadges,
    fetchAvailableCategories,
  } = useInvestmentStore();

  const { setRightbarStage } = useUiStore();
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    setRightbarStage(RIGHTBAR_STAGE_AREA);
  }, []);

  useEffect(() => {
    return () => {
      clearSingleInvestment();
    };
  }, []);

  useEffect(() => {
    const slug = window.location.pathname.split('/').pop();
    if (edit && slug) {
      setSlug(slug);
    }
  }, []);

  useEffect(() => {
    fetchAvailableBadges();
    fetchAvailableCategories();
    if (edit && slug) {
      setSingleInvestment(slug);
    }
  }, []);

  useEffect(() => {
    if (edit && slug) {
      setSingleInvestment(slug);
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

  function validateModel(
    event: ChangeEvent<HTMLInputElement>,
    onChange: (event: any) => void,
  ) {
    if (event.target && event.target.files?.length == 0) return;

    let guard = false;
    Array.from(event.target.files!).forEach((model) => {
      const [error, fileType] = validateFile(model, [FILE_TD_NAME]);

      if (error) {
        emitError(error);
        guard = true;
        return;
      }
    });

    if (guard) return;

    const files = event.target.files;
    onChange(files);
    if (edit) setUploadedModel([]);
  }

  useEffect(() => {
    if (singleInvestment && edit) {
      setInitialSingleInvestment(singleInvestment);
      form.setValue('title', singleInvestment.title);
      form.setValue('description', singleInvestment.content);
      form.setValue('category', singleInvestment.category.name);
      form.setValue('status', singleInvestment.status);
      form.setValue('responsible', singleInvestment.responsible);
      form.setValue(
        'isCommentable',
        singleInvestment.isCommentable
          ? FORM_IS_COMMENTABLE_TRUE
          : FORM_IS_COMMENTABLE_FALSE,
      );
      form.setValue('street', singleInvestment.street);
      form.setValue('buildingNr', singleInvestment.buildingNr);
      form.setValue('apartmentNr', singleInvestment.apartmentNr);

      setSelectedBadges(
        singleInvestment.badges.map((badge: BadgeDto) => ({
          value: badge.name,
          label: badge.name,
        })),
      );

      const attachment_thumbnail = singleInvestment.attachments.find(
        (attachment: AttachmentDto) =>
          attachment.fileType === FILE_IMAGE_NAME &&
          attachment.fileName === singleInvestment.thumbnail,
      );

      const attachment_model = singleInvestment.attachments.find(
        (attachment: AttachmentDto) => attachment.fileType === FILE_TD_NAME,
      );

      const rest_attachments = singleInvestment.attachments.filter(
        (attachment: AttachmentDto) =>
          attachment.fileName !== singleInvestment.thumbnail &&
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

      if (attachment_model) {
        const _m = {
          fileName: attachment_model!.fileName,
          fileType: attachment_model!.fileType,
        };
        setUploadedModel([_m]);
        setInitialUploadedModel([_m]);
      }

      const _as = rest_attachments.map((attachment: AttachmentDto) => ({
        fileName: attachment.fileName,
        fileType: attachment.fileType,
      }));
      setUploadedAttachments(_as);
      setInitialUploadedAttachments(_as);
    }

    return () => {
      clearSingleInvestment();
    };
  }, [singleInvestment]);

  useEffect(() => {
    if (!edit) {
      form.reset();
      setUploadedFiles([]);
      setUploadedModel([]);
      setUploadedThumbnail([]);
      clearSingleInvestment();
      setSelectedBadges([]);
    }
  }, [edit]);

  const [preview, setPreview] = useState('');

  const form = useForm<InvestmentFormData>({
    resolver: zodResolver(investmentFormSchema),
    mode: 'onChange', // może być też onSubmit
  });

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<InvestmentFormData> = (data) => {
    if (!data.thumbnail) {
      emitError('Miniatura jest wymagana');
      return;
    }

    const dto: InvestmentInputDto = {
      title: data.title,
      content: data.description,
      categoryName: data.category,
      status: data.status as InvestmentStatus,
      street: data.street,
      buildingNr: data.buildingNr,
      apartmentNr: data.apartmentNr,
      responsible: data.responsible,
      isCommentable:
        data.isCommentable === FORM_IS_COMMENTABLE_TRUE ? true : false,
      locationX: 51.110383,
      locationY: 17.033536,
      area: '51.109300,17.029289;51.109300,17.029489;51.109084,17.029289;51.109084,17.029489',
      thumbnail: data.thumbnail[0].name,
    };

    if (selectedBadges.length > 0) {
      dto.badges = selectedBadges.map((badge) => badge.value).join(',');
    }

    const modelfile = data.model ? data.model : [];
    const files: File[] = [
      ...extractUniqueFiles(
        [...uploadedFiles, ...modelfile, data.thumbnail[0]],
        [],
      ),
    ];
    const error = validateFiles(files, INVESTMENT_NAME);

    if (error) {
      emitError(error);
      return;
    }

    postInvestment(dto, files, () => {
      setResetList(true);
      navigate(ROUTES.MAP.INVESTMENTS.path());
    });
  };

  const onEdit: SubmitHandler<InvestmentFormData> = (data) => {
    const dto: InvestmentInputPatchDto = {
      title: data.title,
      content: data.description,
      categoryName: data.category,
      status: data.status as InvestmentStatus,
      street: data.street,
      buildingNr: data.buildingNr,
      apartmentNr: data.apartmentNr,
      responsible: data.responsible,
      isCommentable:
        data.isCommentable === FORM_IS_COMMENTABLE_TRUE ? true : false,
      locationX: 51.110383,
      locationY: 17.033536,
      area: '51.109300,17.029289;51.109300,17.029489;51.109084,17.029289;51.109084,17.029489',
    };

    if (!initialSingleInvestment) return;

    if (initialSingleInvestment.title === dto.title) {
      delete dto.title;
    }

    if (initialSingleInvestment.content === dto.content) {
      delete dto.content;
    }

    if (initialSingleInvestment.category.name === dto.categoryName) {
      delete dto.categoryName;
    }

    if (initialSingleInvestment.status === dto.status) {
      delete dto.status;
    }

    if (initialSingleInvestment.street === dto.street) {
      delete dto.street;
    }

    if (initialSingleInvestment.buildingNr === dto.buildingNr) {
      delete dto.buildingNr;
    }

    if (initialSingleInvestment.apartmentNr === dto.apartmentNr) {
      delete dto.apartmentNr;
    }

    if (initialSingleInvestment.responsible === dto.responsible) {
      delete dto.responsible;
    }

    if (initialSingleInvestment.isCommentable === dto.isCommentable) {
      delete dto.isCommentable;
    }

    if (initialSingleInvestment.locationX === dto.locationX) {
      delete dto.locationX;
    }

    if (initialSingleInvestment.locationY === dto.locationY) {
      delete dto.locationY;
    }

    if (initialSingleInvestment.area === dto.area) {
      delete dto.area;
    }

    const toBeExcluded = [];

    if (
      initialUploadedModel.length > 0 &&
      initialUploadedModel.length !== uploadedModel.length
    ) {
      toBeExcluded.push(
        `${initialUploadedModel[0].fileType}/${initialUploadedModel[0].fileName}`,
      );
    }

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

    const modelfile = data.model ? data.model : [];
    const thumbnailfile = data.thumbnail ? data.thumbnail : [];
    const filenamesToIgnore = uploadedAttachments.map((f) => f.fileName);
    const files: File[] = [
      ...extractUniqueFiles(
        [...uploadedFiles, ...thumbnailfile, ...modelfile],
        [...filenamesToIgnore, initialUploadedThumbnail[0].fileName],
      ),
    ];
    const error = validateFiles(files, INVESTMENT_NAME);

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
    patchInvestment(`${initialSingleInvestment.id}`, dto, files, (slug) => {
      setResetList(true);
      navigate(ROUTES.MAP.INVESTMENT.BY_NAME.path(slug));
    });
  };

  const itemizedBadges: BadgeInputDto[] = badges.map((badge) => ({
    value: badge.name,
    label: badge.name,
  }));

  const handleDeselectAttachment = (fileName: string) => {
    setUploadedAttachments((prev) =>
      prev.filter((attachment) => attachment.fileName !== fileName),
    );
  };

  const handleDeselectThumbnail = (fileName: string) => {
    setUploadedThumbnail([]);
  };

  const handleDeselectModel = (fileName: string) => {
    setUploadedModel([]);
  };

  return (
    <div className="p-8 h-full scrollable-vertical relative">
      {edit && singleInvestmentLoading && (
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
                  <FormLabel>Tytuł *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={INVESTMENT_CREATOR_TITLE_PLACEHOLDER}
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
                      placeholder={INVESTMENT_CREATOR_DESCRIPTION_PLACEHOLDER}
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
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status projektu *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz status projektu" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent position="popper">
                      {statuses?.map((status, i) => (
                        <SelectItem key={i} value={status}>
                          {investmentStatusParser[status]}
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
                  <FormLabel>Odpowiedzialny za inwestycję *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={INVESTMENT_RESPONSIBLE_TITLE_PLACEHOLDER}
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
                  <FormLabel>Możliwość komentowania inwestycji *</FormLabel>
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
            <div>
              <FormLabel>Odznaki</FormLabel>
              <FancyMultiSelect
                items={itemizedBadges}
                selected={selectedBadges}
                setSelected={setSelectedBadges}
                placeholder="Wybierz odznaki..."
              />
            </div>
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
                    <FormLabel>Numer domu</FormLabel>
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
                  IMAGE_INVESTMENT_QUANTITY_LIMIT +
                  TD_INVESTMENT_QUANTITY_LIMIT +
                  DOC_INVESTMENT_QUANTITY_LIMIT
                }
              />
              <FormDescription>
                {INVESTMENT_CREATOR_ATTACHMENTS_LABEL_PLACEHOLDER}
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
                        {INVESTMENT_CREATOR_THUMBNAIL_LABEL_PLACEHOLDER}
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
                        {INVESTMENT_CREATOR_THUMBNAIL_ACTION_PLACEHOLDER}
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

            <div className="gap-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field: { onChange, value, ...rest } }) => (
                  <>
                    <FormItem className="col-span-2">
                      <FormLabel>
                        {INVESTMENT_CREATOR_MODEL_LABEL_PLACEHOLDER}
                      </FormLabel>
                      {edit && uploadedModel.length > 0 && (
                        <div className="flex flex-wrap gap-2 m-2">
                          {uploadedModel.length > 0 &&
                            uploadedModel.map((file_badge: FileBadge) => (
                              <AttachmentBadge
                                fileBadge={file_badge}
                                deselect={handleDeselectModel}
                              />
                            ))}
                        </div>
                      )}
                      <FormControl>
                        <Input
                          type="file"
                          accept={`${[...TD_MIME_TYPES, ...TD_EXT_LIST].join(', ')}`}
                          {...rest}
                          onChange={(event) => {
                            validateModel(event, onChange);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        {INVESTMENT_CREATOR_MODEL_ACTION_PLACEHOLDER}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  </>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <IconButton
              icon={<MaterialSymbol size={36} icon="add" color="white" />}
              text={edit ? 'Edytuj inwetycję' : 'Dodaj inwestycję'}
              hint={
                edit
                  ? 'Inwestycja zostanie zaktualizowana.'
                  : 'Inwestycja zostanie dodana do listy inwestycji dla wszystkich użytkowników.'
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
