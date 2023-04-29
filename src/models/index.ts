type Dataset = "tgvmax";
type Facet = "date" | "origine" | "destination" | "od_happy_card";
type Field =
  | "heure_depart"
  | "heure_arrivee"
  | "date"
  | "destination"
  | "train_no"
  | "entity"
  | "origine"
  | "destination_iata"
  | "origine_iata"
  | "od_happy_card"
  | "axe"
  | "code_equip"
  | "origine,origine_iata"
  | "destination,destination_iata";
type HappyCardAvailability = "OUI" | "NON";
type ResponseFormats = "json";

export interface SortField {
  minus: boolean;
  field: Field;
}

export interface APIv2QueryParams {
  limit: number;
  offset: number;
  select?: string;
  where?: string[] | string;
  group_by?: Field;
  order_by?: string[] | string;
  refine?: string[] | string;
  facet?: Facet[] | Facet;
  timezone?: string;
}

export interface APIv1QueryParams {
  dataset: Dataset;
  rows: number;
  start: number;
  q?: string;
  sort?: SortField;
  facet?: Facet[];
}

export interface Station {
  id: string;
  label: string;
}

export interface UiJourney extends Journey {
  selected: boolean;
}

export interface Journey extends IAPIJourney {
  id: string;
  available: boolean;
}

export interface IAPIJourney {
  heure_depart: string;
  heure_arrivee: string;
  date: Date;
  destination: string;
  train_no: number;
  entity: string;
  origine: string;
  destination_iata: string;
  origine_iata: string;
  od_happy_card: HappyCardAvailability;
  axe: string;
  code_equip: string;
}

export interface ParametersResponse {
  dataset: Dataset[];
  timezone: string;
  rows: number;
  start: number;
  sort: SortField[];
  format: ResponseFormats;
  facet: Facet[];
}

export interface LinksResponse {
  href: string;
  ref: string;
}

export interface AggregationsValueResponse {
  origine?: string;
  origine_iata?: string;
  destination?: string;
  destination_iata?: string;
}

export interface AggregationsResponse {
  links: LinksResponse;
  aggregations: AggregationsValueResponse[];
}

export interface DatasetMetadataDefault {
  data_processed: Date;
}

export interface DatasetMetadata {
  default: DatasetMetadataDefault;
}
export interface DatasetInfo {
  metas: DatasetMetadata;
}
export interface DatasetInfoResponse {
  links: LinksResponse;
  dataset: DatasetInfo;
}

export interface IAPILink {
  href: string;
  rel: string;
}

export interface IAPIRecord {
  id: string;
  timestamp: Date;
  size: number;
  fields: IAPIJourney;
}

export interface IAPIRecordContainer {
  links: IAPILink[];
  record: IAPIRecord;
}

export interface RecordsResponse {
  total_count: number;
  links: IAPILink[];
  records: IAPIRecordContainer[];
}
