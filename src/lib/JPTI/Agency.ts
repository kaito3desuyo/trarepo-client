import UUID from 'uuid/v4'
enum AgencyType{
  NONE,
  TRAIN1,
  TRAIN2,
  TRAIN3,
  NORMAL_BUS,
  FERRY,
  AIRPLANE,
  OTHER
}
export class Agency{
  private _id:string=UUID();
  get id():string{
    return this._id;
  }
  public name:string="";
  public number:string=null;
  public parentAgencyID:string=null;
  public agencyType:AgencyType=AgencyType.TRAIN1;
  public agencyURL:string=null;
  public agencyPhone:string=null;
  public agencyFareURL:string=null;

}
