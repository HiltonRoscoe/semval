export type Vri =
  | VriVoterRecordsRequest
  | VriRequestAcknowledgement
  | VriRequestRejection
  | VriRequestSuccess
  | VriVoterRecords;
export type VriBallotReceiptMethod = "email" | "email-or-online" | "fax" | "mail" | "online";
export type VriIdentifierType = "fips" | "local-level" | "national-level" | "ocd-id" | "other" | "state-level";
export type VriAddress =
  | FgdcAddressStandardCommunityAddressType
  | FgdcAddressStandardFourNumberAddressRangeType
  | FgdcAddressStandardGeneralAddressClassType
  | FgdcAddressStandardIntersectionAddressType
  | FgdcAddressStandardLandmarkAddressType
  | FgdcAddressStandardNumberedThoroughfareAddressType
  | FgdcAddressStandardTwoNumberAddressRangeType
  | FgdcAddressStandardUspsGeneralDeliveryOfficeType
  | FgdcAddressStandardUspsPostalDeliveryBoxType
  | FgdcAddressStandardUspsPostalDeliveryRouteType
  | FgdcAddressStandardUnnumberedThoroughfareAddressType;
export type VriRequestForm = "fpca" | "nvra" | "other";
export type VriPhoneCapability = "fax" | "mms" | "sms" | "voice";
export type VriContactMethodType = "email" | "other" | "phone";
export type VriSignatureSource = "dmv" | "local" | "other" | "state" | "voter";
export type VriSignatureType = "dynamic" | "electronic" | "other";
export type VriVoterHelperType = "assistant" | "witness";
export type VriRequestMethod =
  | "armed-forces-recruitment-office"
  | "motor-vehicle-office"
  | "other"
  | "other-agency-designated-by-state"
  | "public-assistance-office"
  | "registration-drive-from-advocacy-group-or-political-party"
  | "state-funded-agency-serving-persons-with-disabilities"
  | "unknown"
  | "voter-via-election-registrars-office"
  | "voter-via-email"
  | "voter-via-fax"
  | "voter-via-internet"
  | "voter-via-mail";
export type VriRequestProxyType =
  | "armed-forces-recruitment-office"
  | "motor-vehicle-office"
  | "other"
  | "other-agency-designated-by-state"
  | "public-assistance-office"
  | "registration-drive-from-advocacy-group-or-political-party"
  | "state-funded-agency-serving-persons-with-disabilities";
export type VriAssertionValue = "no" | "other" | "unknown" | "yes";
export type VriVoterClassificationType =
  | "activated-national-guard"
  | "active-duty"
  | "active-duty-spouse-or-dependent"
  | "citizen-abroad-intent-to-return"
  | "citizen-abroad-never-resided"
  | "citizen-abroad-return-uncertain"
  | "deceased"
  | "declared-incompetent"
  | "eighteen-on-election-day"
  | "felon"
  | "other"
  | "permanently-denied"
  | "protected-voter"
  | "restored-felon"
  | "united-states-citizen";
export type VriVoterIdType =
  | "drivers-license"
  | "local-voter-registration-id"
  | "other"
  | "ssn"
  | "ssn4"
  | "state-id"
  | "state-voter-registration-id"
  | "unknown"
  | "unspecified-document"
  | "unspecified-document-with-name-and-address"
  | "unspecified-document-with-photo-identification";
export type VriReportingUnitType =
  | "ballot-batch"
  | "ballot-style-area"
  | "borough"
  | "city"
  | "city-council"
  | "combined-precinct"
  | "congressional"
  | "county"
  | "county-council"
  | "drop-box"
  | "judicial"
  | "municipality"
  | "other"
  | "polling-place"
  | "precinct"
  | "school"
  | "special"
  | "split-precinct"
  | "state"
  | "state-house"
  | "state-senate"
  | "town"
  | "township"
  | "utility"
  | "village"
  | "vote-center"
  | "ward"
  | "water";
export type VriVoterRequestType = "ballot-request" | "lookup" | "other" | "registration";
export type VriRequestError =
  | "identity-lookup-failed"
  | "incomplete"
  | "incomplete-address"
  | "incomplete-birth-date"
  | "incomplete-name"
  | "incomplete-signature"
  | "ineligible"
  | "invalid-form"
  | "other";
export type VriSuccessAction =
  | "address-updated"
  | "name-updated"
  | "other"
  | "registration-cancelled"
  | "registration-created"
  | "registration-updated"
  | "status-updated";

