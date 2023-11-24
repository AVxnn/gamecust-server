export default class UserDto {
  email;
  id;
  isActivation;
  level;
  username;
  private;
  description;
  subscribers;
  iconActive;
  icons;
  subscriptions;
  avatarPath;

  constructor(model) {
    this.username = model.username;
    this.email = model.email;
    this.description = model.description;
    this.id = model._id;
    this.isActivated = model.isActivated;
    this.level = model.rating;
    this.subscribers = model.subscribers;
    this.subscriptions = model.subscriptions;
    this.private = model.private;
    this.iconActive = model.iconActive;
    this.icons = model.icons;
    this.avatarPath = model.avatarPath;
  }
}
