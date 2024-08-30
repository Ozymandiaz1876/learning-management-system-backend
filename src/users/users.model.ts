import {
  prop,
  getModelForClass,
  modelOptions,
  index,
  mongoose,
} from '@typegoose/typegoose';

@index({ email: 1 }, { unique: true })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @prop({
    type: String,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  })
  public _id?: string;

  @prop({ required: true, unique: true })
  public email!: string;

  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true })
  public password!: string;

  @prop({ ref: 'Role' })
  public role?: string;

  @prop({ ref: 'Status' })
  public status?: string;
}
export const UserModel = getModelForClass(User);