export interface VriVoterRecordsRequest {
  "@type": "VRI.VoterRecordsRequest";
  AdditionalInfo?: VriAdditionalInfo[];
  BallotRequest?:
    | VriBallotRequest
    | VriElectionBasedBallotRequest
    | VriPermanentBallotRequest
    | VriTemporalBallotRequest
    | VriFpcaBallotRequest;
  Form?: VriRequestForm;
  GeneratedDate: string;
  Issuer?: string;
  OtherForm?: string;
  OtherRequestMethod?: string;
  OtherType?: string;
  RequestHelper?: VriRequestHelper[];
  RequestMethod: VriRequestMethod;
  RequestProxy?: VriRequestProxy;
  SelectedLanguage?: string;
  Subject: VriVoter | VriVoterRecord;
  TransactionId?: string;
  Type: VriVoterRequestType[];
  VendorApplicationId?: string;
}
export interface VriAdditionalInfo {
  "@type": "VRI.AdditionalInfo";
  FileValue?: VriFile | VriImage;
  Name: string;
  StringValue?: string;
}
export interface VriFile {
  "@type": "VRI.File";
  Data: string;
  FileName?: string;
  MimeType?: string;
}
export interface VriImage {
  "@type": "VRI.Image";
  Data: string;
  FileName?: string;
  MimeType?: string;
}
export interface VriBallotRequest {
  "@type": "VRI.BallotRequest";
  BallotReceiptPreference?: VriBallotReceiptMethod[];
}
export interface VriElectionBasedBallotRequest {
  "@type": "VRI.ElectionBasedBallotRequest";
  BallotReceiptPreference?: VriBallotReceiptMethod[];
  Election: VriElection;
}
export interface VriElection {
  "@type": "VRI.Election";
  EndDate?: string;
  ExternalIdentifier?: VriExternalIdentifier[];
  Name?: string;
  StartDate: string;
}
export interface VriExternalIdentifier {
  "@type": "VRI.ExternalIdentifier";
  OtherType?: string;
  Type: VriIdentifierType;
  Value: string;
}
export interface VriPermanentBallotRequest {
  "@type": "VRI.PermanentBallotRequest";
  BallotReceiptPreference?: VriBallotReceiptMethod[];
}
export interface VriTemporalBallotRequest {
  "@type": "VRI.TemporalBallotRequest";
  BallotReceiptPreference?: VriBallotReceiptMethod[];
  EndDate: string;
  StartDate: string;
}
export interface VriFpcaBallotRequest {
  "@type": "VRI.FpcaBallotRequest";
  BallotReceiptPreference?: VriBallotReceiptMethod[];
  EndDate: string;
  MailForwardingAddress?: VriAddress;
  StartDate: string;
}
export interface FgdcAddressStandardCommunityAddressType {
  "@type": "FGDCAddressStandard.CommunityAddress_type";
}
export interface FgdcAddressStandardFourNumberAddressRangeType {
  "@type": "FGDCAddressStandard.FourNumberAddressRange_type";
}
export interface FgdcAddressStandardGeneralAddressClassType {
  "@type": "FGDCAddressStandard.GeneralAddressClass_type";
}
export interface FgdcAddressStandardIntersectionAddressType {
  "@type": "FGDCAddressStandard.IntersectionAddress_type";
}
export interface FgdcAddressStandardLandmarkAddressType {
  "@type": "FGDCAddressStandard.LandmarkAddress_type";
}
export interface FgdcAddressStandardNumberedThoroughfareAddressType {
  "@type": "FGDCAddressStandard.NumberedThoroughfareAddress_type";
}
export interface FgdcAddressStandardTwoNumberAddressRangeType {
  "@type": "FGDCAddressStandard.TwoNumberAddressRange_type";
}
export interface FgdcAddressStandardUspsGeneralDeliveryOfficeType {
  "@type": "FGDCAddressStandard.USPSGeneralDeliveryOffice_type";
}
export interface FgdcAddressStandardUspsPostalDeliveryBoxType {
  "@type": "FGDCAddressStandard.USPSPostalDeliveryBox_type";
}
export interface FgdcAddressStandardUspsPostalDeliveryRouteType {
  "@type": "FGDCAddressStandard.USPSPostalDeliveryRoute_type";
}
export interface FgdcAddressStandardUnnumberedThoroughfareAddressType {
  "@type": "FGDCAddressStandard.UnnumberedThoroughfareAddress_type";
}
export interface VriRequestHelper {
  "@type": "VRI.RequestHelper";
  Address?: VriAddress;
  Name?: VriName;
  Phone?: VriPhoneContactMethod;
  Signature?: VriSignature;
  Type: VriVoterHelperType;
}
export interface VriName {
  "@type": "VRI.Name";
  FirstName?: string;
  FullName?: string;
  LastName?: string;
  MiddleName?: string[];
  Prefix?: string;
  Suffix?: string;
}
export interface VriPhoneContactMethod {
  "@type": "VRI.PhoneContactMethod";
  Capability?: VriPhoneCapability[];
  OtherType?: string;
  Type: VriContactMethodType;
  Value: string;
}
export interface VriSignature {
  "@type": "VRI.Signature";
  Date?: string;
  FileValue?: VriImage;
  OtherSource?: string;
  OtherType?: string;
  Source?: VriSignatureSource;
  Type?: VriSignatureType;
}
export interface VriRequestProxy {
  "@type": "VRI.RequestProxy";
  Address?: VriAddress;
  Name?: string;
  OriginTransactionId?: string;
  OtherType?: string;
  Phone?: VriPhoneContactMethod;
  TimeStamp?: string;
  Type: VriRequestProxyType;
}
export interface VriVoter {
  "@type": "VRI.Voter";
  ContactMethod?: (VriContactMethod | VriPhoneContactMethod)[];
  DateOfBirth?: string;
  Ethnicity?: string;
  Gender?: string;
  MailingAddress?: VriAddress;
  Name: VriName;
  Party?: VriParty;
  PreviousName?: VriName;
  PreviousResidenceAddress?: VriAddress;
  PreviousSignature?: VriSignature;
  ResidenceAddress: VriAddress;
  ResidenceAddressIsMailingAddress?: boolean;
  Signature?: VriSignature;
  VoterClassification?: VriVoterClassification[];
  VoterId?: VriVoterId[];
  VoterParticipation?: VriVoterParticipation[];
}
export interface VriContactMethod {
  "@type": "VRI.ContactMethod";
  OtherType?: string;
  Type: VriContactMethodType;
  Value: string;
}
export interface VriParty {
  "@type": "VRI.Party";
  Abbreviation?: string;
  ExternalIdentifier?: VriExternalIdentifier[];
  Name: string;
}
export interface VriVoterClassification {
  "@type": "VRI.VoterClassification";
  Assertion: VriAssertionValue;
  OtherAssertion?: string;
  OtherType?: string;
  Type: VriVoterClassificationType;
}
export interface VriVoterId {
  "@type": "VRI.VoterId";
  AttestNoSuchId?: boolean;
  DateOfIssuance?: string;
  FileValue?: VriFile | VriImage;
  OtherType?: string;
  StringValue?: string;
  Type: VriVoterIdType;
}
export interface VriVoterParticipation {
  "@type": "VRI.VoterParticipation";
  BallotStyle?: VriBallotStyle;
  Election: VriElection;
}
export interface VriBallotStyle {
  "@type": "VRI.BallotStyle";
  ExternalIdentifier?: VriExternalIdentifier[];
  ImageUri?: string[];
  Party?: VriParty[];
}
export interface VriVoterRecord {
  "@type": "VRI.VoterRecord";
  ContactMethod?: (VriContactMethod | VriPhoneContactMethod)[];
  DateOfBirth?: string;
  District?: VriReportingUnit[];
  ElectionAdministration?: VriElectionAdministration;
  Ethnicity?: string;
  Gender?: string;
  Locality?: VriReportingUnit[];
  MailingAddress?: VriAddress;
  Name: VriName;
  Party?: VriParty;
  PollingLocation?: VriReportingUnit;
  PreviousName?: VriName;
  PreviousResidenceAddress?: VriAddress;
  PreviousSignature?: VriSignature;
  ResidenceAddress: VriAddress;
  ResidenceAddressIsMailingAddress?: boolean;
  Signature?: VriSignature;
  VoterClassification?: VriVoterClassification[];
  VoterId?: VriVoterId[];
  VoterParticipation?: VriVoterParticipation[];
}
export interface VriReportingUnit {
  "@type": "VRI.ReportingUnit";
  ExternalIdentifier?: VriExternalIdentifier[];
  IsDistricted?: boolean;
  Location?: VriLocation;
  Name?: string;
  OtherType?: string;
  Type: VriReportingUnitType;
}
export interface VriLocation {
  "@type": "VRI.Location";
  Address?: VriAddress;
  Directions?: string;
  LatLng?: VriLatLng;
}
export interface VriLatLng {
  "@type": "VRI.LatLng";
  Latitude: number;
  Longitude: number;
  Source?: string;
}
export interface VriElectionAdministration {
  "@type": "VRI.ElectionAdministration";
  ContactMethod?: (VriContactMethod | VriPhoneContactMethod)[];
  Location?: VriLocation;
  Name?: string;
  Uri?: string[];
}
export interface VriRequestAcknowledgement {
  "@type": "VRI.RequestAcknowledgement";
  TransactionId?: string;
}
export interface VriRequestRejection {
  "@type": "VRI.RequestRejection";
  AdditionalDetails?: string[];
  Error?: VriRequestError[];
  OtherError?: string[];
  TransactionId?: string;
}
export interface VriRequestSuccess {
  "@type": "VRI.RequestSuccess";
  Action?: VriSuccessAction[];
  District?: VriReportingUnit[];
  EffectiveDate?: string;
  ElectionAdministration?: VriElectionAdministration;
  Locality?: VriReportingUnit[];
  PollingPlace?: VriReportingUnit;
  TransactionId?: string;
}
export interface VriVoterRecords {
  "@type": "VRI.VoterRecords";
  TransactionId?: string;
  VoterRecord?: VriVoterRecord[];
}
